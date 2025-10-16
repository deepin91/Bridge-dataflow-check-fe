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
    const [roomActive, setRoomActive] = useState(true);
    // const [commissionIdx, setCommissionIdx] = useState(null);           // NEW
    // const [commissionWriterId, setCommissionWriterId] = useState(null); // NEW

    const chatEndRef = useRef(null); // 자동 스크롤
    const activatedRef = useRef(false);   // connect() 중복 호출 가드
    const subscriptionRef = useRef(null); // 현재 구독 핸들

    const HANDSHAKE_EVENT = '__HANDSHAKE_START__';

    // sender:
    // 로그인된 내 아이디 (세션 기반으로 /api/chatroom에서 받아옴)

    // receiver:
    // 채팅방 클릭 시 상대방 유저 아이디 (즉, userId1 === sender이면 상대는 userId2, 반대도 마찬가지)

    // receiverImgs:
    // userId를 key로 갖는 이미지 캐시 맵
    // 예: { 'user123': 'img123abc', 'user456': 'img456xyz' }

    const history = useHistory();

    const publish = () => {
        if (!client.current.connected || !roomIdx || !chat.trim())  return; //  채팅방이 열리지 않았거나 메시지 내역이 없으면 전송x
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
        if (activatedRef.current) return;   // 이미 activate됨 → 재호출 차단
        activatedRef.current = true;
        client.current = new StompJs.Client({
            brokerURL: `ws://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/ws`,
            onConnect: () => {
                console.log('success');
            },
            onWebSocketClose: () => {          // 소켓 종료 시 플래그/핸들 리셋
                activatedRef.current = false;
                subscriptionRef.current = null;
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
                // setChatList(Array.isArray(r.data.chatting) ? r.data.chatting : []);
                setChatList(Array.isArray(r.data.chatting)
                 ? r.data.chatting.map(row => ({
                     ...row,
                     lastMessage: row.lastMessage === HANDSHAKE_EVENT ? '' : row.lastMessage
                   }))
                 : []
                );
                setSender(r.data.sender);  
                // ↑ 이 단계에서 어떤 채팅방들이 나랑 관련 있는지, 그리고 내 역할이 userId1인지 userId2인지 파악 가능
                sessionStorage.setItem("lastRoomIdx", r.data.chatting[0]?.roomIdx || ''); // 안전하게 넣기
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
    }, [history]); // 의존성 최소화

    useEffect(() => {
        if (sender && chatList.length > 0) {
            const lastRoomIdx = sessionStorage.getItem("lastRoomIdx") || chatList[0].roomIdx;
            chatroom(parseInt(lastRoomIdx, 10), sender);
        }
    }, [sender, chatList]);

    // 프로필 이미지 사전 로딩
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
                    const profileData = r.data.profile?.[0];
                    if (profileData) {
                    setUsers((prev) => [...prev, profileData]);
                    setReceiverImgs((prevImgs) => ({
                    ...prevImgs,
                    [targetId]: profileData.profileImg || 'defaultImg',
                    }));
                 }
               })
                .catch(() => { /* ignore */ });
             });
    }, [chatList, sender]);

    // 채팅 자동 스크롤
    useEffect(() => {
        if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ 
            behavior: message.length > 1 ? 'smooth' : 'auto', 
        });
        }
    }, [message]); // 메시지가 바뀔 때마다 실행


    const chatroom = (targetRoomIdx, senderId = sender) => {
        const token = sessionStorage.getItem('token'); 
        
        // 다른 방으로 이동할 때만 일부 상태 초기화
        if (roomIdx !== targetRoomIdx) {
        // ✅ 이전 상태 초기화
        setReceiver('');
        setReceiverImg('');
        setIsClient(false); // ✅ 이전 채팅방의 상태 초기화
        }
        sessionStorage.setItem("lastRoomIdx", targetRoomIdx);
        sessionStorage.removeItem(`hs:${targetRoomIdx}`); // ← 해당 방 이동 플래그 초기화

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chat/${targetRoomIdx}`,{
             headers: { 'Authorization': `Bearer ${token}` } // NEW: 인증 헤더 추가
        })
            .then(response => {
                const chatData = response.data.chatting;
                const msgList = response.data.messagelist;
                const isClientFlag = response.data.isClient; 
                
                // 채팅 메시지 세팅 및 roomIdx, WebSocket 구독
                // setMessage(Array.isArray(msgList) ? msgList : []);
                setMessage(Array.isArray(msgList) ? msgList.filter(m => m?.data !== HANDSHAKE_EVENT) : []);
                
                if (roomIdx !== chatData.roomIdx) {
                    setRoomIdx(chatData.roomIdx);
                    subscribe(chatData.roomIdx);
                }    
                setIsClient(!!isClientFlag); // CHANGED: 서버 판단만 신뢰
                setRoomActive(chatData?.active !== false); // 기본 true, 응답이 false면 완료상태

                // setCommissionIdx(chatData.commissionIdx ?? null);
                // setCommissionWriterId(chatData.commissionWriterId ?? null); 

                // isClient 여부 설정 (서버 응답에 따라 정확히 세팅)
                // if (typeof isClientFlag !== 'undefined') {
                //     setIsClient(isClientFlag);
                //     console.log("🎯 서버에서 받은 isClient:", isClientFlag);
                // }
                // // } else {
                // //     console.warn("⚠️ 서버 응답에 isClient 없음 (백엔드 확인 필요)");
                // }

                const target = senderId === chatData.userId1 ? chatData.userId2 : chatData.userId1;
                // 이미 설정된 값이면 재요청/재세팅 안함 → 깜빡임 방지
                if (receiver !== target) {
                    setReceiver(target);
                    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${target}`)
                        .then((r) => setReceiverImg(r.data.profile?.[0]?.profileImg || 'defaultImg'))
                        .catch(() => setReceiverImg('defaultImg'));
                }
            }) 
            .catch(console.error);
        };    
                
                // ✅ 채팅 상대방(receiver) 설정 및 이미지 가져오기
                // if (senderId === chatData.userId1) {
                    
                //     setReceiver(target);
                //     axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${target}`)
                //         .then((r) => setReceiverImg(r.data.profile[0].profileImg));
                // } else {
                //     const target = chatData.userId1;
                //     setReceiver(target);
                //     axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${target}`)
                //         .then((r) => setReceiverImg(r.data.profile[0].profileImg));
                // }

                // if (senderId === response.data.chatting.userId1) {
                //     setReceiver(response.data.chatting.userId2); // 채팅방 클릭 시 (chatroom() 호출 -- axios.get(`/api/profile/${상대방 userId}`) → setReceiverImg
                //     setIsClient(false); // ❌ producer는 client 아님
                //     axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${response.data.chatting.userId2}`) //여기서는 실제 채팅방 메시지 + 상대방 이미지 호출 
                //     // 단일 이미지만 쓰기 때문에 receiverImg라는 별도 상태에 저장
                //         .then((r) => { setReceiverImg(r.data.profile[0].profileImg); });
                // } else if (senderId === response.data.chatting.userId2){
                //     setReceiver(response.data.chatting.userId1);
                //     setIsClient(true); // ✅ client일 때만 true
                //     axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${response.data.chatting.userId1}`)
                //         .then((r) => { setReceiverImg(r.data.profile[0].profileImg); });
                // }

    function subscribe(roomIdx) {
        // client.current.subscribe('/sub/channel/' + roomIdx, receive);
    if (!client.current?.connected) return;
    if (subscriptionRef.current) {
        try { subscriptionRef.current.unsubscribe(); } catch (_) {}
        subscriptionRef.current = null;
    }
    subscriptionRef.current = client.current.subscribe('/sub/channel/' + roomIdx, receive);
    }

    // 2) receive: 이벤트 감지 → 중복 방지 후 이동, 일반 메시지는 기존 로직 유지
    const receive = useCallback((body) => {
        const json_body = JSON.parse(body.body);

        // 👇 협업 시작 이벤트면 둘 다 이동(방별 1회만)
        if (json_body?.data === '__HANDSHAKE_START__') {
        const key = `hs:${json_body.roomIdx}`;
        if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');      // 중복 이동 방지 플래그
        history.push('/partner/doing');
        }
        return; // 이벤트 메시지는 채팅창에 표시하지 않음
    }
        setMessage(prev  => [
            ...prev ,
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
        if (!isClient) return; // 💥 클라이언트가 아닌 경우 동작 막기 (프론트 보안)

        const token = sessionStorage.getItem('token');
        const producerId = receiver; // isClient=true면 sender=client, 상대가 producer

        // 필수값 검증
        if (!sender || !producerId || !roomIdx) {
        Swal.fire({ icon: 'warning', title: '필수 정보가 없습니다.', text: '방을 다시 열거나 새로고침 해주세요.' });
        return;
        }

        // // 1. 작성자 갱신 요청 보내기
        // axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chat/${roomIdx}/updateRole`, null, {
        //     headers: {
        //         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        //     },
        // })
        // .then(() => {
        // 2. 기존 협업 등록 로직 실행
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertCommission/${producerId}`, {
            userId1: sender, // --client
            userId2: producerId, // producer
            // coMoney: 
            // commissionIdx: commissionIdx,
            // commissionWriterId: commissionWriterId // ← 새 커미션 글 작성자
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(() => {
                // 👇 작업 시작 이벤트를 채팅방에 브로드캐스트 (양쪽 모두 수신)
                if (client.current?.connected) {
                    client.current.publish({
                    destination: '/pub/chat/message',
                    body: JSON.stringify({
                    roomIdx,
                    data: '__HANDSHAKE_START__', // 이벤트 토큰(상수/Ref 없이 직접 사용)
                    writer: sender,
                }),
            });
        }
     })
         .catch(e => {
            console.error("악수 처리 중 오류 발생", e);
            Swal.fire({ icon: 'error', title: '협업 등록 실패', text: e?.response?.data?.message || '다시 시도해주세요.' });
        });
    };

    useEffect(() => {
        return () => {
            try {
          if (subscriptionRef.current) { subscriptionRef.current.unsubscribe(); subscriptionRef.current = null; }
          if (client.current && client.current.connected) { client.current.deactivate(); }
        } catch {}
        activatedRef.current = false;
      };
    }, []);


    return (
        <>
            <div className='container clearfix'>
                <div className={style.mainBox}>
                    <div className={style.chatListBox}>
                        <div className={style.chatListText}>채팅 목록</div>
                        <div className={style.chatListProfile}>
                            {chatList.map(list => {
                                let partner;
                                if (list.userId1 === sender) partner = list.userId2;
                                else if (list.userId2 === sender) partner = list.userId1;
                                // if (list.userId1 === sender) receiver = list.userId2;
                                // else if (list.userId2 === sender) receiver = list.userId1;

                                // const userProfile = users.find(user => user.userId === receiver);
                                // console.log("🧠 userProfile:", userProfile);
                                /* 채팅 목록 */
                                const profileImg = receiverImgs[partner] || 'defaultImg';
                                return (
                                    <div key={list.roomIdx} className={style.profile} onClick={() => chatroom(list.roomIdx)}>
                                        <div className={style.profileImg}>
                                            <img 
                                                src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${profileImg}.jpg`}
                                                 onError={(e) => { e.currentTarget.src = '/profileImg.png'; }} // fallback
                                                className={style.profileIcon}
                                                alt="프로필"
                                            />
                                        </div>
                                        <div className={style.profileContent}>
                                            <div className={style.profileName}>{partner}</div>
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
                        {receiver ? (
                        <div className={style.topText}>
                                <div className={style.receiver}> 
                                    <img src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${receiverImg}.jpg`} //채팅방 상단 이미지
                                        className={style.chatProfile} alt="프로필" 
                                        onError={(e) => { e.currentTarget.src = '/profileImg.png'; }}/>
                                </div>
                            <div className={style.chatName}>{receiver}</div>
                        </div>
                        ) : (
                          <div className={style.topText}>
                                <div className={style.receiver}> 
                                    <img src="/profileImg.png"
                                        className={style.chatProfile} alt="기본 프로필" />
                                </div>
                            <div className={style.chatName}> 대화상대를 선택하세요 </div>
                        </div>  
                        )}
                        <div className={style.chat}>
                            <div className={style.chatbox}>
                            {message.length === 0 ? (
                                <div className={style.noMessage}>
                                    {roomActive ? '아직 대화가 없습니다. 메시지를 보내 대화를 시작하세요!' : '작업이 완료된 채팅방입니다.'}
                                    {/* 아직 대화가 없습니다. 메시지를 보내 대화를 시작하세요! */}
                                </div>
                                ) : (
                                message.map((d, index) => {
                                    console.log("📨 메시지:", d.data, "보낸사람:", d.writer, "나:", sender);
                                    
                                    return d.writer === sender ? (
                                         <div key={index} className={style.chatContent1}><p>{d.data}</p></div>
                                    ) : (
                                        d.writer != null ? (
                                            <div key={index} className={style.chatContent4}><p>{d.data}</p></div>
                                        ) : null
                                    );
                                })
                                )}
                                <div ref={chatEndRef}/> {/* 채팅 자동 스크롤 */}
                            </div>
                            <div className={style.chatFoot}>
                                <input
                                    type="text"
                                    onChange={(e) => setChat(e.target.value)}
                                    value={chat}
                                    className={style.chatInput}
                                    readOnly={!roomActive}
                                    placeholder={roomActive ? '' : '작업이 완료된 채팅방입니다.'}
                                />

                                <button className={style.handButton} onClick={handleHand}
                                style={{ visibility: isClient ? 'visible' : 'hidden' }}
                                title={isClient ? "협업 시작" : "클라이언트만 사용할 수 있습니다"} >
                                    <Icon icon="la:handshake" color="#aaa" width="24" />
                                </button>
                                <button className={style.sendButton} onClick={publish}
                                disabled={!roomIdx || !roomActive}
                                style={{
                                    backgroundColor: (!roomIdx || !roomActive) ? '#ccc' : '#2b88ff',
                                    cursor: (!roomIdx || !roomActive) ? 'not-allowed' : 'pointer'
                                    }}
                                >
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