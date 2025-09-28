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
    const [chatList, setChatList] = useState([]);
    const [sender, setSender] = useState('');
    const [message, setMessage] = useState([]);
    const [chat, setChat] = useState('');
    const [roomIdx, setRoomIdx] = useState('');
    const [receiver, setReceiver] = useState('');
    const [users, setUsers] = useState([]);
    const [receiverImg, setReceiverImg] = useState([]);

    const history = useHistory();

    const publish = () => {
        if (!client.current.connected) return;
        client.current.publish({
            destination: '/pub/hello',
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
        if (sessionStorage.getItem('token') == null) {
            Swal.fire({
                icon: 'error',
                title: '로그인이 필요합니다.',
                text: '로그인 페이지로 이동합니다.',
            })
            history.push('/login')
            return;
        }
        connect();
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/chatroom`, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(r => {
                setChatList(r.data.chatting)
                console.log(">>>>>>>>" + r.data.chatting);
                setSender(r.data.sender)
            });
    }, []);

    useEffect(() => {
        chatList.forEach(list => {
            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${list.userId2}`)
                .then(r => {
                    console.log(">>>>>>>>>" + r.data.profile[0]);
                    setUsers(prevUsers => [...prevUsers, r.data.profile[0]]);
                    console.log("+++++++++++++" + users);
                });
        });
    }, [chatList]);

    const chatroom = (props) => {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/chat/${props}`)
            .then(response => {
                setMessage(response.data.messagelist);
                setRoomIdx(response.data.chatting.roomIdx);
                subscribe(response.data.chatting.roomIdx);
                if (sender === response.data.chatting.userId1) {
                    setReceiver(response.data.chatting.userId2);
                    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${response.data.chatting.userId2}`)
                        .then((r) => { setReceiverImg(r.data.profile[0].profileImg); console.log("111111111111" + r.data.profile[0].profileImg); })
                        .catch((e) => { console.log(e); })

                } else if (sender === response.data.chatting.userId2) {
                    setReceiver(response.data.chatting.userId1);
                    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${response.data.chatting.userId1}`)
                        .then((r) => { setReceiverImg(r.data.profile[0].profileImg); console.log("111111111111" + r.data.profile[0].profileImg); })
                        .catch((e) => { console.log(e); })
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
    }, []);

    const handleHand = () => {
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertCommission/${receiver}`, { "userId1": sender })
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
                                if (list.userId1 === sender) {
                                    receiver = list.userId2;
                                } else if (list.userId2 === sender) {
                                    receiver = list.userId1;
                                }
                                const userProfile = users.find(user => user.userId === receiver);
                                const profileImg = userProfile ? userProfile.profileImg : '';
                                return (
                                    <div className={style.profile} onClick={() => chatroom(list.roomIdx)}>
                                        <div className={style.profileImg}>
                                            <img
                                                src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${profileImg}.jpg`}
                                                className={style.profileIcon}
                                                
                                            />
                                        </div>
                                        <div className={style.profileContent}>
                                            <div className={style.profileName}>{receiver}</div>
                                            <div className={style.shortChat}>안녕하세요 작곡의뢰 ..</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={style.chatBox}>
                        <div className={style.topText}>
                            <div className={style.receiver}>
                                <img src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${receiverImg}.jpg`} className={style.chatProfile} alt="프로필" />
                                {/* <div className={style.chatName}>{receiver}</div> */}
                            </div>
                            <div className={style.chatName}>{receiver}</div>
                        </div>
                        <div className={style.chat}>
                            <div className={style.chatbox}>
                                {message.map(d => {
                                    if (d.writer === sender) {
                                        return <div className={style.chatContent1}><p>{d.data}</p></div>;
                                    } else if (d.writer != null && d.writer !== sender) {
                                        return <div className={style.chatContent4}><p>{d.data}</p></div>;
                                    }
                                })}
                            </div>
                            <div className={style.chatFoot}>
                            <input
                                    type="text"
                                    onChange={(e) => setChat(e.target.value)}
                                    value={chat}
                                    className={style.chatInput}
                                />

                                {/* <div className={style.v_line}> */}
                                <button onClick={handleHand} className={style.handButton}>
                                    <Icon icon="la:handshake" color="#aaa" width="24" />
                                </button>

                               


                                {/* <input
                                    type="text"
                                    onChange={(e) => setChat(e.target.value)}
                                    value={chat}
                                    className={style.chatInput}
                                /> */}
                                <button className={style.sendButton} onClick={publish}>
                                    <Icon icon="mingcute:send-fill" color="#fcfcfc" width="24" />
                                </button>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatting;