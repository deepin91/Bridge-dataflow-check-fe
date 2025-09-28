import axios from "axios";

const ProjectListDelete = ({ pdIdx, isClick2, setIsClick2 }) => {

    const hanlderProjectListDelete = () => {

    const result = window.confirm("정말 작업 목록을 삭제하실 건가요?");

    if (result) {
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/projectList/delete/${pdIdx}`)
            .then(response => {
                alert("작업 목록 삭제");
                window.location.reload();
                // setIsClick2(!isClick2);        
            })
            .catch(error => {
                return;
            })
    }
}


    return (
        <>
            <button onClick={hanlderProjectListDelete}>삭제</button>
        </>
    );
}

export default ProjectListDelete;