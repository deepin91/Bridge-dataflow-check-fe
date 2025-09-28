import { Link } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from "react";
import style from './SignUpTest.module.css';
import { useRef } from 'react';
import React from 'react';
import { FaAngleDown } from "react-icons/fa";
import { FaAngleDown2 } from "react-icons/fa";
import BridgeBlackLogo from '../SignUp/BridgeBlackLogo.png';
import Alert from './Alert.png';
import UnLock from './UnLock.png';
import Locked from './Locked.png';
import { click } from '@testing-library/user-event/dist/click';
import { Password } from '@mui/icons-material';
import Swal from "sweetalert2";
import check from './check.png';

const SignUpTest = ({ history, props }) => {
    const [dropdownVisibility, setDropdownVisibility] = React.useState(false);
    const [dropdownVisibility2, setDropdownVisibility2] = React.useState(false);
    //이름
    const [userName, setName] = useState();
    //아이디
    const [userId, setUserId] = useState();
    const [confirmId, setConfirmId] = useState();
    const [confirmIdMessage, setConfirmIdMessage] = useState();
    //닉네임
    const [userNickname, setNickName] = useState();
    //비밀번호
    const [userPassword, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [confirmMessage, setConfirmMessage] = useState();
    const [PWmessage, setPWmessage] = useState();

    //연락처
    const [userPhoneNumber, setPhone] = useState();
    //이메일
    const [userEmail, setEmail] = useState();


    const [Pmessage, setPmessage] = useState();
    const [Emessage, setEmessage] = useState();
    const [verifyCode, setVerifyCode] = useState();
    const [verifyConfirmMessage, setVerifyConfirmMessage] = useState();
    const [tag, setTag] = useState([]);


    //새로 추가한 부분 
    const [select, setSelect] = useState("010");
    const [selectEmail, setSelectEmail] = useState("@bridge.com");
    const [userFrontNumber, setUserFrontNumber] = useState();
    const [userLastEmail, setUserLastEmail] = useState();


    const [auth, setAuth] = useState('');
    const [temp, setTemp] = useState('');

    const [insert, setInsert] = useState(0);
    const [userFirstEmail, setFirst] = useState('');


    const handleSelectFrontNumber = (e) => {

        setSelect(e.target.value);
    };

    useEffect(() => {
        let frontmail = userFirstEmail + selectEmail;
        // if (/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(frontmail)) {
        // if (/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i.test(frontmail)) {
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i.test(frontmail)) {
            setEmail(frontmail);
            console.log(frontmail);
            setEmessage(null);

        } else {
            setEmail('');
            setEmessage('이메일 형식이 올바르지 않습니다.');
        }
    }, [userFirstEmail, selectEmail]);



    const handlerOnClick = e => {
        e.preventDefault();
        if (confirmMessage == null && Pmessage == null && Emessage == null && userId != null && confirmIdMessage != null
        ) {

            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/regist`, {
                "userId": userId, "userPassword": userPassword, "userName": userName, "userEmail": userEmail, "userPhoneNumber": userPhoneNumber
            })
                .then(response => {

                    // alert('정상적으로 등록 되었습니다.')
                    Swal.fire({
                        title: 'Congraturation!',
                        text: 'Bridge의 회원이 되신 것을 축하드립니다.',
                        imageUrl: 'https://media.discordapp.net/attachments/1105381996731039825/1108956932884148294/20210508_150502.jpg?width=438&height=584',
                        imageWidth: 300,
                        imageHeight: 300
                    })
                    history.push('/login')


                })
                .catch(error => {
                    // alert('id, pw가 일치하지 않습니다')
                    Swal.fire({
                        icon: 'error',
                        title: 'id, pw가 일치하지 않습니다.',
                        text: '확인 후 다시 시도해주세요.',
                    })
                    console.log(error)
                    sessionStorage.clear();
                })
        } else {
            // alert('형식이 일치하지 않습니다')
            Swal.fire({
                icon: 'error',
                title: '형식이 일치하지 않습니다.',
                text: '확인 후 다시 시도해주세요.',
            })

        }
    };






    //ID 중복체크
    const userIdCheck = (e) => {
        e.preventDefault();
        if (userId == undefined || userId == '') {
            setConfirmIdMessage("사용하실 아이디를 입력해주세요.")
            Swal.fire({
                icon: 'info',
                title: '입력된 내용이 없습니다.',
                text: '사용하실 아이디를 입력해주세요.'
            })
            return;
        }
        if (confirmIdMessage == "아이디 형식이 일치하지 않습니다.") {
            Swal.fire({
                icon: 'error',
                title: '아이디 형식이 옳지않아~용.',
                text: '4 ~ 16자 영문 대 소문자, 숫자를 사용하세요.'
            })
            return;
        }
        console.log("asjsdfjfkds")
        // axios.post(`http://192.168.0.47:8080/api/idlist/${userId}`,)
            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/idlist/${userId}`,)
            .then(response => {
                console.log(response.data);
                const data = response.data;
                // if (confirmIdInputMessage !== null) {
                //     // alert('사용하실 아이디를 입력해주세요.');


                // } else
                if (data === 1) {
                    alert("이미 사용중인 아이디입니다.");
                    Swal.fire({
                        icon: 'error',
                        title: '이미 사용중인 아이디입니다.',
                        text: '다른 아이디로 다시 시도해주세요.'
                    })
                    setConfirmIdMessage("이미 사용중인 아이디입니다.");
                } else if (data === 0) {
                    // Swal.fire("사용 가능한 아이디입니다.");
                    Swal.fire({
                        title: '사용 가능한 아이디입니다.',
                        text: "이 id를 사용하시겠습니까?",
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                'Success!',
                                '탁월한 선택이십니다 :)',
                                'success'
                            )
                        }
                    })

                    setConfirmIdMessage("탁월한 선택이십니다.");
                }
            })
            .catch(error => {
                console.error(error);
            });
    }



    const handlerAuth = () => {
        setUserId(userId);
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/emailConfirm/${userEmail}`)
        // axios.post(`http://192.168.0.47:8080/emailConfirm/${userEmail}`)
            .then((r) => {
                console.log(r.data)
                setAuth(r.data)
                // alert("인증번호가 발송되었습니다.")
                Swal.fire({
                    icon: 'success',
                    title: '인증번호가 발송되었습니다.',
                    text: '메일함을 확인해주세요.',
                    confirmButtonColor: '#3c3e58'
                    // confirmButtonColor: '#3085d6'
                })
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: '메일 주소를 입력해주세요!',
                    // text: '잠시 후 인증코드가 포함된 메일이 전송됩니다.',
                })
                // alert("오류가 발생하였습니다.")
            })
    }

    const handlerCheck = () => {
        // if (auth == temp) {
            // axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/emailConfirm/${userEmail}`)
            // axios.post(`http://192.168.0.47:8080/emailConfirm/${userEmail}`)
            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/verifyCode`, null, {
                params: {
                    email: userEmail,
                    code: temp
                }
            })
                .then((r) => {
                    // alert("인증이 성공적으로 완료되었습니다.");
                    Swal.fire({
                        title: '인증이 성공적으로 완료되었습니다.',
                        text: "가입절차를 마무리 해주세요.",
                        icon: 'success',
                        confirmButtonColor: '#3c3e58'
                        // confirmButtonColor: '#3085d6'
                    });
            })
            .catch((e) => {
            // alert("인증번호가 일치하지 않습니다.");
            Swal.fire({
                title: '인증코드가 일치하지 않습니다.',
                text: "입력하신 내용을 다시 확인해주세요.",
                icon: 'error',
            });
            console.error("인증에 실패하였습니다.", e);
        });
    };

    // const handlerOnClickForVerification = e => {
    //     if (e.target.value === verifyCode) {
    //         setVerifyCode(e.target.value)
    //         setVerifyConfirmMessage(null);
    //     } else {
    //         setVerifyCode(e.target.value);
    //         setVerifyConfirmMessage('인증에 실패했습니다. 다시 시도해주세요.')
    //     }
    // };



    //핸들러 모음
    const handlerChangeName = e => {
        setName(e.target.value);
    };

    const handlerChangeUserId = e => {
        setUserId(e.target.value);
    };

    const handlerChangePassword = e => {
        setPassword(e.target.value);
    };

    const handlerChangeNickName = e => {
        setNickName(e.target.value);
    }




    const handlerChangeConfirmId = e => {

        if (!/^[a-z0-9]{8,12}$/.test(userId)) {
            setConfirmIdMessage("아이디 형식이 일치하지 않습니다")
        }
    };



    const handlerChangeConfirmPassword = e => {
        if (e.target.value === userPassword
            && /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{8,16}$/.test(userPassword)) {
            setConfirmPassword(e.target.value)
            setPassword(userPassword);
            // setPWmessage(null);
            setConfirmMessage(null);
        } else if (e.target.value !== userPassword
            && /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{8,16}$/.test(userPassword)) {
            setConfirmPassword(e.target.value);
            setConfirmMessage('비밀번호가 일치하지 않습니다.')
        } else {
            setConfirmPassword(e.target.value);
            setConfirmMessage('비밀번호 형식이 올바르지 않습니다.')
            // setPassword(e.target.value);
            // setPWmessage('비밀번호 형식이 올바르지 않습니다.');
        }
    };

    const changePhone = e => {
        let number = select + "-" + e.target.value;
        // console.log(select);
        if (/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/.test(number)) {
            // if (/^(select)-(?:\d{3}|\d{4})-\d{4}$/.test(e.target.value)) {
            setPhone(number);
            setPmessage(null);
            console.log(number);
        } else {
            setPhone(e.target.value);
            setPmessage('번호 형식이 올바르지 않습니다.');
        }
    };

    const checkPassword = e => {
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(userPassword)) {
            setPassword(userPassword);
            setPWmessage(null);
            console.log(userPassword);
        } else {
            setPassword(e.target.value);
            setPWmessage('비밀번호 형식이 올바르지 않습니다.');
        }
    };

    const handlerSelectLastEmail = (e) => {
        // setInsert(insert + 1);
        setSelectEmail(e.target.value);
    };


    const handlerChangeEmail = e => {
        // let frontmail =  e.target.value + selectEmail;  
        setFirst(e.target.value);

        // if (/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(frontmail)) {
        //     setEmail(frontmail);
        //     console.log(frontmail);
        //     setEmassage(null);

        // } else {
        //     setEmail(e.target.value);
        //     setEmassage('이메일 형식이 올바르지 않습니다.');
        // }

    };


    const [hidePassword, setHidePassword] = useState(true);
    // const [showLockedButton, setShowLockedButton] = useState(true);
    const [src, setSrc] = useState(UnLock);
    const toggleHidePassword = () => {
        setHidePassword(!hidePassword)
        if (!hidePassword) {
            setSrc(!UnLock);
        } else {
            setSrc(Locked);
        }
    }

    const [hidePassword2, setHidePassword2] = useState(true);
    // const [showLockedButton, setShowLockedButton] = useState(true);
    const [src2, setSrc2] = useState(UnLock);
    const toggleHidePassword2 = () => {
        setHidePassword2(!hidePassword2)
        if (!hidePassword2) {
            setSrc2(!UnLock);
        } else {
            setSrc2(Locked);
        }
    }

    return (
        <>

            <div className='container clearfix'>
                <div className={style.wrapper}>
                    <div className={style.container}>
                        <div className={style.signUpContainer}>
                            <form className={style.form}>
                                <img className={style.BridgeBlackLogo} src={BridgeBlackLogo} alt='브릿지 로고'></img>

                                <div className={style.basicBox}>
                                    <div className={style.line_or}>
                                        <span className={style.line_or_before} />
                                        <span className={style.txt_or}>회원가입</span>
                                        <span className={style.line_or_after} />
                                    </div>
                                </div>

                                <div className={style.idBox}>
                                    <div className={style.basicBox2}>
                                        <input className={style.idInputBox} type="Id" placeholder="아이디" onBlur={handlerChangeConfirmId} onChange={handlerChangeUserId} />
                                        <button className={style.idCheckButton} onClick={userIdCheck} >ID 중복확인</button>
                                        <div>
                                            <span type="Id" name="Id" value={confirmId} onChange={(e) => {
                                                setConfirmId(e.target.value)
                                            }} />

                                            {
                                                confirmIdMessage != null && <div className={style.warningMessage}> {confirmIdMessage}</div>
                                            }
                                            {/* {
                                                console.log("aaaaaaaaaaaaaaaaasssssssssssssss" + confirmIdInputMessage)
                                            }
                                            {
                                                confirmIdInputMessage != null && <div className={style.warningMessage}> {confirmIdInputMessage}</div>
                                            } */}

                                        </div>
                                    </div>

                                </div>
                                <div className={style.passwordBox}>

                                    <label>

                                        <input className={style.formInput} type={hidePassword ? "password" : "text"} placeholder="비밀번호" onChange={handlerChangePassword} required minLength={8} maxLength={16} />

                                        <img type="Button" className={style.Locked} src={src ? UnLock : Locked} value={Locked} onClick={toggleHidePassword} /></label>
                                    <label>
                                        <input className={style.formInput} type={hidePassword2 ? "password" : "text"} placeholder="비밀번호 확인" onChange={handlerChangeConfirmPassword} required minLength={8} maxLength={16} />
                                        <img type="Button" className={style.Locked} src={src2 ? UnLock : Locked} value={Locked} onClick={toggleHidePassword2} />

                                    </label>




                                </div>
                                <div className={style.warningBox}>
                                    <span type="password" name="password" value={confirmPassword} className={style.txt_or} onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                    }} onBlur={handlerChangeConfirmPassword} />

                                    {
                                        confirmMessage != null ? <div className={style.pwWarningMessage}> {confirmMessage}</div>
                                            : <div className={style.pwWarningMessage}>  *8 ~ 16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.</div>
                                    }

                                </div>



                                <div>
                                    <input className={style.nameInput} type="text" placeholder="이름" onChange={handlerChangeName} />
                                </div>
                                <div className={style.NumberBox}>

                                    <select className={style.selectNumberBox} onChange={handleSelectFrontNumber}>
                                        {/* <option value="number" disabled selected>010</option> */}
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="016">016</option>
                                        <option value="018">018</option>
                                    </select>
                                    <input className={style.NumberBoxInput} type="phoneNumber" placeholder="ex) 0000 - 0000" onBlur={changePhone} />
                                </div>
                                {console.log(">>>>>>>>>>>>>" + userPhoneNumber)}
                                <div className={style.line_or}>
                                    <span className={style.line_or_before} />
                                    <span className={style.txt_or}>본인확인 이메일</span>
                                    <span className={style.line_or_after} />
                                </div>

                                <div className={style.MailBox}>
                                    <input className={style.mailBoxInput} type="text" placeholder="이메일" onChange={handlerChangeEmail} />
                                    <select className={style.selectMailBox} value={selectEmail} onChange={handlerSelectLastEmail}>
                                        {/* <option value="mail" disabled selected>e-mail</option> */}
                                        <option value="@bridge.com">bridge.com</option>
                                        <option value="@naver.com">naver.com</option>
                                        <option value="@gmail.com">gmail.com</option>
                                        <option value="@daum.net">daum.net</option>
                                    </select>
                                </div>
                                <button type="button" className={style.CodeButton} onClick={handlerAuth}>인증코드 요청</button>

                                {console.log(">>>>>>>>>>>>>" + userEmail)}

                                <div className={style.idBox}>
                                    <input className={style.idInputBox} type="email" placeholder="인증코드 입력" value={temp} onChange={(e) => { setTemp(e.target.value) }} />
                                    <button className={style.idCheckButton} onClick={handlerCheck}>코드 인증</button>
                                    {/* <button className={style.registrationButton} onClick={handlerOnClickForVerification}>확인 </button> */}
                                </div>
                                {/* <input className={style.formInput} type="PINCODE" placeholder="인증번호를 입력하세요" onChange={changePhone} /> */}

                                <button className={style.registrationButton} onClick={handlerOnClick}>가입하기</button>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        </>

    )
}

export default SignUpTest;