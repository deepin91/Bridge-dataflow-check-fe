import style from './Main.module.css';
import '../reset.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from "swiper";	// 추가
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import { ArrowForward, ArrowRight } from '@mui/icons-material';
import { grey } from '@mui/material/colors';


SwiperCore.use([Autoplay])	// 추가
const Main = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice`)
            .then((r) => {
                setData(r.data)
                console.log(r.data)
            }
            )
    }, [])

    return (
        <div className={style.container}>
        <div className={style.textBox}>
            <h1 className={style.mainText}>Your favorite songs, 
            <br/>like never heard before</h1>
            </div>
                
                <div className={style.firstLine}>
                    <Link to={`/jam/list`}>
                        <button className={style.online}>
                            <h3>Make Music<ArrowForward sx={{ fontSize: 46,  color: grey[100] }} /></h3>
                            <p>장소 제약 없이 사람들과 함께 독창적인 음악을 만들어보세요</p>
                            
                        </button>
                    </Link>
                    <Link to={`/partner/list`}>
                        <button className={style.offline}>
                            <h3>Commission<ArrowForward sx={{ fontSize: 46,  color: grey[100] }} /></h3>
                            <p>음악이 돈이 된다는 걸 보여주지</p>
                        </button>
                    </Link>
                </div>
                <div className={style.secondLine}>
                    <Link to={`/split`}>
                        <button className={style.musicSep}>
                            <h4>Split Music<ArrowForward sx={{ fontSize: 32,  color: grey[100] }} /> </h4>
                            <p>각 파트별 음원을 손쉽게 얻으세요</p>
                        </button>
                    </Link>
                    <Link to={`/tip/list`}>
                        <button className={style.community}>
                            <h4>Community<ArrowForward sx={{ fontSize: 32,  color: grey[100] }} /> </h4>
                            <p>음악인들의 소통창구</p>

                        </button>
                    </Link>
                    
                </div>
                <div style={{marginTop:50}}>
                <Swiper
                    className="banner"
                    spaceBetween={50}
                    slidesPerView={1}
                    autoplay={{ delay: 10000 }}
                    speed={1000}
                 
                >
                    {
                        data.map((n, index) => {

                            const data = new Date(n.createdDt);
   
                            const month = data.getMonth()+1
                  
                            return (
                                <SwiperSlide>
                                    <p className={style.title} style={{ padding: 21}}>공지사항</p>
                                    <p className={style.link} style={{ padding: 21 }}>
                                        {/* 공지사항 링크 */}
                                        <Link to={`/notice/detail/${n.noticeIdx}`} title="공지사항 상세보기">

                                            {n.title}</Link>
                                    </p>
                                    <div><p className={style.date} style={{ padding: 21, marginRight: '16px' }}>{data.getFullYear() +"년 "+ month + "월 " +data.getDate() +"일"}</p></div>
                                    <div> <p className={style.more} style={{ padding: 21 }}>
                                        <Link to="/admin/notice/list" style={{ color: '#EAEAEA' }} title="전체공지 더보기">더보기</Link>
                                    </p></div>
                                </SwiperSlide>
                            )
                        }
                        )
                    }

                </Swiper>
                </div>
            </div>
       
    );
}

export default Main;