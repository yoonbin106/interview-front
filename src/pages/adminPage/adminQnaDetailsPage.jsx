//adminQnaDetailsPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminQnaDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminQnaDetails from '@/components/adminPage/adminQnaDetails'; // 새로 만든 컴포넌트 import
import { Button } from 'react-bootstrap';

const AdminQnaDetailsPage = () => {
    const router = useRouter();

    // 하드코딩된 문의사항 상세 정보
    const qnaDetail = {
        id: 12,
        title: '결제하려는데 계속 오류가 떠요 ㅠㅠ 어떻게 해야 되나요?',
        author: 'user123',
        date: '2024-08-12',
        content: '결제하려고 여러 번 시도했는데 계속 오류 메시지가 떠요. 이 문제를 어떻게 해결할 수 있을까요? 결제가 필요한데 너무 불편합니다.',
        category: '대기', // 초기 카테고리 상태
    };

    // 답변 제출 핸들러
    const handleSubmit = (response, file, category) => {
        // 여기에 API 호출 또는 데이터 저장 로직 추가
        console.log("답변:", response);
        console.log("파일:", file);
        console.log("카테고리:", category);
    };

    // 목록 버튼 클릭 핸들러
    const handleBackToList = () => {
        router.push('/adminPage/adminQnaPage');
    };

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <AdminQnaDetails qnaDetail={qnaDetail} onSubmit={handleSubmit} />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBackToList}
                    className={styles.qnaDetailsBackButton}
                >
                    목록
                </Button>
            </div>
        </div>
    );
};

export default AdminQnaDetailsPage;