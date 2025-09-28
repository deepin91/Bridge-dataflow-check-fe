import axios from "axios";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Waveform from './Waveform.js';
import { Link } from "react-router-dom";
import style from './DoingDetail.module.css';
import { Send } from "@mui/icons-material";
import Swal from "sweetalert2";

const DoingDetail = ({ match }) => {
    const { cidx } = match.params;
    const history = useHistory();
    const [list, setList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [userId, setUserId] = useState('');
    const [userId2, setUserId2] = useState('');
    const [music, setMusic] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editText, setEditText] = useState('');
    const [progress, setProgress] = useState(0);
    const [money, setMoney] = useState(0);
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [open, setOpen] = useState(false);
    const [uuid, setUuid] = useState('');
    const [login, setLogin] = useState('');



    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            Swal.fire({
                icon: 'error',
                title: '로그인이 필요합니다.',
                text: '로그인 페이지로 이동합니다.',
            })
            history.push('/login');
            return;
        }
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
        setLogin(decode_token.sub);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionDetail/${cidx}`)
            .then(res => {
                console.log("************" + res.data);
                setList(res.data);
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getProgress/${cidx}`)
                    .then(r => {
                        // console.log(">>>>" + r.data);
                        setProgress(r.data[0].progress);
                        setUserId2(r.data[0].userId2);
                        setMoney(r.data[0].cmoney);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(e => { console.log(e) });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        let files = music;

        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.includes('audio')) {
                Swal.fire({
                    icon: 'info',
                    title: '음악 파일만 업로드 가능합니다',
                    text: '다시 시도해주세요.'
                })
                return;
            }
            formData.append("files", files[i]);
        }
        let datas = { "cdComment": inputText, userId, "cIdx": cidx };
        formData.append("data", new Blob([JSON.stringify(datas)], { type: "application/json" }));

        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertCommissionDetail/${cidx}`, formData)
            .then((response) => {
                setUuid(response.data.uuid);
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionDetail/${cidx}`)
                    .then(res => {
                        setList(res.data);
                        setInputText('');
                        setMusic([]);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: '업로드 중 오류가 발생했습니다.',
                    text: '다시 시도해주세요.'
                })
            });
    };

    const handleEditBtn = (cdIdx) => {
        setEditText(list.find(item => item.cdIdx === cdIdx).cdComment);
        setEditIdx(cdIdx);
    };

    const handleCancel = () => {
        setEditIdx(-1);
        setInputText('');
        setMusic([]);
    };



    const handleSave = (cdIdx) => {
        let files = music;
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        let data = {
            userId,
            cdComment: editText,
            cIdx: cidx,
        };
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append("cidx", cidx);

        axios
            .put(
                `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/editCommissionDetail/${cidx}/${cdIdx}`,
                formData
            )
            .then((res) => {
                setEditIdx(-1);
                setMusic([]);
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionDetail/${cidx}`)
                    .then(res => {
                        setList(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleDel = (cdIdx) => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/delCommissionDetail/${cdIdx}`)
            .then(res => {
                setEditIdx(-1);
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionDetail/${cidx}`)
                    .then(res => {
                        setList(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    };

    const handleFileDel = (cdIdx) => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/delCommissionFile/${cdIdx}`)
            .then(res => {
                setEditIdx(-1);
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getCommissionDetail/${cidx}`)
                    .then(res => {
                        setList(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleEnd = () => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/commissionEnd/${cidx}`)
            .then(r => {
                window.location.reload();
            })
            .catch(e => { console.log(e) })
    }

    const handleComment = (cdIdx) => {
        setOpen(false)
    }

    const submitComment = (cdIdx) => {
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insert/CommissionComment/${cdIdx}`, { userId, "ccContents": comment, cdIdx })
            .then(r => {
                axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/get/CommissionComment/${cdIdx}`)
                    .then(r => {
                        setCommentList(r.data);
                        setOpen(true);
                    })
                    .catch(e => { console.log(e) })
            })
            .catch(e => { console.log("댓글실패" + e) })
    }

    const [commentIdx, setCommentIdx] = useState('');

    const handleOpen = (cdIdx) => {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/get/CommissionComment/${cdIdx}`)
            .then(r => {
                setCommentList(r.data);
                setOpen(true);
                setCommentIdx(cdIdx);
            })
            .catch(e => { console.log(e) })
    }


    return (
        <>
            <div className='container clearfix'>
                <div className={style.box1}>
                    <h1>작업 진행</h1>
                    <div className={style.yn}>
                        {progress == 0 ?
                            <div>현재 작업이 <span>진행 중</span> 입니다.</div>
                            :
                            <p>작업이 <span>완료</span> 되었습니다.</p>
                        }

                    </div>
                    <Link to='/partner/doing'><button> 목록으로 </button></Link>

                    {money == 0 ? <Link to={`/partner/payment/${userId2}`}><button> 안심결제 </button></Link> : ""}

                    {progress == 0 ? <button onClick={handleEnd}> 작업완료 </button> : ""}
                </div>

                <div className={style.list}>



                    <div>
                        {progress == 0 && money > 0 ?
                            <p>{userId} 님이 {money}p 를 안심 결제하셨습니다 <br /> 작업 완료시 수령하실 수 있습니다 </p>
                            :
                            ""
                        }
                    </div>




                    {list.map((item) => {
                        const { cdIdx, cdDate, userId, cdComment, cdFile } = item;

                        return (
                            <div key={cdIdx}>
                                <div>
                                    <div className={style.listbox}>

                                        <div>
                                            <div className={style.userid}>

                                                <span>{userId}</span>
                                                <span> : </span>



                                                <span className={style.mid}>{cdComment}</span>
                                                <p style={{ float: "right", fontWeight: "500" }}>{cdDate}</p>



                                                {editIdx === cdIdx ? (
                                                    <>
                                                        <textarea className={style.contentin2}
                                                            type="text"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                        />
                                                        <input className={style.filein2} type="file" multiple="multiple" onChange={(e) => setMusic(e.target.files)} />
                                                        {/* 기존에 업로드한 파일명 */}
                                                        {/* {music.length === 0 && cdFile && (
                       
                                                      <div>
                                                                <span className={style.filename}> {cdFile}</span>

                                                            </div>
                                                        )} */}
                                                    </>
                                                ) : (


                                                    <div className={style.content}>
                                                        {/* <span>{cdComment}</span> */}
                                                        {/* <p>{cdDate}</p> */}
                                                        {open && commentIdx == cdIdx && commentList.map((comment) => {
                                                            const { ccIdx, userId, ccDate, ccContents, cdIdx } = comment;
                                                            if (cdIdx === cdIdx) {
                                                                return (
                                                                    <div key={cdIdx}>
                                                                        <div>
                                                                            <div>

                                                                                {userId} &nbsp;&nbsp; &nbsp;&nbsp;
                                                                                {ccContents} &nbsp;&nbsp; &nbsp;&nbsp;
                                                                                {ccDate}

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                )
                                                            }
                                                        })}
                                                        <div className={style.wave}>
                                                            {cdFile && (
                                                                <>
                                                                    <Waveform
                                                                        src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getMusic/${cdFile}`}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                )}
                                            </div>

                                        </div>


                                        <div className={style.comment}>
                                            <div className={style.upload}>
                                                <div className={style.btn}>
                                                    {open && commentIdx == cdIdx && <div className={style.commentInput}>
                                                        <input className={style.input} type="text" onChange={(e) => setComment(e.target.value)} />
                                                        <button className={style.send} onClick={() => submitComment(cdIdx)}><Send sx={{ fontSize: 32, marginLeft: 2 }} /></button>
                                                    </div>}


                                                    {/* <div className={style.btn}> */}
                                                    {login == userId && <button onClick={() => handleDel(cdIdx)}>삭제</button>}  &nbsp;&nbsp;&nbsp;&nbsp;


                                                    {editIdx === cdIdx ? (
                                                        <>
                                                            <button onClick={() => handleSave(cdIdx)}>저장</button>  &nbsp;
                                                            <button className={style.cancel} onClick={handleCancel}>취소</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {login == userId && <button onClick={() => handleEditBtn(cdIdx)}>수정</button>}
                                                        </>
                                                    )}

                                                </div>


                                                {open && commentIdx == cdIdx ?
                                                    <button onClick={() => handleComment(cdIdx)}>접기</button>
                                                    :
                                                    <button onClick={() => handleOpen(cdIdx)}>덧글</button>
                                                }


                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        );
                    })}



                    <div className={style.writecontent}>
                        <textarea className={style.contentin} type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                        <input className={style.filein} type="file" multiple="multiple" onChange={(e) => setMusic(e.target.files)} />
                        <button className={style.writebtn} onClick={handleSubmit}>등록</button>
                    </div>


                </div>
            </div>
        </>
    );
};

export default DoingDetail;