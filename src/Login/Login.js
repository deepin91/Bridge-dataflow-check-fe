import style from './Login.module.css';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import KakaoLogin from './KaKaoLogin';
import NaverLogin from './NaverLogin'
import { useState } from "react";
import axios from "axios";
// // import {KAKAO_AUTH_URL} from '../Login/KaKaoLogin';
import { useHistory } from 'react-router-dom';


const Login = ({ setIsLogin}) => {

    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword]=useState('');
    const history = useHistory();
    const handlerOnClick = e =>{
        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/login`,
        // axios.post('http://localhost:8080/api/bridge/pass/login',
            {"userId": userId,"userPassword": userPassword})
            .then(response => {
                console.log("🔑 로그인 응답:", response);
                sessionStorage.setItem("token",response.data);
                console.log("📦 저장된 토큰:", sessionStorage.getItem("token"));
                

                if(response.data){
                    alert('정상적으로 로그인되었습니다');
                    console.log(history)
                    setIsLogin(true);
                    history.push('/');
                }
            })
            .catch(error => {
                alert('id, pw가 일치하지 않습니다')
                console.log(error)
                sessionStorage.clear();
            })
    };
    
    // useEffect(() => {
    //     const isLogin = window.sessionStorage.getItem('token');
    //     if (isLogin) {
    //         history.push('/');
    //     } 
    // }, []);


    return (
        <>
            <div className='container clearfix' >
                <div className={style.loginbackg}>
                    <h1 className={style.login}>로그인</h1>

                <p className={style.loginp}>아이디</p>
                <input type="text" className={style.logininput} placeholder="아이디를 입력하세요" value={userId} onChange={(e)=>setUserId(e.target.value)}/>
                <p className={style.loginp}>비밀번호</p>
                <input type="password" className={style.logininput} placeholder="비밀번호를 입력하세요" value={userPassword} onChange={(e)=>setUserPassword(e.target.value)}/>
                <br />
                <button className={style.loginbutton} onClick={handlerOnClick}>로그인</button>
                <Link to="/5"><p className={style.signup}>회원가입</p></Link>
                <p className={style.loginsns}>SNS계정 간편 로그인</p>
               <div className={style.kakao}> <KakaoLogin /></div>
                <div className={style.naver}><NaverLogin /></div>
            </div>
            </div>
        </>
    )
}


export default Login;

