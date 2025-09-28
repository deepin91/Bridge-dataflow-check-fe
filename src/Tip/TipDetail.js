import style from './TipDetail.module.css'
import { Route, Link } from 'react-router-dom';
import back_button from './back-button.png'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Viewer } from '@toast-ui/react-editor';
// import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import jwtDecode from 'jwt-decode';
// import HeartButton from './HeartButton';
// import HeartImg from './HeartImg.png';
// import EmptyHeartImg from './EmptyHeartImg.png';
import TipHeartCnt from './TipHeartCnt';
import Swal from "sweetalert2";


const TipDetail = ({ match }) => {
    const [data, setData] = useState({});
    const [comments, setComments] = useState([]);


    const tb_idx = match.params.tbIdx;
    const [temp, setTemp] = useState()
    const history = useHistory();
    const [user, setUser] = useState('');

    // const [likeUpdate, setLikeUpdate] = useState(false)
    // const [LikeCt, setLikeCt] = useState(0)
    // const [userNickname, setUserNickname] = useState('');
    // const tb_heart = match.params.tbHeart;
    // const [hearts, setHearts] = useState();

    const [heartsCnt, setHeartsCnt] = useState();

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
        const token = sessionStorage.getItem('token')
        const decode = jwtDecode(token);
        setUser(decode.sub);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}/1`)
            .then(r => {
                setData(r.data.tipDetail);
                setComments(r.data.commentsList);
                setHeartsCnt(r.data.tbHeart)
            })
    }, [])

    const insert = (e) => {
        e.preventDefault();
        if (temp.length >= 100) {
            Swal.fire({
                icon: 'error',
                title: '글자수가 100자를 초과합니다',
                text: '제한된 글자수에 맞게 다시 작성해주세요.'
            })
        } else {
            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/comment`,
                { "tbIdx": tb_idx, "tbcComments": temp },
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
            ).then(() => {
                console.log("asdasdasd")
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/comments/${tb_idx}`)
                    .then(r => {
                        console.log(r.data)
                        setComments(r.data)
                    })
            }
            )
        }
        setTemp("");
    }

    const handlerdelete = () => {
        if (user == data.userId || user == 'admin') {
            axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tip/delete/${tb_idx}`,
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
                .then(() => {
                    Swal.fire(
                        'Success!',
                        '정상적으로 삭제되었습니다.',
                        'success'
                    )
                    history.push('/tip/list')

                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: '삭제에 실패했습니다.',
                        text: '다시 시도해주세요.'
                    })
                })
        } else {
            Swal.fire({
                icon: 'error',
                title: '삭제에 실패했습니다.',
                text: '작성자만 삭제가 가능합니다.'
            })
            history.push('/')
        }

    }

    // // const Post = (props) => {
    //     const [like, setLike] = useState(false)
    //     const [hearts, setHearts] = useState();
    //     useEffect(async () => {
    //         // ...
    //       const fetchData = async () => {
    //         const res = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}`,
    //         { "tbIdx": tb_idx, "tbHeart": tb_heart },
    //         { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })

    //         if (res.data.type === 'liked') {
    //         setLike(true)
    //         // setHearts(heartsCnt + 1)

    //       } else {
    //         setLike(false)
    //       }
    //       fetchData()
    //     }
    //     }, []);


    //     // const [hidePassword2, setHidePassword2] = useState(true);
    // // const [showLockedButton, setShowLockedButton] = useState(true);
    // const [src, setSrc] = useState(EmptyHeartImg);

    // const toggleLike = () => {
    //     const res = axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}`)


    //     setLike(!like)
    //     if (!like) {
    //         setSrc(!EmptyHeartImg);
    //         // setHeartsCnt(tb_heart);
    //     } else {
    //         setSrc(HeartImg);
    //         // setHeartsCnt(tb_heart);
    //         // setHeartsCnt(heartsCnt + 1);
    //     }
    // }


    // axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/delete/${pcIdx}`)
    //         .then(response => {
    //             console.log(response);
    //             if (response.data === "Y") {
    //                 alert('정상적으로 삭제되었습니다.');
    //                 window.location.replace(`/17`);
    //             } else {
    //                 alert('삭제에 실패했습니다.');
    //                 return;
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             alert(`삭제에 실패했습니다. (${error.message})`);
    //             return;
    //         });


    // const toggleLike = async (e) => {
    //   const res = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail`) // [POST] 사용자가 좋아요를 누름 -> DB 갱신
    //   setLike(!like)
    // }






    // function TipHeartCnt({history, tbIdx}) {


    //     const [heartUpdate, setHeartUpdate] = useState(false)
    //     const [heartCnt, setHeartCnt] = useState(0) 
    //     // const [userNickname, setUserNickname] = useState('');

    //     useEffect(() => {
    //         const token = sessionStorage.getItem('token');
    //         const decodedToken = jwt_decode(token);
    //         console.log(decodedToken);
    //         // setUserNickname(decodedToken.userNickname);

    //         // axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}`)
    //         axios.get(`http://localhost:8080/api/tipdetail/${tbIdx}/getHeart`)
    //             .then(response => {
    //                 console.log(response);
    //                 setHeartCnt(response.data.tbHeart);
    //             })
    //             .catch(error => console.log(error));
    //     }, []);

    //     const heartUpdateHandler = () => {
    //         setHeartUpdate(!heartUpdate)
    //       }

    //     const heartCountHandler = () => {
    //         heartUpdateHandler()

    //     if (!heartUpdate) {
    //         setHeartCnt(heartCnt +1)
    //         // axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}/Heart`,
    //         axios.put(`http://localhost:8080/api/tipdetail/${tb_idx}/heart`,  
    //         {tbIdx})
    //         .then(response => {                           
    //             console.log(response);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             return;
    //         });
    //     } else if (heartUpdate) {
    //         setHeartCnt(heartCnt -1)
    //         // axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}/unlike`,
    //         axios.put(`http://localhost:8080/api/tipdetail/${tb_idx}/unHeart`,  
    //         {tbIdx})
    //         .then(response => {                           
    //             console.log(response);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             return;
    //         });
    //     }} 

    return (
        <div className='container clearfix' >
            <Link to="/tip/list"><div className={style.back}>
                <img className={style.backbutton} src={back_button} />
            </div></Link>
            <div className={style.title}>
                <h1>{data.tbTitle}</h1>

                <p>조회수:{data.tbViews}</p>
                <p>작성일:{data.tbCreatedt}</p>
            </div>
            <div className={style.line}></div>
            <div className={style.content}>
                {data.tbContents && <Viewer initialValue={data.tbContents}></Viewer>}
            </div>

            <div className={style.editbox}>
                <ul>
                    {user == data.userId || user == 'admin' ? <li onClick={handlerdelete}> 삭제</li> : ""}
                    {user == data.userId || user == 'admin' ? <li><Link to={`/tip/edit/${data.tbIdx}`}>수정</Link></li> : ""}
                </ul>
            </div>
            <div className={style.line}></div>
            <div className={style.heartbox}>
                {/* <HeartButton like={like} onClick={toggleLike}/> */}
                {/* <TipHeartCnt tbIdx={tb_idx} /> */}
                {/* <div className={style.heartSection}> */}

                <TipHeartCnt tbIdx={tb_idx} />
                {/* </div> */}
            </div>


            <div className={style.line}></div>
            <div className={style.comment}><h2>댓글</h2></div>
            <div className={style.commentall}>
                {comments.map((data, idx) => {
                    return (
                        <div className={style.comments}  >
                            <div style={{ width: "100px", float: "left" }} > {data.userId} </div>
                            <div className={style.text}> {data.tbcComments}</div>
                        </div>
                    )
                })}
            </div>
            <div className={style.line}></div>
            <div className={style.input}>
                <div>
                    <input className={style.writeComment} type='text' value={temp} onChange={(e) => { setTemp(e.target.value) }} />
                    <input type="button" className={style.finish} onClick={insert} value="등록" />
                </div>
            </div>
        </div>
    )
}
// }

export default TipDetail;