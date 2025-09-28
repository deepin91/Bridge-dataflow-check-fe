import style from './Doing.module.css'
import '../reset.css';
import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Content from './Content';
import ContentUpdate from './ContentUpdate';
import ContentDetail from './ContentDetail';
import CommentWrite from './CommentWrite';
import Complete from './Complete';
import reply from './reply.png';
import Waveform from '../Component/Waveform';
import ProjectListDelete from './ProjectListDelete';



const Doing = ({ history }) => {

    const [select, setSelect] = useState(false);
    const [userId1, setUserId1] = useState('');
    const [userId2, setUserId2] = useState('');
    const [pdIdx, setPdIdx] = useState('');
    const [uploadClick, setUploadClick] = useState(true);
    const [editClick, setEditClick] = useState('');
    const [commentOpen, setCommentOpen] = useState('');
    const [isClick, setIsClick] = useState(false);
    const [isClick1, setIsClick1] = useState(false);
    const [isClick2, setIsClick2] = useState(false);
    const [progress, setProgress] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [contentList, setContentList] = useState([
        {
            pcNumber: '',
            content: '',
            writer: '',
            pdNumber: '',
            date: '',
            file: '',
            img: '',
            uuid: ''
        }])
    const [listArray, setListArray] = useState([
        {
            pdNumber: '',
            userId1: '',
            userId2: '',
            photo: '',
            tag1: '',
            tag2: '',
            tag3: '',
            progress: ''
        }
    ]);
    const [payList, setPayList] = useState(
        {
            sender: '',
            receiver: '',
            money: '',
            date: '',
            photo: ''
        }
    );
    const [commentList, setCommentList] = useState([{
        pdcNumber: '',
        writer: '',
        content: '',
        img: '',
        pcNumber: ''
    }])

    useEffect(() => {
        console.log(sessionStorage.token);
        if (sessionStorage.getItem('token') == null) {
            history.push('/login')
            return;
        }
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);

        let userId = decode_token.sub;
        setUserId1(userId);
        console.log(decode_token);
        console.log(userId);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/projectList/${decode_token.sub}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                console.log(response);
                setListArray(response.data.map((data) => {
                    const img = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.profileImg}`;
                    return ({
                        pdNumber: data.pdIdx,
                        userId1: data.userId1,
                        userId2: data.userId2,
                        photo: img,
                        tag1: data.userTag1,
                        tag2: data.userTag2,
                        tag3: data.userTag3,
                        progress: data.progress
                    })
                }))
            })
            .catch((error) => {
                console.log(error);
                console.log(userId)
                return;
            })
    }, [isClick2]);

    const [partner, setPartner] = useState('');

    const [index1, setIndex1] = useState('');
    const [pdNumber1, setPdNumber1] = useState('');

    const handlerClickSelect = (index, pdNumber) => {

        setSelect(true);
        setIsClick(false);
        setEditClick('');

        setIndex1(index);
        setPdNumber1(pdNumber);

        setUserId2(partner);
        console.log(userId1);
        console.log(userId2);
        setProgress(listArray[index].progress);
        tagList[0] = listArray[index].tag1;
        tagList[1] = listArray[index].tag2;
        tagList[2] = listArray[index].tag3;

        let partnerLet1;
        if (userId1 == listArray[index].userId1) {
            partnerLet1 = listArray[index].userId2
            setPartner(partnerLet1);
        } else if (userId1 == listArray[index].userId2) {
            partnerLet1 = listArray[index].userId1;
            setPartner(partnerLet1);
        }


        console.log (userId1);
        console.log(partnerLet1);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/paylist/${userId1}/${partnerLet1}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                console.log(response);
                console.log(response.data.profileImg);
                const img = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${response.data.profileImg}`;
                setPayList({
                    sender: response.data.userId1,
                    receiver: response.data.userId2,
                    money: response.data.plMoney,
                    date: response.data.plDate,
                    photo: img
                })
            }).catch((error) => {
                return;
            }
            )

        setPdIdx(pdNumber);
        console.log(pdIdx);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/${pdNumber}`
        )
            .then(response => {
                console.log(response);
                setContentList(response.data.map((data) => {
                    const img = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.profileImg}`;
                    return ({
                        pcNumber: data.pcIdx,
                        content: data.pcContent,
                        writer: data.pcWriter,
                        pdNumber: data.pdIdx,
                        date: data.pcDate,
                        file: data.pcFile,
                        img: img,
                        uuid: data.cmMusic
                    });
                }));
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 시도하세요');
                    history.push('/login');
                }
            });
    }

    const handlerClickUpload = () => {
        setUploadClick(!uploadClick);
    }

    const handlerEditClick = (index) => {

        if (isClick == false) {

            console.log("bbbbbbbbbbbbbbbbbbbbbb")
            setIsClick(true);
            setEditClick(index);
        }

        if (isClick == true) {
            if (editClick !== index) {
                alert("수정 중인 게시글이 있습니다.")
                return;
            }
            console.log("aaaaaaaaaaaaaaaaaaaaaaaa")
            setIsClick(false);
            setEditClick('');
            return;
        }
    }

    const handlerClickComment = (pcIdx, index) => {

        console.log(pcIdx);

        if (isClick1 == false) {
            setCommentOpen(index);
            setIsClick1(true);
        }

        if (isClick1 == true) {
            if (commentOpen != index) {
                alert("펼쳐진 댓글이 있습니다.")
                return;
            }
            else {
                setIsClick1(false);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>")
                setCommentOpen('');
                return;
            }
        }
        CommentSet(pcIdx);

    }
    const CommentSet = (props) => {

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/comment/${props}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                console.log(response);
                setCommentList(response.data.map((data) => {
                    return ({
                        writer: data.userId,
                        content: data.pdcComment,
                        pdcNumber: data.pdcIdx,
                        img: data.profileImg,
                        pcNumber: data.pcIdx
                    })
                })
                )
                console.log(commentList);

            }).catch((error) => {
                return;
            })
    }

    const handlerContentDelete = (pcIdx, index) => {

        console.log(contentList[index].writer);
        if (contentList[index].writer != userId1) {
            alert('작성자만 삭제할 수 있습니다.');
            console.log(userId1);

            return;
        } else {
            axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/delete/${pcIdx}`)
                .then(response => {
                    console.log(response);
                    if (response.data === "Y") {
                        alert('정상적으로 삭제되었습니다.');
                        handlerClickSelect(index1, pdNumber1);
                    } else {
                        alert('삭제에 실패했습니다.');
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert(`삭제에 실패했습니다. (${error.message})`);
                    return;
                });
        }
    }

    const handlerCommentDelete = (pdcIdx, pcIdx, writer) => {

        if (writer != userId1) {
            alert('작성자만 삭제할 수 있습니다.');
            console.log(userId1);

            return;
        } else {
            axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/comment/delete/${pdcIdx}`)
                .then(response => {
                    if (response.data == 1) {
                        alert("정상적으로 삭제되었습니다.");
                        CommentSet(pcIdx);
                    } else {
                        alert("삭제에 실패했습니다.");
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("삭제에 실패했습니다.");
                    return;
                })
        }
    }

 

    const ProjectList = () => {
        console.log(listArray);
        let partnerLet2;
        return (
            <div className={style.list}>
                <div className={style.listTitle}> 작업 목록 </div>
                {listArray && listArray.map((value, index) => {
                    if (userId1 == value.userId1) {
                        partnerLet2 = value.userId2;
                    } else if (userId1 == value.userId2) {
                        partnerLet2 = value.userId1;
                    }
                    return (
                        <>
                            <div key={index} className={style.partnerProfile}>
                                <button onClick={() => handlerClickSelect(index, value.pdNumber)}>
                                    {/* <p className={style.img}> {value.photo}</p> */}
                                    <img className={style.img} src={value.photo}></img>
                                    <div className={style.profileBox}>
                                        <span className={style.nickname}>{partnerLet2}</span>
                                        <span className={style.tag}>
                                            {value.tag1 && '#' + value.tag1}
                                            {value.tag2 && '#' + value.tag2}
                                            {value.tag3 && '#' + value.tag3}
                                        </span>
                                        <ProjectListDelete pdIdx={value.pdNumber} isClick2={isClick2} setIsClick2={setIsClick2} />
                                    </div>
                                </button>
                            </div>
                            {/* {console.log(pdIdx)} */}
                        </>
                    );
                })
                }
            </div>
        );
    };

    const ProjectPage = () => {

        return (
            <>
                <div className={style.payBox}>
                    <div className={style.payDate}> {payList.date} </div>
                    <div className={style.payList}>
                        <img className={style.img} src={payList.photo}></img>
                        <div className={style.sender}>{payList.sender}</div>
                        <div className={style.money}>예치금 {payList.money}원이 결제되었습니다.</div>
                    </div>
                </div>
                {/* {console.log(contentList)} */}

                {contentList && contentList.map((value, index) => {
                    const download = `http://localhost:8080/api/bridge/partnerdetail/download/${value.file}`;
                    return (
                        <div className={style.contentBox}>
                            <div className={style.contentTop}>
                                <div className={style.contentDate}>{value.date}</div>
                                <div className={style.contentEdit}>
                                    <button key={value.pcNumber} onClick={() => handlerEditClick(index)}>{editClick === index ? "수정취소" : "수정"}</button>
                                </div>
                                <div className={style.contentDelete}>
                                    <button onClick={() => handlerContentDelete(value.pcNumber, index)}> 삭제 </button>
                                </div>
                            </div>
                            <div className={style.content}>
                                {/* <div className={style.img}>{value.img}</div> */}
                                <img className={style.img} src={value.img}></img>
                                <div className={style.writer}>{value.writer}</div>
                                <div className={style.main}>{value.content}</div>
                                <div className={style.file}><a href={download}>{value.file}</a></div>
                                <div className={style.commentLetter}>
                                    <button onClick={() => handlerClickComment(value.pcNumber, index)}>{commentOpen === index ? '접기' : '코멘트'}</button>
                                </div>
                                <div className={style.waveForm}>
                                    {value.uuid != null &&
                                        <Waveform
                                            src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getMusic/${value.uuid}`}
                                        />}
                                </div>
                            </div>
                            {editClick === index ? <ContentUpdate pcIdx={value.pcNumber} setEditClick={setEditClick} setIsClick={setIsClick} index1={index1} pdNumber1={pdNumber1} handlerClickSelect={handlerClickSelect} /> : <></>}
                            {commentOpen === index && CommentList()}
                            {commentOpen === index ? <div className={style.commentWriteBox}><CommentWrite pcIdx={value.pcNumber} CommentSet={CommentSet} /></div> : <> </>}
                        </div>
                    )
                }
                )}
            </>
        )
    }

    const CommentList = () => {
        console.log(commentList);
        return (commentList.length != '' ? commentList.map((data) => {
            return (
                <div className={style.comment}>
                    <div className={style.iconBox}><img src={reply} className={style.commentIcon} /></div>
                    <div className={style.img}>{data.img}</div>
                    <div className={style.writer}><p className={style.commentsname}> {data.writer}</p></div>
                    <div className={style.content}>
                        <p> {data.content}</p>
                    </div>
                    <div className={style.delete}>
                        <button onClick={() => handlerCommentDelete(data.pdcNumber, data.pcNumber, data.writer)}>삭제</button>
                    </div>
                </div>
            );
        }) :
            <div className={style.comment}>
                <div className={style.iconBox}><img src={reply} className={style.commentIcon} /></div>
                <div className={style.content}>댓글이 없습니다.</div>
            </div>)
    }


    return (
        select == false ?
            <div className='container clearfix'>
                <div className={style.firstPage}>
                    {ProjectList()}
                </div>
            </div>
            :
            <>
                {ProjectList()}
                <div className='container clearfix' >
                    <div className={style.doing}>
                        <div className={style.doingTitle}> {partner} </div>
                        <div className={style.doingProgress}>{progress == '0' ?
                            <>현재 작업이 <span style={{ fontWeight: 'bold' }}>진행 중</span>입니다. </>
                            :
                            <>완료된 작업입니다.</>}
                        </div>
                        <div className={style.doingTag}>{tagList.map((value, index) => { return (value != null ? '#' + value : null); })}</div>
                        <div>
                            {ProjectPage()}
                            <button className={style.upload} onClick={handlerClickUpload}>{uploadClick ? '업로드' : "업로드 취소"}</button>
                            <div className={style.contentBox}>
                                {uploadClick ? <></> : <Content index1={index1} pdNumber1={pdNumber1} pdIdx={pdIdx} uploadClick={uploadClick} setUploadClick={setUploadClick} handlerClickSelect={handlerClickSelect} />}
                            </div>
                            <Complete pdIdx={pdIdx} setProgress={setProgress} />
                        </div>
                    </div>
                </div>
            </>


    )
}

export default Doing;