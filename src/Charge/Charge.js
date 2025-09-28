import { useEffect, useState } from 'react';
import style from './Charge.module.css';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from "sweetalert2";

const Charge = ({ match }) => {

    const { total } = match.params;
    const { usepoint } = match.params;

    const history = useHistory();

    const [userId, setUserId] = useState('');
    const [currentPoint, setCurrentPoint] = useState(0);
    const [chargePoint, setChargePoint] = useState(0);
    const [willPoint, setWillPoint] = useState(0);

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
        setUserId(decode_token.sub);
        console.log(">>>>>>>>>>>>>>" + userId);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/chargePoint/${userId}`)
            .then(response => {
                console.log(response.data);
                setCurrentPoint(response.data.userPoint);
                setWillPoint(currentPoint);
            })
            .catch(error => {
                console.log(error);
            })
    }, [userId]);

    useEffect(() => {
        setWillPoint(currentPoint + parseInt(chargePoint));
    }, [currentPoint, chargePoint]);

    const handleChargePoint = (e) => {
        setChargePoint(e.target.value);
    }

    useEffect(() =>{
        console.log(total);
        console.log(usepoint);
        setChargePoint(total);
        setCurrentPoint(usepoint);
    },[]);


    const handleCharge = (e) => {
        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/doCharge/${userId}`, { userId, "money": chargePoint })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    //카카오페이 버튼 클릭 핸들러
    const handleKakaopay = (e) => {
        e.preventDefault();
        //sessionStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInN1YiI6InRlc3QiLCJqdGkiOiJiNjA2NGU4Mi1jYTE5LTQxODUtODY1YS05NThiZWNiZTM3NTAiLCJpYXQiOjE2ODI5MjYxMjQsImV4cCI6MTY4MzAxMjUyNH0.uYp4WAIcEKas7DrtK90sVA5jzSroszUosynG8pYYLko")
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/pay/${chargePoint}/${userId}`)
            .then(response => {
                console.log(response.data);
                window.location.href = response.data.next_redirect_pc_url;     
            })
            .catch(error => {
                console.log(error);
            })
    }

    // const test = () => {
    //     axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/test`, { header: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
    //         .then(r => {
    //             console.log(r);
    //         })
    // }

    return (
        <>
            <div className='container clearfix'>
            <h1 className={style.mainText}>포인트 충전</h1>
                <div className={style.mainBox}>
                  
                    <div className={style.mainContent}>
                        <div className={style.possess}>
                            <p className={style.possessText}>현재 보유 포인트</p>
                            <p className={style.possessMoney} value={currentPoint}>{currentPoint}&nbsp;원</p>
                        </div>
                        <div className={style.charge}>
                            <p className={style.chargeText1}>충전할 금액</p>
                            <div className={style.chargeBox}>
                                <input type='number' value={chargePoint} onChange={handleChargePoint} className={style.chargeInput} placeholder='원하는 금액을 입력하세요.'></input>
                                <p className={style.chargeText2}>원</p>
                            </div>
                        </div>
                        <hr className={style.hr}></hr>
                        <div className={style.result}>
                            <p className={style.resultText1}>충전 후 예상 포인트</p>
                            <p className={style.resultText2}>{willPoint}</p>
                        </div>
                    </div>
                    <div className={style.regist}>
                        <button className={style.registButton} onClick={handleKakaopay}>카카오페이</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Charge;