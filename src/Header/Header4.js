import style from './Header4.module.css'
import { Route, Link } from 'react-router-dom';
import { Component, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import BridgeWhiteLogo from '../Header/BridgeWhiteLogo.png'
import { Icon } from '@iconify/react';
import axios from 'axios';
import Swal from "sweetalert2";

function Header4({ isLogin, setIsLogin }) {

    const [state, setState] = useState(false);
    const [userNickname, setUserNickname] = useState('');
    const [userPoint, setUserPoint] = useState('');
    const [userId, setUserId] = useState('');


    const handlerOnLogoutClick = () => {
        Swal.fire({
            icon: 'info',
            title: '로그아웃 되었습니다.',
            text: '다음에 또 만나요'
        })
        sessionStorage.clear();
        setIsLogin(false);
    }

    useEffect(() => {
        if (sessionStorage.getItem('token') != null) {
            // console.log("aaaaaaaaaaaaaa");
            const token = sessionStorage.getItem('token');
            const decodedToken = jwt_decode(token);
            // console.log(decodedToken)


            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/payment/detail/${decodedToken.sub}`)
                .then(res => {
                    // console.log(">>>>>>>>>" + res.data);
                    setUserPoint(res.data);
                    setUserNickname(decodedToken.name);
                    // console.log("**********" + decodedToken.name);
                    setIsLogin(true);
                    setUserId(decodedToken.userId);
                })
                .catch(err => { console.log(err) })
        }
    }, [isLogin])

    if (isLogin) {
        return (
            <div className={style.Header}>
                <Link to="/">   <img src={BridgeWhiteLogo} /> </Link>
                <div className={style.navContainer}>

                    <div className={style.leftContents}>
                        <ul className={style.leftMenu}>

                        {/* <div className={style.rightContents}>
                                <div className={style.pointbox}>
                                    <li> <a className={style.point}>{userPoint}<Icon icon="mdi:coins" color="#fcee26" /></a></li>
                                    <div className={style.drop}>
                                        <Link to="/profile/charge">충전하기</Link>
                                        <Link to="/partner/bankHistory">거래내역</Link>
                                    </div>
                                </div>



                                <div className={style.rightContents}>
                                    <div className={style.box}>
                                        <li> <a className={style.nickname}>{userNickname}님</a></li>
                                        <div className={style.drop}>
                                            <Link to="/profile/detail">프로필</Link>
                                            <Link to="/partner/doing">작업페이지</Link>
                                            <Link to="/chatting">채팅</Link>
                                            <a><button className={style.logout} onClick={handlerOnLogoutClick} >LOGOUT</button></a>


                                        </div>

                                    </div>
                                </div>
                            </div> */}


                            <li className={style.Lefts}>
                                <Link to="/split">  <a>Split Music</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/jam/list">   <a>Make Music</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/partner/list">    <a>Commission</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/tip/list">    <a>Community</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/tip/list">    <a>About Us</a></Link>
                            </li>
                            
                            


                            <div className={style.rightContents1}>
                                <div className={style.pointbox}>
                                    
                                    <li> <a className={style.point}>{userPoint}<Icon icon="mdi:coins" color="#fcee26" style={{position:'absolute' , marginTop:'1px' , marginLeft:'2px'}}/></a></li>
                                    <div className={style.drop}>
                                        <Link to="/partner/charge">충전하기</Link>
                                        <Link to="/deal/list">거래내역</Link>
                                    </div>
                                </div>



                                <div className={style.rightContents2}>
                                    <div className={style.box}>
                                        <li> <a className={style.nickname}>{userNickname}님</a></li>
                                        <div className={style.drop}>
                                            <Link to="/profile/detail">프로필</Link>
                                            <Link to="/partner/doing">작업페이지</Link>
                                            <Link to="/chatting">채팅</Link>
                                            <a><button className={style.logout} onClick={handlerOnLogoutClick} >LOGOUT</button></a>


                                        </div>

                                    </div>
                                </div>
                            </div>


                        </ul>
                    </div>
                </div>

            </div>
        )
    } else {
        return (
            <div className={style.Header}>
                <Link to="/">   <img src={BridgeWhiteLogo} /> </Link>
                <div className={style.navContainer}>
                    <div className={style.leftContents}>
                        <ul className={style.leftMenu}>

                            <li className={style.Lefts}>
                                <Link to="/split">  <a>Split Music</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/jam/list">   <a>Make Music</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/partner/list">    <a>Commission</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/tip/list">    <a>Community</a></Link>
                            </li>
                            <li className={style.Lefts}>
                                <Link to="/aboutUs">    <a>About Us</a></Link>
                            </li>

                            <Link className={style.Login} to="/login">로그인</Link>
                            <Link className={style.regist} to="/signup">회원가입</Link>



                        </ul>
                    </div>
                </div>

            </div>
        )
    }
}

export default Header4;