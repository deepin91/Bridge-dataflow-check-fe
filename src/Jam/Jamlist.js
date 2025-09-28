
import style from './JamList.module.css'
import searchImg from '../Admin-Notice/searchImg.png'
import '../reset.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Swal from "sweetalert2";

const JamList = () => {

    const [data, setData] = useState([]);

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
        // const decode_token = jwt_decode(token);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/jam`)
            .then(r => {
                setData(r.data);
                console.log(r.data);
            })
    }, [])


    const [searchInput, setSearchInput] = useState('');
    const [filteredDatas, setFilteredDatas] = useState([]);

    const [limit, setLimit] = useState(8);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [value, setValue] = useState([]);


    const handlerSerchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handlerSerchSubmit = (e) => {
        e.preventDefault();
        const filtered = data.filter(data => {
            console.log(`>${searchInput}<`)
            console.log(data.ctitle.includes(searchInput))
            return data.ctitle.includes(searchInput)
        });
        console.log(filtered);
        setFilteredDatas(filtered);
        setPage(1);
    }



    return (
        <>
            <div className={style.box1}>
                <h1>Make Music</h1>
            </div>
            <div className='container clearfix'>

                <form onSubmit={handlerSerchSubmit}>
                    <div className={style.serchbox}>
                        <img type="button" className={style.searchImg} src={searchImg} value="검색" onClick={handlerSerchSubmit} />
                        <input type="text" className={style.search} value={searchInput} onChange={handlerSerchInput} placeholder="검색어를 입력하세요" />
                    </div>
                </form>
                <div className={style.pbox}>
                    <Link to="/jam/write"><input type="button" className={style.playbutton} value="글쓰기" /></Link>
                </div>
                <div className='clearfix' style={{ margin: "50px 0" }}>
                    {
                        filteredDatas != "" && filteredDatas.slice(offset, offset + limit).map((data) => {
                            return (
                                <div className={style.block}>
                                    <Link to={`/jam/detail/${data.cidx}`}>
                                        <div className={style.imgbox}>
                                            <img className={style.img} src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.cphoto}`}></img>
                                        </div>
                                        <p className={style.title}>{data.ctitle}</p>
                                    </Link>
                                </div>
                            );
                        })
                    }


                    {
                        filteredDatas == "" && data && data.slice(offset, offset + limit).map((data) => {

                            return (

                                <div className={style.block}>
                                    <Link to={`/jam/detail/${data.cidx}`}>
                                        <div className={style.imgbox}>
                                            <img className={style.img} src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.cphoto}`}></img>
                                        </div>
                                        <p className={style.title}>{data.ctitle}</p>
                                    </Link>
                                </div>
                            )
                        })
                    }



                </div>

                <div className={style.page}>

                    <nav className={style.pageNum} >
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
            </div >
        </>
    );
}
export default JamList;