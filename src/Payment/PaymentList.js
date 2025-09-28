import style from '../Administrator/DealListAd.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import searchImg from '../Tip/searchImg.png';
import Swal from "sweetalert2";

const PaymentList = ({ match }) => {
    const [userId, setUserId] = useState('');
    const [data, setData] = useState([]);
    const [filteredDatas, setFilteredDatas] = useState([]);
    let [currentDate, setCurrentDate] = useState('');
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const history = useHistory();

    const [limit, setLimit] = useState(8);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;

    const hadleSearchInput = (e) => { setSearchInput(e.target.value) }
    const handleDate1 = (e) => { setDate1(e.target.value) }
    const handleDate2 = (e) => { setDate2(e.target.value) }

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

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/payList/${decode_token.sub}`)
            .then(res => {
                setData(res.data);
                setCurrentDate(new Date());
            })
            .catch(err => {
                console.log(err);
            })
    }, [userId]);

    const handleAll = (e) => {
        e.preventDefault();
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/payList/${userId}`)
            .then(res => {
                setData(res.data);
                setFilteredDatas(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleDeal = (e) => {
        e.preventDefault();
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/pay/deal/${userId}`)
            .then(res => {
                setData(res.data);
                setFilteredDatas(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    };

    const handleCharge = (e) => {
        e.preventDefault();
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/pay/charge/${userId}`)
            .then(res => {
                setData(res.data);
                setFilteredDatas(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    };

    const handle3Month = (e) => {
        e.preventDefault();

        const month2 = currentDate.getMonth() + 1;
        const ago6 = month2 - 3;

        const ago = ago6 < 10 ? '0' + ago6.toString() : ago6.toString()
        const now = month2 < 10 ? '0' + month2.toString() : month2.toString()

        const day = currentDate.getDate();
        const date = day < 10 ? '0' + day.toString() : day.toString()


        setDate1(currentDate.getFullYear() + "-" + ago + "-" + date);
        setDate2(currentDate.getFullYear() + "-" + now + "-" + date);
    };


    const handle6Month = (e) => {
        e.preventDefault();

        const month2 = currentDate.getMonth() + 1;
        const ago6 = (month2 - 6);
        // console.log(">>>>>>>>" + ago6);

        const ago = ago6 < 10 ? '0' + ago6.toString() : ago6.toString()
        const now = month2 < 10 ? '0' + month2.toString() : month2.toString()

        const ago2 = ago <= 0 ? "12" : ago

        const day = currentDate.getDate();
        const date = day < 10 ? '0' + day.toString() : day.toString()


        setDate1(currentDate.getFullYear() + "-" + ago2 + "-" + date);
        setDate2(currentDate.getFullYear() + "-" + now + "-" + date);
        console.log(date1);
    }


    const handleSearch = (e) => {
        e.preventDefault();
        const firstdate = new Date(date1);
        const seconddate = new Date(date2);

        setFilteredDatas(data.filter(d => {
            const number = new Date(d.plDate);
            return (
                date1 == "" && date2 == "" && d.userId1.includes(searchInput) ||
                date1 == "" && date2 == "" && d.userId2.includes(searchInput) ||
                number >= firstdate && number <= seconddate && d.userId1.includes(searchInput) ||
                number >= firstdate && number <= seconddate && d.userId2.includes(searchInput)
            )
        }
        ))
    }

    return (
        <>
            <div className='container clearfix'>
                <div className={style.mainBox}>
                    <h1 className={style.mainText}>포인트 내역 조회</h1>
                    <div className={style.dealDate}>
                        <p>거래 일자</p>
                        <input className={style.dealInput1} type='date' value={date1} onChange={handleDate1} /> - <input type='date' className={style.dealInput2} value={date2} onChange={handleDate2}></input>
                        <button className={style.dealButton1} onClick={handle3Month}>3개월</button>
                        <button className={style.dealButton2} onClick={handle6Month}>6개월</button>
                    </div>
                    <div className={style.search}>
                        <p>검색하기</p> <input type='text' value={searchInput} onChange={hadleSearchInput} className={style.searchInput} ></input>
                        <button type='button' onClick={handleSearch}><img src={searchImg} className={style.searchImg} /></button>
                    </div>
                    <div className={style.buttonBox}>
                        <button onClick={handleAll} className={style.initButton}>전체내역</button>
                        <button onClick={handleDeal} className={style.initButton}>거래내역</button>
                        <button onClick={handleCharge} className={style.searchButton}>충전내역</button>
                    </div>
                    <div className={style.contentBox}>
                        <div className={style.tableText}>{filteredDatas == "" ? <p>총 {data.length}건 </p> : <p> 총 {filteredDatas.length} 건 </p>} </div>
                        <table>
                            <colgroup className={style.tableCol}>
                                <col width="30%" />
                                <col width="22%" />
                                <col width="22%" />
                                <col width="26%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope='col'>거래일자</th>
                                    <th scope='col'>주는사람</th>
                                    <th scope='col'>받는사람</th>
                                    <th scope='col'>금액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredDatas == "" && data.slice(offset, offset + limit).map((data) => {
                                        return (
                                            <tr>
                                                <td>{data.plDate}</td>
                                                <td>{data.userId1}</td>
                                                <td>{data.userId2}</td>
                                                <td>{data.plMoney}</td>
                                            </tr>
                                        )
                                    })
                                }

                                {
                                    filteredDatas != "" && filteredDatas.slice(offset, offset + limit).map((data) => {
                                        return (
                                            <tr>
                                                <td>{data.plDate}</td>
                                                <td>{data.userId1}</td>
                                                <td>{data.userId2}</td>
                                                <td>{data.plMoney}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className={style.page}>

                        <nav className="pageNum" >
                            <button onClick={() => setPage(page - 1)} disabled={page === 1} >
                                &lt;
                            </button>
                            {
                                filteredDatas && Array(Math.ceil(filteredDatas.length / limit)).fill().map((page, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        aria-current={page === i + 1 ? "page" : null}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                            {
                                filteredDatas == "" && Array(Math.ceil(data.length / limit)).fill().map((page, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        aria-current={page === i + 1 ? "page" : null}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                            {
                                filteredDatas == "" && data ?
                                    <button onClick={() => setPage(page + 1)} disabled={page == Math.ceil(data.length / limit)}>
                                        &gt;
                                    </button>
                                    :
                                    <button onClick={() => setPage(page + 1)} disabled={page == Math.ceil(filteredDatas.length / limit)}>
                                        &gt;
                                    </button>
                            }
                        </nav>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PaymentList;
