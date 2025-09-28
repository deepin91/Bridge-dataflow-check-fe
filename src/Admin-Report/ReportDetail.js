import style from './ReportDetail.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
// import Page from 'react';
// import '../reset.css';


function ReportDetail({ match }) {
  const { reportIdx } = match.params;
  const [reportReason, setReportReason] = useState('');
  const [reportReasonDetail, setReportReasonDetail] = useState('');
  const [userId, setUserId] = useState('');
  const [reportedUserId, setReportedUserId] = useState('');
  const [reportCount, setReportCount] = useState('');

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

    if (decode_token.sub != 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'id, pw가 일치하지 않습니다.',
        text: '확인 후 다시 시도해주세요.',
      })
      history.push(`/`)
    }
    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/openReportDetail/${reportIdx}`)
      .then(response => {
        setReportReason(response.data.reportReason);
        setReportReasonDetail(response.data.reportReasonDetail);
        setUserId(response.data.userId);
        setReportedUserId(response.data.reportedUserId);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/reportCount/${response.data.reportedUserId}`)
          .then(response => {
            setReportCount(response.data);
          })
          .catch(error => {
            // console.log(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/reportCount/${reportedUserId}`);
            console.log(error);
          })
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  const handleReport = () => {
    axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/handleReport/${userId}`, { "userId": reportedUserId })
      .then(response => {
        Swal.fire({
          icon: 'info',
          title: '영구정지 처리되었습니다.',
          text: '목록으로 돌아갑니다.'
        })
        history.push(`/admin/report/list`)
      })
      .catch(error => {
        console.log(error);
      })
  };


  return (
    <>
      <div className='container clearfix'>
        <div className={style.grayBox}>
          <h1 className={style.boxTitle}>사용자 신고 상세내역</h1>
          <div className={style.box}>
            <h5 className={style.boxText1}>신고 대상 </h5>
            <div className={style.inputBox1}>:  &nbsp;{reportedUserId} </div>
          </div>
          <div className={style.box}>
            <h5 className={style.boxText1}>신고자 </h5>
            <div className={style.inputBox1} >: &nbsp;{userId}</div>
          </div>
          <div className={style.box2}>
            <h5 className={style.boxText2}>사유 </h5>
            <div className={style.inputBox2}>: &nbsp;{reportReason}</div>
          </div>
          <div className={style.box3}>
            <h5 className={style.boxText3}>상세내용 </h5>
            <div className={style.inputBox3}>: &nbsp;{reportReasonDetail}</div>
          </div>
          <div className={style.box4}>
            신고 당한 횟수 : {reportCount}
          </div>

          {/* 영구정지 처리시 1로 값 바뀜 => 스프링 로그인에서 if문 사용해서 제재 필요 */}
          <button className={style.button1} onClick={handleReport}>영구정지</button>
          <Link to="/admin/report/list"><button className={style.button1}>목록</button></Link>
        </div>
      </div>
    </>
  );
}

export default ReportDetail;