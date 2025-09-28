import style from './LoginTest.module.css';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import KakaoLogin from '../Login/KaKaoLogin';
import NaverLogin from './NaverLogin';
import { useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";


const LoginTest = ({ setIsLogin }) => {

    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const history = useHistory();

    const handlerOnClick = e => {
        e.preventDefault();
        setCookie('rememberUserId', userId);
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/login`,
            { "userId": userId, "userPassword": userPassword })
            .then(response => {
                if (response.data.startsWith(0)) {
                    Swal.fire({
                        title: 'Welcome!',
                        text: '정상적으로 로그인되었습니다.',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/128/8727/8727696.png',
                        imageWidth: 60,
                        imageHeight: 60,
                        confirmButtonColor: '#3c3e58'
                    })
                    console.log(">>>>>>>>>>" + response.data.substr(1))
                    sessionStorage.setItem("token", response.data.substr(1));
                    setIsLogin(true);
                    history.push('/');
                } else if (response.data.startsWith(1)) {
                    Swal.fire({
                        icon: 'error',
                        title: '정지된 계정입니다.',
                        text: 'bridge@test.com 으로 문의해주세요.'
                    })
                    sessionStorage.clear();
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'info',
                    title: 'id, pw가 일치하지 않습니다',
                    text: '다시 시도해주세요.'
                })
                console.log(error)
                sessionStorage.clear();
            })
    };

    const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);
    const [isRemember, setIsRemember] = useState(false);


    useEffect(() => {
        if (cookies.rememberUserId !== undefined) {
            setUserId(cookies.rememberUserId);
            setIsRemember(true);
        }
    }, []);

    const handleOnChange = (e) => {
        setIsRemember(e.target.checked);
        if (!e.target.checked) {
            removeCookie("rememberUserId");
        }
    };

    const handlerOnClick2 = () => {
        history.push('/signup');
    };

    return (
        <>
            <div className='container clearfix'>
                <div className={style.wrapper}>
                    <div className={style.container}>
                        <div className={style.signUpContainer}>
                            <form className={style.form}>
                                <h1 className={style.formH1}>Login</h1>
                                <input className={style.formInput} type="Id" placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)} />
                                <input className={style.formInput} type="password" placeholder="비밀번호" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                                <div className={style.saveBox}>
                                    <input className={style.idCheckBox} type='checkbox' checked={isRemember} id="saveId" name="saveId" value="saveId" onChange={(e) => { handleOnChange(e); }} />
                                    <label for="saveId" className={style.saveId}>아이디 저장</label>
                                </div>
                                <div className={style.loginButtonBox}>
                                    <button className={style.loginButton} onClick={handlerOnClick}>로그인</button>
                                </div>
                                <div className={style.find}>
                                    <Link className={style.registration} to="/find/0">아이디찾기</Link>
                                    <Link className={style.registration} to="/find/1" >비밀번호 찾기</Link>
                                </div>

                                <div className={style.line_or}>
                                    <span className={style.line_or_before} />
                                    <span className={style.txt_or}>사용중인 계정이 없다면?</span>
                                    <span className={style.line_or_after} />
                                </div>
                                <button className={style.registrationButton} onClick={handlerOnClick2}>회원가입</button>
                                <span className={style.span2}>SNS 계정으로 간편로그인</span>
                                <div>
                                    <div className={style.kakaoBtn}>
                                        <KakaoLogin />
                                    </div>
                                    <div className={style.naverBtn}>
                                        <NaverLogin />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default LoginTest;