import { useEffect, useState } from "react";
// import styles from 'C:/javascript/the-muse/src/detail/detail.module.css';
// import style from './TipList.module.css'
import style from './TipDetail.module.css';
import axios from "axios";
import jwt_decode from "jwt-decode";
import jwtDecode from 'jwt-decode';
import { Icon } from '@iconify/react';
// import HeartImg from './HeartImg.png';
// import EmptyHeartImg from './EmptyHeartImg.png';

// import React, { useState, useEffect } from "react";

// import styled from "styled-components";
// import HeartImg from './HeartImg.png';
// import EmptyHeartImg from './EmptyHeartImg.png';
// import { useParams } from 'react-dom';


function TipHeartCnt({ match, history, tbIdx, tbHeart }) {

    // const tb_idx = match.params.tbIdx;
    // const tb_heart = match.params.tbHeart;
    // const {tb_heart} = useParams();
    // const {tb_idx} = useParams();

    const [heartUpdate, setHeartUpdate] = useState(false)
    const [heartCnt, setHeartCnt] = useState(0)
    // const [userNickname, setUserNickname] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        console.log(decodedToken);
        // setUserNickname(decodedToken.userNickname);

        // axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}`)
        axios.get(`http://localhost:8080/api/tipdetail/${tbIdx}/getHeart`)
            .then(response => {
                console.log(response);
                setHeartCnt(response.data.tbHeart);
            })
            .catch(error => console.log(error));
    }, []);

    const heartUpdateHandler = () => {
        setHeartUpdate(!heartUpdate)
    }

    const heartCountHandler = () => {

        if (!heartUpdate) {
            setHeartCnt(heartCnt + 1)
            // axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}/Heart`,
            axios.put(`http://localhost:8080/api/tipdetail/${tbIdx}/heart`,
                { tbIdx , tbHeart })
                .then(response => {
                    console.log(response);
                    heartUpdateHandler()

                })
                .catch(error => {
                    console.log(error);
                    return;
                });
        } else if (heartUpdate) {
            setHeartCnt(heartCnt - 1)
            // axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}/unlike`,
            axios.put(`http://localhost:8080/api/tipdetail/${tbIdx}/unHeart`,
                { tbIdx , tbHeart })
                .then(response => {
                    console.log(response);
                    heartUpdateHandler()

                })
                .catch(error => {
                    console.log(error);
                    return;
                });
        }
    }

    return (
        <>
            <div className={style.heartbox}>
                
             
                {heartUpdate ?
                      <button onClick={heartCountHandler}><Icon className={style.HeartAfter} icon="line-md:heart-filled" width="40" height="40" /></button>
                      :
                      <button onClick={heartCountHandler}><Icon className={style.Heart} icon="line-md:heart" width="40" height="40"/></button>
                    // <img className={style.Heart} type="button" onClick={heartCountHandler} src={HeartImg} ></img>
                    // :
                    // <img className={style.Heart} type="button" onClick={heartCountHandler} src={EmptyHeartImg}></img>

                }
                
                {/* <span ><i> {heartCnt} </i> </span> */}
                <h1 className={style.Heart}>Likes{heartCnt} </h1>
            </div>

        </>
    );
}

export default TipHeartCnt;