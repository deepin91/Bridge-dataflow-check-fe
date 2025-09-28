import { useEffect, useState } from 'react';
import style from '../Doing/Review.module.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from "sweetalert2";
import axios from 'axios';

const Review = ({ match }) => {

    const { userId2 } = match.params;
    const history = useHistory();
    const [content, setContent] = useState('');

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
    }, [])

    const handleSubmit = () => {
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertReview/${userId2}`, { content })
            .then((r) => {
                Swal.fire(
                    'Success!',
                    '후기가 정상적으로 작성 되었습니다.',
                    'success'
                );
                history.push(`/profile/detail/${userId2}`);
            })
            .catch((e) => { console.log(e) })
    }

    return (
        <>
            <div className='container clearfix' >
                <div className={style.box1}>
                    <h1>리뷰 작성</h1>
                    <h3> {userId2} 님과 함께한 작업이 어땠는지 후기를 적어주세요.</h3>
                </div>
                <div className={style.review}>
                    <textarea value={content} onChange={(e) => { setContent(e.target.value) }} className={style.reviewtext} />
                </div>
                <div className={style.btn}>
                    <input type="button" onClick={handleSubmit} className={style.reviewbtn} value="작성" placeholder='500자 이내로 해당 유저의 리뷰를 작성해주세요.' />
                </div>
            </div>

        </>
    )

}

export default Review;