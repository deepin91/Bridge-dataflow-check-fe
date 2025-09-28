import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { useRef } from 'react';
import axios from 'axios';

export default function Portfolio({ match }) {
    // const userId = match.params;
    const userId = "test"
    const editorRef = useRef(null);

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


        </>
    );

}