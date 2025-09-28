
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
                    .then((r) => {console.log(">>>>>>>>>>>" + r.data.profile[0]); setWriter(r.data.profile[0]);})
                    .catch((e) => { console.log(e) })
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

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

    const handleChat = (e) => {
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chatroom`, { "userId1": userId, "userId2": data.userId })
            .then(res => {
                console.log(res);

            })
            .catch(error => {
                console.log(error);
                console.log(process.env.REACT_APP_IP);
                console.log(process.env.REACT_APP_PORT);
                console.log(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chatroom`)
            })
        history.push("/chatting")
    }


    return (
        <>
            <div className='container clearfix' >
                <Link to='/partner/list'>
                    <div className={style.back}>
                        <img className={style.backbutton} src={back_button} />
                    </div>
                </Link>
                <div className={style.writer}>
                    <Link to={`/profile/detail/${data.userId}`}> <img className={style.writerimg} 
                    src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${writer.profileImg}.jpg`} />
                        <p>{data.userId}</p> </Link>
                </div>
                <div className={style.imgbox}>
                    <img src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.crPhoto}`} />
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
                <div className={style.buttonbox}>
                    <button onClick={handleChat}> 1:1 채팅 </button>
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