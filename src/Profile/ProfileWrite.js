import style from '../Profile/ProfileWrite.module.css';
import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import Swal from "sweetalert2";

const ProfileWrite = () => {
    const editorRef = useRef(null);
    const history = useHistory();

    const [userId, setUserId] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [userSite, setUserSite] = useState('');
    const [profileImg, setProfileImg] = useState([]);
    const [select, setSelect] = useState('');
    const [music, setMusic] = useState([]);
    const [selectedInstruments, setSelectedInstruments] = useState([]);

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
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
    }, [select]);

    // 파일 크기 및 개수 제한
    const MAX_FILE_COUNT = 1;

    const isNotValid = (msg) => {
        Swal.fire({
            icon: 'error',
            title: '다시 시도해주세요.',
            text: msg
        })
        profileImg.current.value = '';
        setProfileImg([]);
    };

    const handleProfile = (e) => {
        const files = e.target.files;
        if (files.length > MAX_FILE_COUNT) {
            isNotValid("이미지는 최대 1개 까지 업로드가 가능합니다.");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image/.*")) {
                isNotValid("이미지 파일만 업로드 가능합니다.");
                return;
            }
        }
        setProfileImg([...files]);
    };

    const handleIntroduction = (e) => {
        setIntroduction(e.target.value);
    };

    const handleSite = (e) => {
        setUserSite(e.target.value);
    };

    const handleSelect = (e) => {
        setSelect(e.target.value);
    };

    const handlerInstrument = (e) => {
        const instrument = e.target.value;
        if (selectedInstruments.includes(instrument)) {
            setSelectedInstruments(selectedInstruments.filter((item) => item !== instrument));
        } else {
            if (selectedInstruments.length < 3) {
                setSelectedInstruments([...selectedInstruments, instrument]);
            }
        }
    };

    const handleSubmit = () => {
        let datas = {
            userId,
            userSite,
            userIntroduction: introduction,
            userPosition: select,
            userPortfolio: editorRef.current.getInstance().getHTML()
        };
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(datas)], { type: 'application/json' }));
        formData.append('tag', new Blob([JSON.stringify({ tags: selectedInstruments })], { type: 'application/json' }));
        Object.values(profileImg).forEach((file) => formData.append('files', file));
        Object.values(music).forEach((file) => formData.append('music', file));

        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertProfile/${userId}`,
            headers: { 'Content-Type': 'multipart/form-data;' },
            data: formData
        })
            .then((response) => {
                console.log(response);
                Swal.fire(
                    'Success!',
                    '업로드가 정상적으로 완료되었습니다.',
                    'success'
                )
                history.push(`/profile/detail`);
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: '업로드 중 오류가 발생했습니다.',
                    text: '다시 시도해주세요.'
                })
            });
    };

    return (
        <>
            <div className='container clearfix'>
                <h1 className={style.login}>프로필 편집</h1>
                <div className={style.button}>
                    <div style={{ marginBottom: '10px' }}>프로필 사진을 첨부해주세요</div>
                    <input
                        type='file'
                        className={style.signupinput}
                        onChange={handleProfile}
                        ref={profileImg}
                        multiple
                        accept='image/*'
                        placeholder='프로필 사진을 첨부해주세요.'
                    />
                </div>

                <div className={style.button}>
                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>프로필 음악을 첨부해주세요</div>
                    <input
                        type='file'
                        className={style.signupinput}
                        onChange={(e) => {
                            setMusic(e.target.files);
                        }}
                        multiple
                        placeholder='프로필 음악을 첨부해주세요.'
                    />
                    {console.log("music--->" + music)}
                </div>

                <div className={style.button}>
                    <select className={style.signupinput} onChange={handleSelect}>
                        <option value='' disabled selected>
                            포지션 선택
                        </option>
                        <option value='작곡가'>작곡가</option>
                        <option value='연주자'>연주자</option>
                        <option value='작곡가 겸 연주자'>작곡가 겸 연주자</option>
                    </select>
                </div>

                <div className={style.button}>
                    <input className={style.signupinput} value={userSite} onChange={handleSite} placeholder='본인을 소개할 수 있는 링크를 입력해주세요.' />
                </div>

                <div className={style.button}>
                    <input className={style.signupinput} value={introduction} onChange={handleIntroduction} placeholder='한줄소개를 입력해주세요.' />
                </div>

                <div className={style.button}>
                    <select className={style.signupinput} onChange={handlerInstrument}>
                        <option value='' disabled selected>
                            악기 선택 &#40; 3개까지 가능 &#41;
                        </option>
                        <option value='성악'>성악</option>
                        <option value='보컬'>보컬</option>
                        <option value='바이올린'>바이올린</option>
                        <option value='베이스'>베이스</option>
                        <option value='일렉 기타'>일렉 기타</option>
                        <option value='어쿠스틱 기타'>어쿠스틱 기타</option>
                        <option value='드럼'>드럼</option>
                        <option value='브라스'>브라스</option>
                        <option value='건반'>건반</option>
                        <option value='첼로'>첼로</option>
                        <option value='콘트라베이스'>콘트라베이스</option>
                        <option value='신디사이저'>신디사이저</option>
                    </select>
                </div>

                <div className={style.button} style={{ marginTop: '10px', paddingBottom: '20px' }}>
                    <div>
                        {selectedInstruments.map((instrument) => (
                            <span
                                key={instrument}
                                style={{ marginLeft: '5px', padding: '2px 5px', borderRadius: '5px', background: 'lightblue', cursor: 'pointer' }}
                                onClick={() => setSelectedInstruments(selectedInstruments.filter((item) => item !== instrument))}
                            >
                                {instrument}
                            </span>
                        ))}
                    </div>
                </div>

                <Editor
                    previewStyle='vertical'
                    height='300px'
                    initialEditType='wysiwyg'
                    useCommandShortcut={true}
                    plugins={[colorSyntax]}
                    ref={editorRef}
                />

                <div className={style.button}>
                    <button className={style.signupbtn} onClick={handleSubmit}>
                        등록
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileWrite;