import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const ContentDetail = ({pcIdx}) => {

    const [detailList, setDetailList] = useState({
        pcNumber: '',
        content: '',
        writer: '',
        pdNumber: '',
        file : ''
    });

    useEffect(()=> {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/bridge/partnerdetail/content/${pcIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
            .then((response)=> {
                console.log (response);
                setDetailList({
                    pcNumber: response.data.pcIdx,
                    pdNumber : response.data.pdIdx,
                    content: response.data.pcContent,
                    date : response.data.pcDate,
                    file: response.data.pcFile,
                    writer: response.data.pcWriter
                })

            })
            .catch((error) => {

            })
    },[])

    return (
        <>
            {detailList.pcNumber},
            {detailList.pdNumber},
            {detailList.content},
            {detailList.date},
            {detailList.file},
            {detailList.writer}
        </>
    );
}
export default ContentDetail;