// import style from './Doing.module.css';
// import '../reset.css';
// import img from "./checkbox.png";
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import jwt_decode from "jwt-decode";
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

// function DoingTest() {
//     const a = 0;
//     const history = useHistory();
//     const [userId, setUserId] = useState('');
//     const [profileImg, setProfileImg] = useState([]);
//     const [data, setData] = useState([]); // 작업 목록 가져옴
//     const [detail, setDetail] = useState([]); // user2에 따른 작업창
//     const [click, setClick] = useState(false);
//     const [inputText, setInputText] = useState('');

//     useEffect(() => {
//         if (sessionStorage.getItem('token') == null) {
//             alert('로그인이 필요합니다. 로그인해주세요');
//             history.push('/login');
//             return;
//         }

//         const token = sessionStorage.getItem('token');
//         const decode_token = jwt_decode(token);
//         setUserId(decode_token.sub);

//         axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionList/${decode_token.sub}`)
//             .then(res => {
//                 setData(res.data);
//                 console.log("2222222222" + data.progress)
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }, []);

//     const handleDetail = cidx => {
//         axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionDetail/${cidx}`)
//             .then(res => {
//                 console.log(">>>>>>>>>>>" + res.data);
//                 setDetail(res.data);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     };

//     const handleText = (e) => { setInputText(e.target.value);}

//     const handleUpload = cidx => {
//         console.log(">>>>>>>>>>>" + cidx)
//         // axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertCommissionDetail/${cidx}`)
//     }

//     return (
//         <>
//             <div className='box1'>
//                 <h1>게시판</h1>
//             </div>
//             <div className={style.list}>
//                 <h2>작업 목록</h2>
//                 <br />
//                 {data.map((data, index) => {
//                     if (index < profileImg.length) {
//                         return (
//                             <div key={index} className={style.doinglist}>
//                                 {/* <img src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${profileImg[index]}.jpg`} /> */}
//                                 <button onClick={() => handleDetail(data.cidx)}>{data.userId2}</button>
//                                 {/* <button>삭제</button> */}
//                                 <hr />
//                                 {/* <p>#악기태그</p> */}
//                             </div>
//                         );
//                     } else {
//                         axios
//                             .get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${data.userId2}`)
//                             .then(res => {
//                                 setProfileImg(prevUsers => [...prevUsers, res.data.profile[0].profileImg]);
//                             })
//                             .catch(err => {
//                                 console.log(err);
//                             });

//                         return null;
//                     }
//                 })}

//             </div>
//             {detail.length != '' &&
//                 <div className='container clearfix'>
//                     <div className={style.Doing} >
//                         {/* <p className={style.teamname}>Team Name</p> */}
//                         { data.progress == '' ? < p className={style.isDoing}>현재 작업이 <b style={{ fontWeight: "bold" }}>진행 중</b> 입니다.</p> :
//                         < p className={style.isDoing}>현재 작업이 <b style={{ fontWeight: "bold" }}>완료</b> 되었습니다.</p>
//                         }
//                         <p className={style.name}>의뢰인</p>
//                         <p className={style.contents}>예치금 10,000 원이 결제 되었습니다.</p>
//                         <button onClick={()=>handleUpload(data.cidx)} className={style.upload}>업로드</button>

//                         {detail.map(detail => {
//                             return (
//                                 <div className={style.contentsbox}>
//                                     <p className={style.date}>{detail.cdDate}</p>
//                                     <div className={style.Doingbox}>
//                                         <img className={style.img} />
//                                         <p className={style.name}>{detail.userId}</p>
//                                         <p className={style.contents}>{detail.cdComment}</p>
//                                         <li className={style.clearfix} >
//                                             <ul className={style.button}>대댓글달기</ul>
//                                             <ul className={style.button}>펼치기</ul>
//                                         </li>
//                                     </div>
//                                 </div>
//                             )
//                         })}

//                     </div>
//                     <br/>
//                     <hr/>
//                     <input type='text' value={inputText} onChange={handleText}/>
//                 </div >}

//         </>
//     )
// } export default DoingTest;