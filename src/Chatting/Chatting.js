import style from './Chatting.module.css';
import user from './user.png';
import hand from './hand.png';
import send from './send.png';
import { useRef, useState, useEffect, useCallback } from 'react';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Doing from '../Doing/Doing';
import Swal from "sweetalert2";
import { Icon } from '@iconify/react';

const Chatting = ({ match }) => {

    const client = useRef({});
    const [chatList, setChatList] = useState([]); // 참여 중인 채팅방 목록
    const [sender, setSender] = useState(''); // 로그인된 유저 ID
    const [message, setMessage] = useState([]);
    const [chat, setChat] = useState('');
    const [roomIdx, setRoomIdx] = useState('');
    const [receiver, setReceiver] = useState(''); // 현재 채팅 상대
    const [users, setUsers] = useState([]);
    const [receiverImg, setReceiverImg] = useState(''); // userId → 프로필 이미지 맵 // 배열 -> 문자열로 초기화
    const [receiverImgs, setReceiverImgs] = useState({}); // userId → profileImg map
    const [isClient, setIsClient] = useState(false);

    // sender:
    // 로그인된 내 아이디 (세션 기반으로 /api/chatroom에서 받아옴)

    // receiver:
    // 채팅방 클릭 시 상대방 유저 아이디 (즉, userId1 === sender이면 상대는 userId2, 반대도 마찬가지)

    // receiverImgs:
    // userId를 key로 갖는 이미지 캐시 맵
    // 예: { 'user123': 'img123abc', 'user456': 'img456xyz' }

    const history = useHistory();

    const publish = () => {
        if (!client.current.connected) return;
        client.current.publish({
            destination: '/pub/chat/message',
            body: JSON.stringify({
                roomIdx: roomIdx,
                data: chat,
                writer: sender
            }),
        });
        setChat('');
    };

    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: `ws://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/ws`,
            onConnect: () => {
                console.log('success');
            },
        });
        client.current.activate();
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        console.log("📦 Chatting 진입 시 저장된 토큰:", token);

        if (!token || token === "null" || token === "undefined") {
        // if (sessionStorage.getItem('token') == null) {

            Swal.fire({
                icon: 'error',
                title: '로그인이 필요합니다.',
                text: '로그인 페이지로 이동합니다.',
            });
            history.push('/login')
            return;
        }

        connect();
        /* 채팅방 목록 불러오기 */
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chatroom`, {
            // headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => {
                setChatList(Array.isArray(r.data.chatting) ? r.data.chatting : []);
                setSender(r.data.sender);  
                // ↑ 이 단계에서 어떤 채팅방들이 나랑 관련 있는지, 그리고 내 역할이 userId1인지 userId2인지 파악 가능
                sessionStorage.setItem("lastRoomIdx", r.data.chatting[0]?.roomIdx); // 안전하게 넣기
                // const lastRoomIdx = sessionStorage.getItem("lastRoomIdx");
            })
             .catch(e => {
            // ❗ 인증 오류 발생 시 강제 로그아웃 처리
            if (e.response?.status === 401 || e.response?.data?.message?.includes("인증")) {
                Swal.fire({
                    icon: 'error',
                    title: '세션 만료',
                    text: '다시 로그인 해주세요.',
                });
                sessionStorage.clear();
                history.push('/login');
            }
        });
    }, []);

    useEffect(() => {
        if (sender && chatList.length > 0) {
            const lastRoomIdx = sessionStorage.getItem("lastRoomIdx") || chatList[0].roomIdx;
            chatroom(parseInt(lastRoomIdx), sender);
        }
    }, [sender, chatList]);

    useEffect(() => {
        if (!sender || chatList.length === 0) return;

        // setUsers([]); 
        // setReceiverImgs({}); // 🔁 로그인 시 초기화

        /* 프로필 이미지 사전 로딩 
        현재 로그인된 sender와 반대편 유저를 찾아 targetId 설정
        이를 통해 채팅 목록에 보일 상대방 프로필 이미지 preload
        */
        
        chatList.forEach(list => {
            const targetId = list.userId1 === sender ? list.userId2 : list.userId1;

            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${targetId}`)
                .then(r => {
                    const profileData = r.data.profile[0];
                    if (profileData) {
                    setUsers((prev) => [...prev, profileData]);
                    setReceiverImgs((prevImgs) => ({
                    ...prevImgs,
                    [targetId]: profileData.profileImg || 'defaultImg',
                    }));
                 }
               });
             });
    }, [chatList, sender]);

    const chatroom = (props, senderId = sender) => {
        setReceiverImg(''); // 👈 이미지 초기화
        sessionStorage.setItem("lastRoomIdx", props);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chat/${props}`)
            .then(response => {
                console.log("💬 Chatroom response", response.data); 
                setMessage(response.data.messagelist);
                setRoomIdx(response.data.chatting.roomIdx);
                subscribe(response.data.chatting.roomIdx);

                if (senderId === response.data.chatting.userId1) {
                    setReceiver(response.data.chatting.userId2); // 채팅방 클릭 시 (chatroom() 호출 -- axios.get(`/api/profile/${상대방 userId}`) → setReceiverImg
                    setIsClient(false); // ❌ producer는 client 아님
                    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${response.data.chatting.userId2}`) //여기서는 실제 채팅방 메시지 + 상대방 이미지 호출 
                    // 단일 이미지만 쓰기 때문에 receiverImg라는 별도 상태에 저장
                        .then((r) => { setReceiverImg(r.data.profile[0].profileImg); });
                } else if (senderId === response.data.chatting.userId2){
                    setReceiver(response.data.chatting.userId1);
                    setIsClient(true); // ✅ client일 때만 true
                    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${response.data.chatting.userId1}`)
                        .then((r) => { setReceiverImg(r.data.profile[0].profileImg); });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    function subscribe(roomIdx) {
        client.current.subscribe('/sub/channel/' + roomIdx, recive);
    }

    const recive = useCallback((body) => {
        const json_body = JSON.parse(body.body);
        setMessage(message => [
            ...message,
            { roomIdx: json_body.roomIdx, data: json_body.data, writer: json_body.writer }
        ]);

        setChatList(prevList =>
            prevList.map(chat =>
                chat.roomIdx === json_body.roomIdx
                    ? { ...chat, lastMessage: json_body.data }
                    : chat
            )
        );
    }, []);

    const handleHand = () => {
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertCommission/${receiver}`, {
            "userId1": sender,
            "userId2": receiver
        })
            .then(r => {
                history.push(`/partner/doing`);
            })
            .catch(e => { console.log(e) });
    };

    return (
        <>
            <div className='container clearfix'>
                <div className={style.mainBox}>
                    <div className={style.chatListBox}>
                        <div className={style.chatListText}>채팅 목록</div>
                        <div className={style.chatListProfile}>
                            {chatList.map(list => {
                                let receiver;
                                if (list.userId1 === sender) receiver = list.userId2;
                                else if (list.userId2 === sender) receiver = list.userId1;

                                // const userProfile = users.find(user => user.userId === receiver);
                                // console.log("🧠 userProfile:", userProfile);
                                /* 채팅 목록 */
                                const profileImg = receiverImgs[receiver] || 'defaultImg';
                                return (
                                    <div key={list.roomIdx} className={style.profile} onClick={() => chatroom(list.roomIdx)}>
                                        <div className={style.profileImg}>
                                            <img 
                                                src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${profileImg}.jpg`}
                                                 onError={(e) => { e.target.src = '/default-profile.png'; }} // fallback
                                                className={style.profileIcon}
                                                alt="프로필"
                                            />
                                        </div>
                                        <div className={style.profileContent}>
                                            <div className={style.profileName}>{receiver}</div>
                                            <div className={style.shortChat}>
                                                {list.lastMessage || "대화가 없습니다. 채팅을 시작해주세요"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={style.chatBox}>
                        <div className={style.topText}>
              
                                <div className={style.receiver}> 
                                    <img src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${receiverImg}.jpg`} //채팅방 상단 이미지
                                        className={style.chatProfile} alt="프로필" />
                                </div>
                          
                            <div className={style.chatName}>{receiver}</div>
                        </div>
                        <div className={style.chat}>
                            <div className={style.chatbox}>
                                {message.map((d, index) => {
                                    console.log("📨 메시지:", d.data, "보낸사람:", d.writer, "나:", sender);
                                    
                                    return d.writer === sender ? (
                                         <div key={index} className={style.chatContent1}><p>{d.data}</p></div>
                                    ) : (
                                        d.writer != null ? (
                                            <div key={d.messageIdx} className={style.chatContent4}><p>{d.data}</p></div>
                                        ) : null
                                    );
                                })}
                            </div>
                            <div className={style.chatFoot}>
                                <input
                                    type="text"
                                    onChange={(e) => setChat(e.target.value)}
                                    value={chat}
                                    className={style.chatInput}
                                />
                                <button className={style.handButton} onClick={handleHand}
                                style={{ visibility: isClient ? 'visible' : 'hidden' }} >
                                    <Icon icon="la:handshake" color="#aaa" width="24" />
                                </button>
                                <button className={style.sendButton} onClick={publish}>
                                    <Icon icon="mingcute:send-fill" color="#fcfcfc" width="24" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatting;

// chatList, sender가 set되기 전에 useEffect가 먼저 실행되는 바람에 userId1 or 2의 프로필 이미지를 불러오지 못하는(undefined) 현상이 발생
// + 잘못된 API 요청이 반복되거나 receiverImgs가 다른 것들로 채워지기도
// useEffect(() => {}, [chatList]) 내부에서 setUsers([]), setReceiverImgs({})로 매번 상태를 초기화 → 이후 setState 무한 루프돌아 깜빡거리는 이슈
// -- chatroom() 호출이 너무 빨라서 receiverImgs가 세팅되기도 전에 UI가 다시 렌더됨 → 엑박 뜨는 문제

// 채팅페이지 들어갈 때 꼭 채팅목록에서 채팅을 선택하지 않더라도 마지막 대화한 상대방의 채팅방과 그 대화내용이 불려와졌으면 함
// -> 이곳저곳 코드 고치다보니 꼬여버려 원래대로 돌려도 래팅목록의 상대방 프로필 이미지가 안 보이는 현상 + 대화중인 두 계정 중 한 계정에서만 제대로 보이고 다른 한 계정에선 대화목록의 상대방 프로필 이미지가 안 보이는 이슈 발생
// -> 상태 초기화 시점, useEffect 타이밍이 꼬임 
// 원인 -- chatList, sender가 비어 있는 시점에 useEffect가 실행 > targetId가 undefined인 상태로 /api/profile/undefined 요청이 발생
// 해결 -- setReceiverImgs({}); 이 코드가 useEffect([chatList, sender]) 내부에 포함되어 있어서 receiverImgs가 매번 초기화 → 이미지가 뜨기도 전에 사라짐
// receiverImg는 한 번만 설정해야 하는데 chatroom()이 자주 호출시켜 계속 갱신됨 → 깜빡임 현상

// receiverImgs 초기화 위치 문제 -> 로그인 직후 1회만 초기화, 이후엔 유지 -- 
// receiver의 프로필 이미지 설정 중복 -> receiverImgs라는 전체 맵 구조로 통일하고, receiverImg는 채팅방 상단만 담당 --이미지 fallback 처리
// useEffect 실행 순서 -> sender && chatList.length > 0 조건으로 보호
// 무한 깜빡임 -> setState 루프 제거 및 chatroom() 반복 호출 방지
// undefined 대상 API 요청 -> userId1, userId2 비교에서 명확히 targetId set

// 초기 상태 세팅과 비동기 요청의 순서 꼬임으로 인해 undefined에 대한 API 호출 
// 상태의 반복 초기화
// 이미지 불일치/깜빡임 현상 등이 발생 -> 상태 분리 및 조건부 실행으로 해결

// isClient 상태를 추가해서 chatroom() 에 profileImg 불러오려 set 할 때 그 밑에 true/ false 설정
// > 이 방법으로 client의 채팅창에서만 협업 버튼 보이도록 설정(client가 아닌 producer가 버튼 눌렀을 경우 결제 단계에서 꼬이므로 사전에 차단)