import { useEffect, useState } from "react";
import axios from "axios";
import style from "../Doing/Content.module.css"
import jwt_decode from "jwt-decode";
import Waveform from "../Component/Waveform";


function Content({ pdIdx, uploadClick, setUploadClick, handlerClickSelect, index1, pdNumber1 }) {

    const [pcContent, setPcContent] = useState('');
    const [pcFile, setPcFile] = useState('');
    const [pdcComment, setPdcComment] = useState('');
    const [pcWriter, setPcWriter] = useState('');
    
    // const [pdIdx, setPdIdx] = useState('');
    const fd = new FormData();

    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    const handlerChangePcFile = e => {
        if (!e.target.files[0]) {
            alert("업로드 불가능한 파일 형식입니다.");
            return;
        } else if (e.target.files[0].size > MAX_FILE_SIZE) {
            alert("파일 크기는 50MB를 초과할 수 없습니다.");
            return;
        }
        setPcFile(e.target.files);
    };

    const handlerChangePcContent = e => setPcContent(e.target.value);
    const handlerChangePdcComment = e => setPdcComment(e.target.value);
    const handlerChangePcWriter = (e) => setPcWriter(e.target.value);

    const handlerSubmit = (e) => {
        e.preventDefault();
        let files = pcFile;
        let formData = new FormData();

        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        let pcWriter = decode_token.sub;

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("Data", new Blob([JSON.stringify({ pcContent, pcWriter, pdIdx })], { type: "application/json" }))
        // formData.append("Data", {PartnerContentDto:{pcContent,pcWriter}})
        console.log(formData)
        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/write/${pdIdx}`,
            headers: { 'Content-Type': 'multipart/form-data;' },
            data: formData
        }).then((response) => {
            console.log("축 성공");
            console.log(response);

            if(response.data.count == 0) {
                alert("등록된 내용이 없습니다.")
            } else {
            alert("업로드가 성공했습니다.")
            setUploadClick(!uploadClick);
            handlerClickSelect(index1, pdNumber1);
            }

        }).catch(() => {
            alert("업로드 중 오류가 발생했습니다.");
        });

   
    };
    return (
        <>
            <div className={style.contentbox}>
                <form onSubmit={handlerSubmit}>
                    
                            <textarea className={style.write} type="text" value={pcContent} onChange={handlerChangePcContent} placeholder="글 내용을 입력해주세요" />
                            
                            <input className={style.file} type="file" id="pcFile" name="a" multiple="multiple" onChange={handlerChangePcFile} placeholder="클릭시 파일을 등록합니다." />
                            {/* <input type="file"  name="profile_files"  multiple="multiple"/> */}
                        {/* <li>
                            댓글:{" "}
                            <input type="text" value={pdcComment} onChange={handlerChangePdcComment} />
                        </li> */}
                        {/* <li>
                            작성자:{" "}
                            <input type="text" value={pcWriter} onChange={handlerChangePcWriter} />
                        </li> */}
                    <button className={style.done} type="submit">등록</button>
                </form>
            </div>
        </>
    )
}


export default Content;