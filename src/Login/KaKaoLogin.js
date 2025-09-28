import axios from 'axios';
import { useState } from 'react';
import { useEffect } from "react";
// import kakaoLogo from '../Login/kakao_login_large.png';
import style from '../Login/Login.module.css'
import KakaotalkLogo from '../Login/KakaotalkLogo.png';

// const KakaoLogin = ({history}) => {

// // const REST_API_KEY = "~~";
// // const REDIRECT_URI =  "http://localhost:3000/auth/kakao/callback";

// // export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// const KakaoLogin = ({history}) => {

const KakaoLogin = ({ }) => {
    const { Kakao } = window;

    const JAVASCRIPT_APP_KEY = '7e512efaee6eeeeca2d427733a82b016';

    // 액세스 토큰을 상태 변수로 선언 
    // 로그인 버튼 출력 제어에 사용
    const [accessToken, setAccessToken] = useState('');
    const [userName, setUserName] = useState('');
    const [userNickName, setUserNickName] = useState('');


    const handlerLogin = () => {
        // 간편 로그인을 요청
        // 인증 성공 시 redirectUri 주소로 인가 코드를 전달

        Kakao.Auth.authorize({
            redirectUri: 'http://localhost:3000/login'
        });
    };

    useEffect(() => {
        if (!Kakao.isInitialized()) {

        Kakao.init(JAVASCRIPT_APP_KEY);
        }
        // 쿼리 스트링으로 부터 인가 코드를 추출
        const code = window.location.search.split('=')[1];
        // sessionStorage.setItem("code", code);
        if (code) {
            // REST API로 토큰 받기를 요청
            axios.post(
                'https://kauth.kakao.com/oauth/token', {
                grant_type: 'authorization_code',                   // 고정
                client_id: JAVASCRIPT_APP_KEY,                      // 앱 REST API 키
                redirect_uri: 'http://localhost:3000/login',   // 인가 코드가 리다이렉트된 URI
                code: code                                          // 인가 코드 받기 요청으로 얻은 인가 코드
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }
            )
                .then(response => {

                    console.log(response);

                    const accessToken = response.data.access_token;         // 사용자 액세스 토큰 값
                    setAccessToken(accessToken);

                    // 액세스 토큰 값을 할당
                    Kakao.Auth.setAccessToken(accessToken);
                    console.log(accessToken);

                    // 사용자 정보 가져오기
                    Kakao.API.request({
                        url: '/v2/user/me'
                    })
                        .then(response => {
                            // 사용자 정보 로깅
                            console.log(response);

                            // 애플리케이션에서 필요한 정보를 추출해서 로컬 스토리지에 저장
                            const { kakao_account } = response;
                            // console.log(kakao_account);

                            // sessionStorage.setItem('userNickname', kakao_account.profile.nickname);
                            sessionStorage.setItem('userName', kakao_account.profile.name);
                            sessionStorage.setItem('userPhoto', kakao_account.profile.profile_image_url);
                            sessionStorage.setItem('email', kakao_account.email);
                            sessionStorage.setItem('accesstoken', accessToken);

                            // axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/pass/login`, { "userNickName": kakao_account.profile.nickname,
                            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/pass/login`, { "userName": kakao_account.profile.name,

                                    'userEmail' : kakao_account.email })
                                .then((response) => {
                                    console.log(response);
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
                                    // sessionStorage.clear();
                                    alert('일치하는 정보가 없습니다.');
                                })
                            // history.push('/');
                            // 홈(/) 화면으로 이동
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => console.log(error));
            }
        },[]);
        
        const sns = {
            width: "40px",
            height: "40px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 5px",
            borderRadius: "50%",
            // boxShadow: "-5px -5px 10px #ffffff, 5px 5px 8px #babebc",
            cursor: "pointer",
            // marginTop: "10%",
            // marginBottom:"20%",
            cursor: 'pointer'
        }


    return (
        <>
            {/* https://developers.kakao.com/tool/resource/login */}
            {/* {!accessToken &&
                <img className={style.logo} style={{ width: 120, height: 60, cursor: 'pointer' }}
                    src={kakaoLogo}
                    onClick={handlerLogin} />
            } */}


                <img className={style.logo} style={sns}
                src={KakaotalkLogo}
                    onClick={handlerLogin} />
            
        </>
    );
}
export default KakaoLogin;


