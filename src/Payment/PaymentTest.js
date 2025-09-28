// import style from './Payment.module.css';
// import user from './user.png';
// import arrow from './PaymentImg.png';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import jwt_decode from "jwt-decode";

// function PaymentTest({ match, history }) {
//     const { paymentIdx } = match.params;

//     // const [userId, setUserId] = useState('');
//     // const [currentPoint, setCurrentPoint] = useState(0);

//     // const [payment, setPayment] = useState({});
//     const [user1, setUser1] = useState('');     //페이먼트를 변경


//     const [downpayment, setDownpayment] = useState('');     //결제금액
//     // const [deposit, setDeposit] = useState('');
//     const [usepoint, setUsepoint] = useState('');   
//     const [clients, setClients] = useState('');     //의뢰인(주는사람)
//     const [producer, setProducer] = useState('');   //제작자(받는사람)
//     // const [allUsepoint, setAllUsepoint] = useState('');
//     // const [total, setTotal] = useState('');
//     const [isChecked, setIsChecked] = useState(false); 
//     const [prevPoint, setPrevPoint] = useState(null);   //보유 포인트
//     // const [pointBox, setPointBox] = useState('');   //사용할 포인트
//     const [warningMessage, setWarningMessage] = useState('');

//     let [pointBox,setPointBox] = useState('');

//     //추가
//     const [total, setTotal] = useState('');
//     let a = 0;

   

//     const handlerChangeDownpayment = e => setDownpayment(e.target.value);


//     useEffect(() => {
//         if(sessionStorage.getItem('token') == null){
//             history.push('/login')
//             return;
//         }
        
//         const token = sessionStorage.getItem('token');
//         const decode_token = jwt_decode(token);
//         setPayment(decode_token.sub);
//         axios.get(`http://localhost:8080/api/payment/detail/${payment}`) //백엔드도 여기처럼 다시 바꿔야함
//             // ,(`http://localhost:8080/api/payment/${userProducer}`)
//             .then(response => {
//                 console.log(response.data);
//                 setUsepoint(response.data);


//                 // setWillPoint(currentPoint);
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//     }, [user1]);

//     useEffect(() => {
//         a = Number(downpayment) -  Number(pointBox);
//         setTotal(a);
//     }, [pointBox])



//     // function calculateSum() {
//     //     const sum = Number(deposit) + Number(downpayment);
//     //     return sum;
//     // }

    

  



//     const handlerOnClickToPay = (e) => {
//         // setProducer(e.target.target);
//         if (total == 0 ) {
//         axios.post(``)
//         alert(`축 성공`);
//         } else {
//             alert('결제에 실패했습니다. 포인트를 충전해주세요.');
//             // history.push('/25');

//         }
//     }

//     // const checkPoint = (e) => {
//     //     if (e.target.value) {
//     //         setUsepoint(e.target.value);
//     //         setWarningMessage(null);
//     //     } else {
//     //         setUsepoint(e.target.value);
//     //         setWarningMessage('잔액이 부족합니다. 포인트를 충전해주세요.');
//     //     }
//     // };


//     function calculateSum() {
//         const sum = Number(usepoint) - Number(downpayment);
//         return sum;
//     }

//     function CheckPointUse() {
//         const sum = Number(downpayment) - Number(pointBox);
//         return sum;
//     }


//     const checkPoint = (e) => {
//         if (usepoint > downpayment) {
//             setWarningMessage('결제를 진행하시겠습니까?');
//             setUsepoint(calculateSum);

//         } else {
//             setUsepoint(e.target.value);
//             setWarningMessage('잔액이 부족합니다. 포인트를 충전해주세요.');
//         }
//     };

//     // const handlerCheckPointUse = (e) => {
//     //     setTotal(downpayment - pointBox)
//     // }

//     const handleusePoint = (e) => {
//         setPointBox(e.target.value);     
//     }


//     const handleCheckBoxChange = (e) => {
//         setIsChecked(e.target.checked);
//         if (e.target.checked) {
//           setPrevPoint(usepoint);
//           setUsepoint(0); // usePoint 값을 0으로 변경
//           setPointBox(usepoint);
//         } else {
//           setUsepoint(prevPoint); // 이전 usePoint 값으로 복구
//           setPrevPoint(usepoint); // prevPoint 값 초기화
//           setPointBox(usepoint);
//         }
//       }
    
//     // setTotalPrice(totalPrice);

//     // useEffect(() => {
//     //     const token = sessionStorage.getItem('token');
//     //     const decode_token = jwt_decode(token);
//     //     setUserId(decode_token.sub);
//     //     axios.get(`http://localhost:8080/api/chargePoint/${userId}`)
//     //         .then(response => {
//     //             console.log(response.data);
//     //             setCurrentPoint(response.data.userPoint);
//     //             // setWillPoint(currentPoint);
//     //         })
//     //         .catch(error => {
//     //             console.log(error);
//     //         })
//     // }, [userId]);

//     const test = (e) => {
//         setDownpayment(e.target.value);
//     }


//     return (
//         <>
//             <div className='container clearfix' >
//                 <div className={style.mainBox}>
//                     <div className={style.mainText}>결제</div>
//                     <div className={style.profile}>
//                         <div className={style.request}>
//                             <div className={style.requestText}>{clients}</div>
//                             <img src={user} className={style.requestImg}></img>
//                         </div>

//                         <img src={arrow} className={style.arrowImg}></img>

//                         <div className={style.response}>
//                             <div className={style.responseText}>{producer}</div>
//                             <img src={user} className={style.responseImg}></img>
//                         </div>
//                     </div>
                    
//                     <div>
//                         <span className={style.willPayment}>의뢰 완료시 결제될 금액</span>
//                         <input type="number" value={downpayment} name="downpayment" className={style.willPaymentAm} placeholder='ex)  100,000' onChange={test}/>
//                         {/* Number( */}
//                     </div>
//                     <div className={style.hr}>
//                         <hr width="500px" color='black' size="1.5" />
//                     </div>
//                     <div className={style.total}> 총 결제 금액
//                         <span className={style.totalPayment} name="total"> {total} 원</span>
//                         {/* {(Number(downpayment) -  Number(pointBox))} */}
//                         {/* {calculateSum().toLocaleString()} */}
                        
//                     </div>
                    
//                     <div>
//                         <div className={style.point}>Bridge 포인트</div>
//                         <div>
//                             {/* <input type='text' value={pointBox} className={style.pointInput}></input> */}
//                             {/* .toLocaleString() */}
//                             <input type="number" name="pointBox" value={pointBox} className={style.pointInput} onChange={handleusePoint}/> 
//                             <p className={style.pointP}> {pointBox}P</p>
//                         </div>
//                         <div className={style.havePoint}>
//                             <span className={style.have}>보유 {usepoint.toLocaleString()} P</span>
//                             <label for='All' className={style.selectText}>모두 사용</label>
//                             <input type='checkbox' checked={isChecked} className={style.selectAll} id='All' name='All' value="All" onChange={handleCheckBoxChange} />
//                         </div>

//                         <button className={style.paymentBtn} onClick={handlerOnClickToPay}>결제</button>

//                         <p className={style.paymentNotice} onChange={checkPoint}></p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PaymentTest;