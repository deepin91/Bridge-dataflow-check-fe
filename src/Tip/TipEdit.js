import { useState, useEffect } from "react"
import axios from "axios";
import ToastEditor from "../Component/ToastEditor";
import jwtDecode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import Swal from "sweetalert2";
import style from '../Admin-Notice/NoticeWrite.module.css'

export default function TipEdit({ match }) {

    const tb_idx = match.params.tbIdx;
    const [data, setData] = useState({});
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
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tipdetail/${tb_idx}/0`)
            .then(r => {
                setData(r.data.tipDetail);
                setTitle(r.data.tipDetail.tbTitle);
            })
    }, [])

    return (
        <div className="container">
            <div className={style.topbox}><input className={style.titlebox} value={title} onChange={(e) => { setTitle(e.target.value) }} type='text'></input>
            </div>
            <div className={style.writebox}>
                {data.tbContents && <ToastEditor data={data} title={title}></ToastEditor>}
            </div>
        </div>
    )
}