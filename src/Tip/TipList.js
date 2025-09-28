import style from './TipList.module.css'
import searchImg from '../Admin-Notice/searchImg.png'
import '../reset.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import guitars from '../img/guitars.jpg'
import Swal from "sweetalert2";

const TipList = () => {
    const history = useHistory();
    const [filteredDatas, setFilteredDatas] = useState([]);
    const [data, setData] = useState([]);



    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            Swal.fire({
                icon: 'error',
                title: '로그인이 필요합니다.',
                text: '로그인 페이지로 이동합니다.',
            })
            history.push('/login');
            return;
        }
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tiplist`)
            .then(r => {
                console.log(">>>>>>>>>>" + r.data);
                // setData(r.data);
                handlerDesc(r.data)
            })
    }, [])

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [value, setValue] = useState([]);

    const [searchInput, setSearchInput] = useState('');

    // 검색 입력창
    const handlerSerchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handlerSerchSubmit = (e) => {
        e.preventDefault();
        const filtered = data.filter(data => {
            console.log(`>${searchInput}<`)
            console.log(data.tbTitle.includes(searchInput))
            return data.tbTitle.includes(searchInput)
        }
        );
        console.log(filtered);
        setFilteredDatas(filtered);
        setPage(1);
    }

    // 내림차순 정렬



    const [heartsList, setHeartsList] = useState([]);
    // useEffect(() => {

    //     axios.get('http://localhost:8080/api/tiplist/heartsList')
    //         .then(response => {
    //             console.log(response);
    //             setData(response.data);
    //             setHeartsList(response.data.tbHeart);
    //         })
    //         .catch(error => console.log(error));

    // }, [])


    // const [heartsList, setHeartsList] = useState([data]);
    // const arr = useState([heartsList]);
    const [temp,setTemp] = useState('')
    const handleHeartClick = (e) => {
        // heartsList.sort((a, b) => b - a);
        // console.log(heartsList);
        // setHeartsList(heartsList);
        e.preventDefault();
        const temp = data.sort((a, b) => { return (b.tbHeart - a.tbHeart) });
        setData([...temp]);
        // setTemp("d");
        console.log(temp);
    };
 
    const handlerDesc = (d) => {
        if(data == ''){
            const temp = d.sort((a, b) => { return (b.tbIdx - a.tbIdx) })
            setData([... temp]);
        }else if(data != ''){
            const temp = data.sort((a, b) => { return (b.tbIdx - a.tbIdx) })
            setData([... temp]);
        }

    }


    // const handleHeartClick = (e) => {
    //     e.preventDefault();
    //     setData(arr);
    // };

    return (
        <>
            <div className={style.box1} >
                <h1>Community</h1>
            </div>
            <div className='container clearfix'>
                <div className={style.topBox}>
                    <div className={style.leftbox}>
                        <button className={style.good} onClick={handleHeartClick}>좋아요순</button>
                        <button className={style.good} onClick={handlerDesc}>최신순</button>

                    </div>

                    <div className={style.rightbox}>

                        <input type="text" className={style.search} value={searchInput} onChange={handlerSerchInput} placeholder="검색어를 입력하세요." />
                        <img type="button" className={style.searchImg} src={searchImg} value="검색" onClick={handlerSerchSubmit} />
                    </div>

                    <div className={style.write}>
                        {/* <button class="custom-btn btn-11" onClick={() => {
                            history.push('/tip/write')
                        }}>작성</button> */}
                        {/* <div className='container clearfix'> */}
                        <button className={style.btn6} onClick={() => {
                            history.push('/tip/write')
                        }}><span>작성</span>
                        </button>
                        {/* </div> */}
                        {/* <button class="custom-btn btn-11">Read More</button> */}
                    </div>
                </div>
                <div className={style.tipbox}>
                    {
                        filteredDatas != "" && filteredDatas.slice(offset, offset + limit).map((data) => {
                            console.log(data.tbIdx)
                            { console.log("++++++++++" + filteredDatas) }
                            return (

                                <Link to={`/tip/detail/${data.tbIdx}`} className={style.list}>
                                    <a className={style.title}>{data.tbTitle}</a>
                                    <a className={style.writer}>{data.userId}</a>
                                    <a className={style.heart}>♡</a>
                                    <a className={style.count}>{data.tbHeart}</a>

                                </Link>
                            )

                        })
                    }


                    {
                        filteredDatas == "" && data && data.slice(offset, offset + limit).map((data) => {

                            return (

                                <Link to={`/tip/detail/${data.tbIdx}`} className={style.list}>
                                    <a className={style.title}>{data.tbTitle}</a>
                                    <a className={style.writer}>{data.userId}</a>
                                    <a className={style.heart}>♡</a>
                                    <a className={style.count}>{data.tbHeart}</a>

                                </Link>
                            )
                        })
                    }
                </div>
                <div className={style.page}>

                    <nav className={style.pageNum} >
                        <button className={style.pageButton} onClick={() => setPage(page - 1)} disabled={page === 1} >
                            &lt;
                        </button>
                        {
                            filteredDatas && Array(Math.ceil(filteredDatas.length / limit)).fill().map((page, i) => (
                                <button className={style.pageButton}
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && Array(Math.ceil(data.length / limit)).fill().map((page, i) => (
                                <button className={style.pageButton}
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && data ?
                                <button className={style.pageButton}
                                    onClick={() => setPage(page + 1)} disabled={page == Math.ceil(data.length / limit)}>
                                    &gt;
                                </button>
                                :
                                <button className={style.pageButton}
                                    onClick={() => setPage(page + 1)} disabled={page == Math.ceil(filteredDatas.length / limit)}>
                                    &gt;
                                </button>
                        }
                    </nav>
                </div>
            </div>

        </>
    )
}

export default TipList;