import axios from 'axios'
import { useEffect,useRef } from 'react'
import NaverLogo from '../Login/NaverLogo.png';
import styled from 'styled-components'
import './Naver.css'
import style from './LoginTest.module.css';

const NaverLogin = ({ setGetToken, setUserInfo }) => {
    const naverRef = useRef()


    const { naver } = window
    const NAVER_CLIENT_ID = '9i6fzGFoSxccJUEKZ46S'
    const NAVER_CALLBACK_URL = 'http://localhost:3000/signup'

    const initializeNaverLogin = () => {
        const naverLogin = new naver.LoginWithNaverId({
            clientId: NAVER_CLIENT_ID,
            callbackUrl: NAVER_CALLBACK_URL,
            // 팝업창으로 로그인을 진행할 것인지?           
            isPopup: false,
            // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
            loginButton: { color: 'green', type: 2, height: 58, float:'left'},
            callbackHandle: true
        })
        console.log(naverLogin)
        naverLogin.init()

        // 선언된 naverLogin 을 이용하여 유저 (사용자) 정보를 불러오는데  
        // 함수 내부에서 naverLogin을 선언하였기에 지역변수처리가 되어  
        // userinfo 정보를 추출하는 것은 지역변수와 같은 함수에서 진행주어야한다.

        // 아래와 같이 로그인한 유저 ( 사용자 ) 정보를 직접 접근하여 추출가능하다.
        // 이때, 데이터는 첫 연동시 정보 동의한 데이터만 추출 가능하다.

        // 백엔드 개발자가 정보를 전달해준다면 아래 요기! 라고 작성된 부분까지는 
        // 코드 생략이 가능하다.  

        naverLogin.getLoginStatus(async function (status) {
            if (status) {
                // 아래처럼 선택하여 추출이 가능하고, 
                const userEmail = naverLogin.user.getEmail()
                const username = naverLogin.user.getName()
                // 정보 전체를 아래처럼 state 에 저장하여 추출하여 사용가능하다. 
                // setUserInfo(naverLogin.user)
                sessionStorage.setItem('userName', naverLogin.user.name);
                sessionStorage.setItem('userEmail', naverLogin.user.email);

                // axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/pass/login`, { "userNickName": naverLogin.user.name,'userEmail':naverLogin.user.email })
                axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/pass/login`, { "userName": naverLogin.user.name,'userEmail':naverLogin.user.email }) 
                .then((response) => {
                        if (response.data) {
                            sessionStorage.setItem("token", response.data);
                            alert('로그인 성공');
                            window.location.href = "/";

                        }
                        else {
                            sessionStorage.clear();
                            alert('로그인 실패');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        sessionStorage.clear();
                        alert('일치하는 정보가 없습니다.');
                    })

            }
        })
        // 요기!

        // localStorage.setItem('userName', naverLogin.username);
        // localStorage.setItem('userNickname', naverLogin.userid);
        // localStorage.setItem('userPhoto', naverLogin.user.profile_image);
    }



    // 네이버 소셜 로그인 (네아로) 는 URL 에 엑세스 토큰이 붙어서 전달된다.
    // 우선 아래와 같이 토큰을 추출 할 수 있으며,
    // 3부에 작성 될 Redirect 페이지를 통해 빠르고, 깨끗하게 처리가 가능하다.

    const userAccessToken = () => {
        window.location.href.includes('access_token') && getToken()
    }

    const getToken = () => {
        const token = window.location.href.split('=')[1].split('&')[0]
        // console.log, alert 창을 통해 토큰이 잘 추출 되는지 확인하자! 

        // 이후 로컬 스토리지 또는 state에 저장하여 사용하자!   
        // localStorage.setItem('access_token', token)
        // setGetToken(token)

    }


    // 화면 첫 렌더링이후 바로 실행하기 위해 useEffect 를 사용하였다.
    useEffect(() => {
        initializeNaverLogin()
        userAccessToken()
    }, [])

    const sns = {
        width: "40px",
        height: "40px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 5px",
        borderRadius: "50%",
        cursor: "pointer",
        marginTop: "10%",
        marginBottom:"20%",
        cursor: 'pointer'
    }


    return (
        <>
            <div id="naverIdLogin" />
        </>
    )
}

export default NaverLogin;