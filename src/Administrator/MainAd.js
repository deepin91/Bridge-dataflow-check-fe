import style from './MainAd.module.css';
import React from 'react';
import warning from './warning.png';
import arrow from './right-arrow.png';
import megaphone from './megaphone.png';
import coin from './coin.png';
import checkbox from './checkbox.png';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";


const MainAd = () => {

    const history = useHistory();

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
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        console.log(">>>>>>>>>>>>> " + decode_token);

        if (decode_token.sub != 'admin') {
            Swal.fire({
                icon: 'error',
                title: '관리자만 이용할 수 있습니다',
                text: '메인 페이지로 이동합니다.',
            })
            history.push(`/`)
        }
    }, [])

    return (
        <>
            <div className="container clearfix" >
                <div className={style.mainBox}>
                    <h1 className={style.mainText}> 관리자 전용 페이지 </h1>
                    <Link to={`/admin/report/list`}>
                        <div className={style.report}>
                            <img src={warning} className={style.reportIcon}></img>  <p>신고 관리 </p>
                            <img src={arrow} className={style.reportArrow}></img> </div>
                    </Link>
                    <Link to={`/admin/notice/list`}>
                        <div className={style.notify}>
                            <img src={megaphone} className={style.notifyIcon}></img><p>공지 등록</p>
                            <img src={arrow} className={style.notifyArrow}></img></div>
                    </Link>
                    <Link to={`/admin/deal/list`}>
                        <div className={style.deal}>
                            <img src={coin} className={style.dealIcon}></img> <p>거래 내역</p>
                            <img src={arrow} className={style.dealArrow}></img></div>
                    </Link>
                    {/* 인증 빼면 이 공간은 무엇으로 사용..? */}
                    {/* <div className={style.certification}><img src={checkbox} className={style.certificationIcon}></img> <p>인증 관리 </p>
                        <img src={arrow} className={style.certificationArrow}></img></div> */}
                </div>
            </div>
        </>
    );
}

export default MainAd;