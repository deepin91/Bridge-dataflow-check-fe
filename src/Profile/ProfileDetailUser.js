import style from './ProfileDetail.module.css'
import '../reset.css';
import certiMark from "./icons/certiMark.svg"
import profile_img from "./icons/user.svg"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer } from '@toast-ui/react-editor';
import Waveform from './Waveform';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CreateOutlined, MailOutline, ReportProblemOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";


function ProfileDetailUser({ match }) {
    const { user } = match.params;
    const [data, setData] = useState([]);
    const [userInfo, setUserInfo] = useState('');
    const [tag, setTag] = useState('');
    const [userId, setUserId] = useState('');
    const [reviewList, setReviewList] = useState([]);

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
        } else {
            const token = sessionStorage.getItem('token');
            const decode_token = jwt_decode(token);
            setUserId(decode_token.sub);
            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${user}`)
                .then((response) => {
                    setData(response.data.profile[0]);
                    setUserInfo(response.data.userDto);
                    setTag(response.data.taglist)
                    setReviewList(response.data.reviewlist);
                    console.log("리뷰리스트>>>>>>>>>" + reviewList);
                })
        }
    }, [userId])

    let a = 0;

    return (
        <>
            <div className='box1'>
                
            </div>
            <div className='container clearfix'>
                <div className={style.profile}>
                    <img className={style.profileIMG} src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.profileImg}.jpg`} />
                    <span className={style.name}>{userInfo.userId}</span>
                    
                   
                      
                    
                    <p style={{ marginTop: "10px", marginBottom: "10px" }}>{data.userPosition}</p>

                    <p className={style.comment}>
                        {data.userIntroduction}
                    </p>

                    <p>
                        {
                            Array.isArray(tag) && tag.map((d) => {
                                return (<span>#{d.tag}</span>)

                            })
                        }
                    </p>

                    <p className={style.link} onClick={() => { window.open('https://google.co.kr', '_blank') }}>{data.userSite}</p>

                    <Link to="#">   <MailOutline sx={{ fontSize: 24 }} /> </Link>
                    <Link to="/profile/write"><CreateOutlined sx={{ fontSize: 24 }} /></Link>
                    <Link to={`/report/write/${userId}`}><ReportProblemOutlined sx={{ fontSize: 24 }} /></Link>
                </div>

                <div className={style.detail}>
                    <div className={style.playbar}>
                        <Waveform
                            data={data.userMusic}
                            src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getMusic/${data.userMusic}`}
                        />
                    </div>
                    <div className={style.introduce}>
                        {data.userPortfolio && <Viewer initialValue={data.userPortfolio}></Viewer>}
                    </div>
                </div>
                <div className={style.review}>
                    <p style={{ fontSize: "22px", marginTop: "20px", fontWeight: "bold" }}>후기</p>
                    {console.log(reviewList)}
                    {reviewList.length != 0 ? reviewList.map(list => {
                        return(
                            <div className={style.reviewdetail}>
                            {/* <p className={style.reviewtitle}>작업물 제목</p> */}
                            <p className={style.reviewcontents}>
                            {list.content}
                            </p>
                        </div>
                        )
                    }) : <div className={style.reviewnone}>후기가 없습니다.</div>}
                </div>
            </div>
        </>
    );
}
export default ProfileDetailUser;