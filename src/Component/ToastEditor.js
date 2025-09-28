import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { useRef } from 'react';
import axios from 'axios';
import style from '../Admin-Notice/NoticeWrite.module.css'
import { useHistory } from 'react-router';
import jwtDecode from 'jwt-decode';

const ToastEditor = ({ title, data }) => {

    const editorRef = useRef(null);

    const history = useHistory();

    const handler = (e) => {
        e.preventDefault();
        console.log("assasasassasasa");
        console.log(data);
        // editorRef.current.getInstance().setHTML(data);
    }
    const submit = (e) => {
        e.preventDefault();
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
        }
        const token = sessionStorage.getItem('token')
        const decode = jwtDecode(token);

        const files = editorRef.current.getInstance().getHTML();
        console.log(files);
        console.log(typeof (title))
        if (!data) {
            if (title.length >= 100) {
                alert(`제목의 글자수가 100자를 초과했습니다. \n 다시 작성해주세요.`);
            } else {
                axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/inserttip`,
                    { "tbTitle": title, "tbContents": files },
                    { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
                )
                    .then(response => {
                        alert("정상처리 되었습니다.");
                        history.push(`/tip/list`);
                    })
                    .catch(error => {
                        console.log(error)
                        alert("오류가 발생하였습니다.");
                    })
            }
        } else if (data) {
            if (decode.sub == data.userId || decode.sub == 'admin') {
                if (title.length >= 100) {
                    alert(`제목의 글자수가 100자를 초과했습니다. \n 다시 작성해주세요.`);
                }
                axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/update/tip`, { "tbTitle": title, "tbContents": files, "tbIdx": data.tbIdx },
                ).then(() => {
                    alert("정상 처리 되었습니다.");
                    history.push(`/tip/list`);
                }).catch(() => {
                    alert("오류가 발생하였습니다.");
                })
            } else {
                alert('작성자만 수정 가능합니다.');
                history.push('/tip/list')
            }
        }

    }
    return (
        <>
            {
                !data && <Editor
                    ref={editorRef}
                    // 미리보기 스타일 지정
                    previewStyle="vertical"
                    // 에디터 창 높이
                    height="500px"
                    //초기 입력모드 설정
                    initialEditType="wysiwyg"
                    //입력모드 변경 안보이게
                    hideModeSwitch={true}
                    //단축키 사용 여부
                    useCommandShortcut={true}
                    //글자색 변경 플러그인
                    plugins={[colorSyntax]}
                />

            }
            {
                data && <Editor
                    ref={editorRef}
                    // 미리보기 스타일 지정
                    previewStyle="vertical"
                    // 에디터 창 높이
                    height="500px"
                    //초기 입력모드 설정
                    initialEditType="wysiwyg"
                    //입력모드 변경 안보이게
                    hideModeSwitch={true}
                    //단축키 사용 여부
                    useCommandShortcut={true}
                    //글자색 변경 플러그인
                    plugins={[colorSyntax]}

                    initialValue={data.tbContents}
                />
            }


            {/* <button onClick={showContent}>작성</button> */}
            <button className={style.btn} onClick={submit}>작성</button>

        </>
    )
};

export default ToastEditor;
