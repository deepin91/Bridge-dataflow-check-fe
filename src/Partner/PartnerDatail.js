
import style from '../Partner/PartnerDatail.module.css'
import back_button from '../Tip/back-button.png'
import writer from '../Partner/note.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

const PartnerDatail = ({ match }) => {

    const { crIdx } = match.params;

    const [data, setData] = useState('');
    const [tag, setTag] = useState([]);
    const history = useHistory();
    const [userId, setUserId] = useState('');
    const [writer, setWriter] = useState('');
    const [writerProfile, setWriterProfile] = useState(''); // CHANGED: 변수명 충돌 방지

    const authHeaders = () => {
        const token = sessionStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
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
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/openPartnerDetail/${crIdx}`)
            .then((response) => {
                setData(response.data.partnerList);
                setTag(response.data.partnerTag);
                const user = response.data.partnerList.userId; 
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${user}`)
                    .then((r) => {console.log(">>>>>>>>>>>" + r.data.profile[0]); 
                        setWriterProfile(r.data.profile[0]);})
                    .catch((e) => { console.log(e) })
            })
            .catch((error) => {
                console.log(error);
            });
    }, [crIdx, history])

    const handleDelete = () => {
        if (userId == data.userId || userId == 'admin') {
            axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/deletePartner/${crIdx}`)
                .then((response) => {
                    Swal.fire(
                        'Success!',
                        '정상적으로 삭제되었습니다.',
                        'success'
                    )
                    history.push(`/partner/list`);
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            Swal.fire({
                icon: 'error',
                title: '삭제에 실패했습니다.',
                text: '작성자만 삭제가 가능합니다.'
            })
        }
    }

    const handleChat = async() => {
        try {
            const token = sessionStorage.getItem('token'); // NEW
            if (!token) {
                Swal.fire({ icon: 'error', title: '로그인이 필요합니다.' });
                history.push('/login');
                return;
            }
            if (!data?.userId) {
                Swal.fire({ icon: 'warning', title: '작성자 정보를 불러오지 못했습니다.' });
                return;
            }
            if (userId === data.userId) return; // 자기 자신 방지(버튼 disabled와 이중 체크)
            
            // ✅ 핵심: commissionIdx(crIdx) + commissionWriterId(data.userId) 포함
            const payload = {
                userId1: userId,               // 현재 로그인 사용자(나)
                userId2: data.userId,          // 상대(글 작성자)
                commissionIdx: Number(crIdx),  // 커미션 글 PK
                commissionWriterId: data.userId // 커미션 작성자(= client)
            };
            const res = await axios.post(
                `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chatroom`, 
                payload,
                { headers: authHeaders() }
            );
            // 채팅에서 자동 열 방 지정
            // const rid = res?.data?.roomIdx;
            
            // 채팅 페이지에서 자동 열릴 수 있도록 저장
            // if (res?.data?.roomIdx) {
            //     const rid = String(res.data.roomIdx);
            const rid = res?.data?.roomIdx ? String(res.data.roomIdx) : null;
            if (rid) {
                sessionStorage.setItem('lastRoomIdx', rid);
                history.push(`/chatting?roomIdx=${rid}`);
            } else {
                history.push('/chatting');
            }
        } catch (error) {
            // 여기서 나는 500/23000(중복키) 등은 DB 유니크키가 (user1,user2)만 잡혀있어서임
            const code = error?.response?.status;
            const msg = error?.response?.data?.message;
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: '채팅방 생성/입장 실패',
            text: error?.response?.data?.message || '잠시 후 다시 시도해주세요.'
        });
        }
    };



    return (
        <>
            <div className='container clearfix' >
                <Link to='/partner/list'>
                    <div className={style.back}>
                        <img className={style.backbutton} src={back_button} />
                    </div>
                </Link>
                <div className={style.writer}>
                    <Link to={`/profile/detail/${data.userId}`}> 
                    <img className={style.writerimg} 
                    src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${writerProfile?.profileImg}.jpg`} 
                    alt="작성자"
                    onError={(e) => { e.currentTarget.src = '/profileImg.png'; }}
                    />
                    <p>{data.userId}</p> 
                    </Link>
                </div>
                <div className={style.imgbox}>
                    <img src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.crPhoto}`}  alt="파트너 이미지" />
                </div>
                <div className={style.content}>
                    <div className={style.title}> <h2>{data.crTitle}</h2>
                    </div>
                    <div className={style.date}>
                        <p>작성일: {data.createdDt} </p>
                    </div>
                    <div className={style.duration}>
                        <p>기간: {data.crStartDate}~{data.crEndDate}</p>
                    </div>
                    <div className={style.pay}>
                        <p>금액: {data.crMoney} 원</p>
                    </div>
                    <div className={style.taglist}>
                        {tag.map((tag) => {
                            return (
                                <span className={style.tags}>#{tag.crtTag}</span>
                            )
                        })}
                    </div>
                </div>
                {/* 신청하기 버튼 클릭시 해당 유저와 채팅 연결 필요 */}
                {/* 1:1버튼에 disabled={userId === data.userId} 추가해서 자기자신이 작성한 글이면 클릭 안되도록 설정  */}
                <div className={style.buttonbox}>
                    <button onClick={handleChat} disabled={userId === data.userId}> 1:1 채팅 </button> 
                </div>
                <div className={style.buttonbox2}>
                    {userId == data.userId || userId == 'admin' ? <button onClick={handleDelete}>삭제하기</button> : ""}
                </div>

                <div className={style.line}></div>
                <div className={style.detail}>

                    <p>{data.crContents}</p>
                </div>
                <div className={style.line}></div>
            </div>

        </>
    )
}

export default PartnerDatail;