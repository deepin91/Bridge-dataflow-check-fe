import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { useRef } from 'react';
import axios from 'axios';
import style from '../Admin-Notice/NoticeWrite.module.css'

import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const ToastEditor = ({title}) => {


    const history = useHistory();
    const editorRef = useRef(null);

    // const [title, setTitle] = useState('');
 

    // const handlerChangeContents = e => setContents(e.target.value);
    const save = () => {
        const files = editorRef.current.getInstance().getHTML();
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice/write`,
        { title, 'contents':files },  {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}}
        )              // 요청 본문을 통해서 서버로 전달할 값
            .then(response => {
                console.log(response);                             // 수정 결과에 대한 메시지 처리
                    alert(response.data);
                    history.push('/admin/notice/list');
            })
            .catch(error => {
                console.log(error);						// 200번대를 제외한 응답코드가 반환되는 경우
                console.log(error);
                alert(`작성에 실패했습니다. (${error.message})`);
                return;
            });

    };
    return (
        <>
    
             <Editor
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

            <button className={style.btn} onClick={save}>작성</button>

        </>
    )
};

export default ToastEditor;
