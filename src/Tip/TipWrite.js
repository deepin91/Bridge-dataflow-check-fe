import { useState, useEffect } from 'react';
import ToastEditor from '../Component/ToastEditor'
import '../reset.css'
import style from '../Admin-Notice/NoticeWrite.module.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from "sweetalert2";


export default function TipWrite() {

    const [title, setTitle] = useState("");
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
    }, [])

    return (
        <div className="container">
            <div className={style.topbox}><input className={style.titlebox} value={title} onChange={(e) => { setTitle(e.target.value) }} type='text' placeholder='제목'></input>
            </div>
            <div className={style.writebox}>
            <ToastEditor title={title}/>
            </div>
        </div>
    );
};