import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Password } from '@mui/icons-material';
import style from './Finduser.module.css'
import Swal from "sweetalert2";

export default function Finduser({ match }) {

    const idx = match.params.idx;
    const [data, setData] = useState('');
    const [auth, setAuth] = useState('');
    const [email, setEmail] = useState('');
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [temp, setTemp] = useState('');
    const [userId, setUserId] = useState('');

    const handlerAuth = () => {
        if (idx == 1) {
            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/emailid/${email}/${userId}`)
                .then((r) => {
                    if (r.data == 0) {
                        Swal.fire({
                            icon: 'info',
                            title: '다시 시도해주세요.',
                            text: '이메일과 아이디가 일치하지 않습니다.'
                        })
                        return;
                    }
                }).catch(() => {
                    Swal.fire({
                        icon: 'info',
                        title: '다시 시도해주세요.',
                        text: '이메일과 아이디가 일치하지 않습니다.'
                    })
                    return;
                })
        }
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/emailConfirm/${email}`)
            .then((r) => {
                console.log(r.data)
                setAuth(r.data)
                Swal.fire({
                    icon: 'info',
                    title: '인증번호가 발송되었습니다.',
                    text: '다음 단계를 진행해주세요.'
                })
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: '오류가 발생했습니다.',
                    text: '다시 시도해주세요.'
                })
            })
    }

    const handlerCheck = () => {
        if (auth == temp) {
            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/findid/${email}`)
                .then((r) => {
                    setData("회원님의 아이디는 " + r.data + "입니다.");
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: '일치하는 정보가 없습니다.',
                        text: '다시 시도해주세요.'
                    })
                })
        } else {
            setData("인증번호가 일치하지 않습니다.")
        }
    }
    const handlerCheck1 = () => {
        if (auth == temp) {
            setData(true);
        } else {
            setData("인증번호가 일치하지 않습니다.")
        }
    }
    const handlerChange = () => {
        if (auth == temp) {
            axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/findPassword/${email}/${password}`)
                .then((r) => {
                    Swal.fire(
                        'Success!',
                        '비밀번호가 변경 되었습니다.',
                        'success'
                    )
                    history.push(`/login`);
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: '일치하는 정보가 없습니다.',
                        text: '다시 시도해주세요.'
                    })
                })
        } else {
            setData("인증번호가 일치하지 않습니다.")
        }
    }

    if (idx == 0) {
        return (
            <div className="clearfix container">
                <div className={style.wrapper}>
                    <div className={style.container}>
                        <div className={style.form}>
                            <h1 className={style.h1}>아이디 찾기</h1>
                            <div >
                                <input className={style.input} placeholder='이메일을 입력하세요.' value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                                <button className={style.button} onClick={handlerAuth}>인증</button>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <input className={style.input} placeholder='인증 코드를 입력해주세요' value={temp} onChange={(e) => { setTemp(e.target.value) }}></input>
                                <button className={style.button} onClick={handlerCheck}>확인</button>
                            </div>
                            <div className={style.result}>{data}</div>
                        </div>
                    </div>
                </div>
            </div>

        );
    } else {
        return (
            <div className="clearfix container">
                <div className={style.wrapper}>
                    <div className={style.container}>
                        <div className={style.form}>
                            <h1 className={style.h1}>비밀번호 변경</h1>
                            <div className={style.div2}>
                                <input className={style.input2} placeholder='아이디을 입력하세요.' value={userId} onChange={(e) => { setUserId(e.target.value) }}></input>
                            </div>
                            <div className={style.div2}>
                                <input className={style.input2} placeholder='이메일을 입력하세요.' value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                                <button className={style.button2} onClick={handlerAuth}>인증</button>
                            </div>
                            <div className={style.div2}>
                                <input className={`${style.input2} ${style.float}`} placeholder='인증 코드를 입력해주세요' value={temp} onChange={(e) => { setTemp(e.target.value) }}></input>
                                <button className={`${style.button2} ${style.float1}`} onClick={handlerCheck1}>확인</button>
                            </div>
                            {
                                data == true &&
                                <>
                                    <h2 className={style.h2}>비밀번호 재설정</h2>
                                    <div className={style.div2}>
                                        <input style={{ marginTop: "20px" }} className={style.input2} value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='비밀번호를 입력해주세요'></input>
                                        <input className={style.input2} value={checkPassword} onChange={(e) => { setCheckPassword(e.target.value) }} placeholder='비밀번호를 다시 입력해주세요'></input>
                                        <button className={`${style.button2} ${style.button3}`} style={{ background: "#739eee", color: "white", fontSize: "14px", fontWeight: "bold" }} onClick={handlerChange}>확인</button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>


        )
    }

} 