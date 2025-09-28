import style from './ReportPage.module.css';
import '../reset.css'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from "sweetalert2";

function ReportPage({ match }) {

    const reportedUserId = match.params.userId;

    const [select, setSelect] = useState('');
    const [reportReasonDetail, setReportReasonDetail] = useState('')
    const [userId, setUserId] = useState('');
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
        setUserId(decode_token.sub);
    })

    const handleSelect = (e) => {
        setSelect(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`https://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/report/${reportedUserId}`, { userId, reportedUserId, reportReasonDetail, "reportReason": select })
            .then(response => {
                Swal.fire({
                    icon: 'info',
                    title: 'Success!',
                    text: '정상적으로 신고되었습니다.'
                })
                history.push(`/`)
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDetail = (e) => {
        setReportReasonDetail(e.target.value);
    }

    return (
        <div className="container">
            <h1 className={style.mainText}>신고하기</h1>
            <div className={style.Box}>
                <div id="target" className={style.Target}>신고대상: {reportedUserId}</div>
                <select className={style.Select} onChange={handleSelect} value={select}>
                    <option value="" disabled selected>신고 사유 선택</option>
                    <option value="스팸/홍보성 글" >스팸/홍보성 글</option>
                    <option value="욕설/비방 글" >욕설/비방 글</option>
                    <option value="결제 관련" >결제 관련</option>
                    <option value="기타" >기타</option>
                </select>
                <div className={style.input}><textarea className={style.inner} type="text" value={reportReasonDetail} onChange={handleDetail}></textarea></div>
                <button className={style.button} onClick={handleSubmit}>신고</button>
            </div>
        </div>
    )
}
export default ReportPage;