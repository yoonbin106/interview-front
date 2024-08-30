//adminQnaDetailsPage.jsx

import React,{useEffect,useState} from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminQnaDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminQnaDetails from '@/components/adminPage/adminQnaDetails'; // 새로 만든 컴포넌트 import
import { Button } from 'react-bootstrap';
import axios from 'axios';

const AdminQnaDetailsPage = () => {
    const router = useRouter();
    const { qnaId } = router.query; // URL에서 qnaId를 가져온다
    
    const [qnaDetail, setQnaDetail] = useState(null); // QnA 상세 정보를 저장할 상태
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                if (!qnaId) {
                    console.log('qnaId is undefined, waiting for it to be defined...');
                    return;
                }

                console.log('Fetching QnA details for ID:', qnaId);
                const response = await axios.get(`http://localhost:8080/api/qna/${qnaId}`);
                setQnaDetail(response.data);
                setLoading(false); // 데이터를 가져오면 로딩 멈추기
            } catch (error) {
                console.error('Error fetching QnA details:', error);
                setLoading(false);
            }
        };

        fetchQnaDetail(); // qnaId가 있을 때만 데이터를 가져옴
    }, [qnaId]);

    if (loading) {
        return <div>Loading...</div>;
    }


    // 목록 버튼 클릭 핸들러
    const handleBackToList = () => {
        router.push('/adminPage/adminQnaPage');
    };


    if (!qnaDetail) {
        return <p>QnA 상세 정보를 불러올 수 없습니다.</p>; // QnA 상세 정보를 불러오지 못했을 때 표시할 메시지
    }

   return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <AdminQnaDetails qnaDetail={qnaDetail} /> {/* qnaDetail을 전달합니다 */}
            </div>
        </div>
    );
};

export default AdminQnaDetailsPage;