import style from '../Partner/PartnerList.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from "sweetalert2";

const PartnerList = () => {
  const [partnerList, setPartnerList] = useState([]);
  const [partnerTag, setPartnerTag] = useState([]);
  const [tag, setTag] = useState('');
  const history = useHistory();

  //페이징
  // const [limit, setLimit] = useState(10);
  // const [page, setPage] = useState(1);
  // const offset = (page - 1) * limit;


  const tags = [
    { name: '여성보컬' },
    { name: '남성보컬' },
    { name: '일렉기타' },
    { name: '어쿠스틱기타' },
    { name: '베이스기타' },
    { name: '드럼' },
    { name: '퍼커션' },
    { name: '브라스' },
    { name: '바이올린' },
    { name: '첼로' },
    { name: '콘트라베이스' },
    { name: '피아노' },
    { name: '신디사이저' }
  ];

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
    axios
      .get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/openPartnerList`)
      .then((response) => {
        console.log(response.data);
        setPartnerList(response.data.partnerList);
        axios
          .get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/openTagList`)
          .then((response) => {
            setPartnerTag(response.data.partnerTag);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleRadio = (e) => {
    setTag(e.target.value);
  };

  const clearRadio = () => {
    setTag('');
  };


  return (
    <>
      <div className={style.box1}>
        <h1>Commission</h1>
      </div>
      <div className="container clearfix" >
        <div className={style.tagbox}>

          {tags.map((tags, index) => {
            if (index % 5 == 0) {
              return (<>   <label className={style.tags} for={`tagRadio-${index}`}>
                <button
                  key={index}
                  className={style.taglists}
                  id={`tagRadio-${index}`}
                  value={tags.name}
                  onClick={handleRadio}
                />
                #{tags.name}</label></>)
            }
            return (
              <label className={style.tags} for={`tagRadio-${index}`}>
                <button
                  key={index}
                  className={style.taglists}
                  id={`tagRadio-${index}`}
                  value={tags.name}
                  onClick={handleRadio}
                />
                #{tags.name}</label>
            );
          })}
          <button className={style.tags} onClick={clearRadio}>#전체</button>
        </div>
        <div className="clearfix" style={{ margin: '50px 0' }}>
          {
            partnerList && partnerList
              .filter((partnerList) => (tag === '') || partnerTag.some((partnerTag) => partnerList.crIdx == partnerTag.crIdx && partnerTag.crtTag == tag))
              .map((partnerList, index) => {
                return (
                  <div key={index} className={style.block}>
                    <div className={style.imgbox}>
                      <Link to={`/partner/detail/${partnerList.crIdx}`}><img className={style.img} src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${partnerList.crPhoto}`} alt="" /></Link>
                    </div>
                    <Link to={`/partner/detail/${partnerList.crIdx}`}><p className={style.title}>{partnerList.crTitle}</p></Link>
                    <p className={style.date}>
                      {partnerList.crStartDate} ~ {partnerList.crEndDate}
                    </p>
                    <div className={style.tagblock}>
                      {partnerTag
                        .filter((tag) => partnerList.crIdx === tag.crIdx)
                        .map((tag, tagIndex) => {
                          if (tagIndex % 3 == 0) {
                            return (<><br /><span className={style.tag} key={tagIndex}>#{tag.crtTag} </span> </>)
                          }
                          return (<span className={style.tag} key={tagIndex}>#{tag.crtTag} </span>);
                        }
                        )}
                    </div>
                  </div>
                );
              })}
        </div>

        <div className={style.buttonbox}>
          <Link to={`/partner/write`}><button > Request </button></Link>
        </div>

        {/* <div className={style.page}>
          <nav className="pageNum" >
            <button onClick={() => setPage(page - 1)} disabled={page === 1} >
              &lt;
            </button>
            {
              partnerList && Array(Math.ceil(partnerList.length / limit)).fill().map((page, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  aria-current={page === i + 1 ? "page" : null}
                >
                  {i + 1}
                </button>
              ))}
                      <button onClick={() => setPage(page + 1)} disabled={page == Math.ceil(partnerList.length / limit)}>
                                    &gt;
                                </button>
          </nav>
        </div> */}
      </div>
    </>
  );
};

export default PartnerList;