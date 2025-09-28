import style from './JamDetail.module.css'
import play from './play.png'
import note from './note.png'
import { useState, useEffect, useRef } from 'react'
import jwt_decode from "jwt-decode";
import axios from 'axios'
import Waveform from '../Component/Waveform';
import { PlayCircleFilledOutlined } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from "sweetalert2";


const JamDetail = ({ match }) => {

    const [info, setInfo] = useState({});
    const [value, setvalue] = useState([]);
    const child = useRef([]);

    const [music, setMusic] = useState('');
    const [instrument, setInstrument] = useState('');

    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);
    const cIdx = match.params.cIdx;

    const [insert, setInsert] = useState(0);
    const [data, setData] = useState([]);
    const history = useHistory();

    const handleChangeComment = (e) => {
        setComment(e.target.value);
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
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/jam/${cIdx}`)
            .then(response => {
                console.log(response);
                setData(response.data.music);
                setInfo(response.data.data)
                setCommentsList(response.data.commentsList)
            })
    }, [insert])


    const onSubmit = (e) => {
        e.preventDefault();
        let files = music;
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        let datas = { "cmInstrument": instrument }
        formData.append("data", new Blob([JSON.stringify(datas)], { type: "application/json" }))
        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertmusic/${cIdx}`,
            headers: { 'Content-Type': 'multipart/form-data;', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
            data: formData
        }).then((response) => {
            let musicInfo = { instrument: instrument, musicUUID: response.data.uuid }
            setData([...data, musicInfo]);
            window.location.reload();
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: '업로드 중 오류가 발생했습니다.',
                text: '다시 시도해주세요.'
            })
        });
    }

    const onCheckAll = (isChecked) => {
        if (isChecked) {
            const indexArray = data.map((music, index) => index);
            setvalue(indexArray);
        } else {
            setvalue([]);
        }
    }

    const allplay = () => {
        value.forEach((index) => {
            child.current[index].PlayAll();
        });
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment == "") {
            Swal.fire({
                icon: 'info',
                title: '작성된 내용이 없습니다',
                text: '다시 시도해주세요.'
            })
            return;
        }

        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertComments/${cIdx}`, { "ccComments": comment },
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                setInsert(insert + 1);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: '오류가 발생했습니다.',
                    text: '다시 시도해주세요.'
                })
            });
    };


    const handlerClickDelete = (e) => {
        e.preventDefault();
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/CommentsDelete/${e.target.value}`)
            .then(response => {
                if (response.data === 1) {
                    setInsert(insert + 1);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '삭제에 실패했습니다.',
                        text: '다시 시도해주세요.'
                    })
                    return;
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: '삭제에 실패했습니다.',
                    text: '다시 시도해주세요.'
                })
                return;
            });
    };

    return (
        <>
            <div className='container clearfix'>
                <div className={style.title}>
                    <div className={style.imgbox}>
                        {/* 여기 수정해야됨 */}
                        {/* <img className={style.img} src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${info.cphoto}.jpg`}></img> */}

                        <div>
                            <h1>{info.ctitle} </h1>
                            <br /><br />
                            <h3>Album By {" "} {" "} {info.cwriter}</h3>
                            <br /><br />
                            <p>{info.ccontents}</p>

                        </div>
                    </div>

                    <div className={style.playbox}>
                        <PlayCircleFilledOutlined sx={{ fontSize: 64, color: blue[500], cursor: "pointer" }} onClick={allplay} />
                    </div>
                </div>

                <div className={style.jam}>
                    <div style={{ margin: "20px" }}>
                        <input type="checkbox" checked={value.length === data.length} onChange={(e) => onCheckAll(e.target.checked)} />
                        <span style={{ marginLeft: "10px" }}>전체 선택</span>
                    </div>

                    <div>
                        {data.map((musicInfo, index) => {
                            return (
                                <div key={musicInfo.musicUUID}>
                                    <input
                                        type="checkbox"
                                        className={style.checkbox}
                                        checked={value.includes(index)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setvalue([...value, index]);
                                            } else {
                                                setvalue(value.filter((v) => v !== index));
                                            }
                                        }}
                                    />
                                    <Waveform
                                        data={musicInfo}
                                        key={musicInfo.musicUUID}
                                        src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getMusic/${musicInfo.cmMusic}`}
                                        ref={(elem) => (child.current[index] = elem)}
                                    />
                                    {musicInfo.musicTitle}
                                </div>
                            );
                        })}
                    </div>

                    <div className={style.input}>
                        <select className={style.Select} onChange={(e) => { setInstrument(e.target.value) }} style={{ marginLeft: "44px", outlineStyle: "none", marginBottom: 21, marginRight: 0, border: 0 }} >
                            <option value="" disabled selected>악기 선택</option>
                            <option value="여성보컬">여성보컬  </option>
                            <option value="남성보컬">남성보컬  </option>
                            <option value="일렉기타">일렉기타  </option>
                            <option value="어쿠스틱기타">어쿠스틱기타  </option>
                            <option value="베이스기타">베이스기타  </option>
                            <option value="드럼">드럼  </option>
                            <option value="퍼커션">퍼커션  </option>
                            <option value="브라스">브라스  </option>
                            <option value="바이올린">바이올린  </option>
                            <option value="첼로">첼로  </option>
                            <option value="콘트라베이스">콘트라베이스  </option>
                            <option value="피아노">피아노  </option>
                            <option value="신디사이저">신디사이저  </option>
                        </select>

                        <input type="file" className={style.musicinput} multiple="multiple" onChange={(e) => { console.log(e.target.files[0].name); setMusic(e.target.files) }} />
                        <input type="button" className={style.music} onClick={onSubmit} value="등록" />
                    </div>
                </div>
                <div className={style.line}></div>
                <div className={style.comment}><h2>댓글</h2></div>

                <div className={style.com}>
                    {
                        commentsList.map((comment) => {
                            return (
                                <>
                                    <div className={style.comments} style={{ width: 1000, marginLeft: 80, height: 40, float: "left", lineHeight: "40px" }}  >
                                        <div style={{ width: "100px", float: "left" }} > {comment.userId} </div>
                                        <div style={{ float: 'left', width: "850px " }}> {comment.ccComments}</div>
                                        <button value={comment.ccIdx} onClick={handlerClickDelete}>삭제</button>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>

                <div style={{ margin: "0 auto", width: "1000px" }}>
                    <input type="text" value={comment} onChange={handleChangeComment} className={style.writeComment}></input>
                    <button onClick={handleCommentSubmit} className={style.finish} >등록</button>
                </div>
            </div>
        </>
    )
}

export default JamDetail;