import style from '../Payment/Payment.module.css';
import user from './user.png';
import arrow from './PaymentImg.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";

const Payment = () => {

    const [userId, setUserId] = useState('');
    const [currentPoint, setCurrentPoint] = useState(0);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chargePoint/${decode_token.sub}`)
            .then(response => {
                console.log(response.data);
                setCurrentPoint(response.data.userPoint);
                // setWillPoint(currentPoint);
            })
            .catch(error => {
                console.log(error);
            })
    }, [userId]);

    return (
        <>
                <div className='container clearfix' >
            <div className={style.mainBox}>
                <div className={style.mainText}>결제</div>
                <div className={style.profile}>
                    <div className={style.request}>
                        <div className={style.requestText}>신청자 닉넴</div>
                        <img src={user} className={style.requestImg}></img>
                    </div>

                    <img src={arrow} className={style.arrowImg}></img>

                    <div className={style.response}>
                        <div className={style.responseText}>커미션주 닉넴</div>
                        <img src={user} className={style.responseImg}></img>
                    </div>
                </div>
                <div>
                    <span className={style.advanceText}>선지급금</span>
                    <input type="text" className={style.advance} placeholder='ex)  10,000'></input>
                </div>
                <div className={style.payText}>
                    <span className={style.willPayment}>의뢰 완료시 결제될 금액</span>
                    <input type='text' className={style.willPaymentAm} placeholder='ex)  100,000'></input>
                </div>
                <div className={style.hr}>
                    <hr width="500px" color='black' size="1.5" />
                </div>
                <div className={style.total}> 총 결제 금액
                    <span className={style.totalPayment}>110,000 원</span>
                </div>
                <div>
                    <div className={style.point}>Bridge 포인트</div>
                    <div>
                        <input type='text' className={style.pointInput}></input>
                        <p className={style.pointP}>P</p>
                    </div>
                    <div className={style.havePoint}>
                        <span className={style.have}>보유 {currentPoint} P</span>
                        <label for='All' className={style.selectText}>모두 사용</label>
                        <input type='checkbox' className={style.selectAll} id='All' name='All' value="All" />
                    </div>

                    <button className={style.paymentBtn}>결제</button>

                    <p className={style.paymentNotice}> 잔액이 부족합니다. 포인트를 충전해주세요. </p>
                </div>
            </div>
            </div>
        </>
    );
};

export default Payment;