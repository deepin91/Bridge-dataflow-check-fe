
import { useEffect, useState } from 'react';
import style from './NoticeWrite.module.css';
import axios from 'axios';
// import Notice from './notice/NoticePage';
// import '../reset.css';
import NoticeToastEditor from '../Component/NoticeToastEditor.js'
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";




function NoticeWrite({history}) {

    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');

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

          if (decode_token.sub != 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'id, pw가 일치하지 않습니다.',
                text: '확인 후 다시 시도해주세요.',
            })
            history.push(`/`)
          }
    }, [])

    return (
        <>
           <div className="container">
            <div className={style.topbox}>
                <input className={style.titlebox} value={title} onChange={(e) => { setTitle(e.target.value) }} type='text' placeholder='제목'></input>
            </div>
            <div className={style.writebox}>
            <NoticeToastEditor title={title}/>
            </div>
        </div>
        </>
    );
}

export default NoticeWrite;