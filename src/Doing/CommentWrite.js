import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import style from './Doing.module.css';

const CommentWrite = ({ pcIdx, CommentSet}) => {

    const [pdcComment, setPdcComment] = useState('');
    const [render, setRender] = useState(false)

    const token = sessionStorage.getItem('token');
    const decode_token = jwt_decode(token);
    let userId = decode_token.sub;

    const handlerChangePdcContent = e => setPdcComment(e.target.value);
    const handlerSubmit = (e) => {
        e.preventDefault();

        const header = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        };

        const data = {
            userId : userId,
            pcIdx : pcIdx,
            pdcComment: pdcComment
        }

        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/comment/write/${pcIdx}`, data,
            { headers: header })
            .then(response => {
                console.log(response)
                if(response.data == 1){
                alert("댓글 추가 성공");
                CommentSet(pcIdx);
                setPdcComment('');
                }
                else if (response.data == 0) {
                    alert("작성한 내용이 없습니다.")
                }
            })
            .catch((eroor) => {
                alert("댓글 추가 실패");
            })  
    }


    return (
        <>
            <form onSubmit={handlerSubmit}>
                <input className={style.commentWrite} value={pdcComment} type="text" onChange={handlerChangePdcContent}></input>

                <button className={style.submit}>등록</button>
            </form>

        </>
    );

}

export default CommentWrite;