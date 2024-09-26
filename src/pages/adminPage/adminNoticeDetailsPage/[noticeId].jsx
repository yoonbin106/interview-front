import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import axios from 'axios';
import AdminNoticeDetails from 'components/adminPage/adminNoticeDetails';
import { withAdminAuth } from '@/utils/withAdminAuth';

const AdminNoticeDetailsPage = () => {
    const router = useRouter(); // Next.js 라우터
    const { noticeId } = router.query; // URL에서 noticeId 추출 (동적 라우팅)

    const [noticeDetail, setNoticeDetail] = useState(null); // 공지사항 상세 데이터 저장 상태
    const [loading, setLoading] = useState(true); // 데이터 로딩 상태

    // 공지사항 데이터를 서버에서 가져오는 함수
    useEffect(() => {
        if (noticeId) {
            const fetchNoticeData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/notice/${noticeId}`);
                    setNoticeDetail(response.data); // 공지사항 상세 데이터 설정
                    setLoading(false); // 로딩 완료
                } catch (error) {
                    console.error('Error fetching notice data:', error);
                    setLoading(false); // 에러 발생 시 로딩 종료
                }
            };
            fetchNoticeData();
        }
    }, [noticeId]); // noticeId가 변경될 때마다 데이터 가져오기

    // 로딩 중일 때 로딩 메시지 표시
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* 사이드바 */}
            <div className={styles.sidebar}>
                <NestedList /> {/* 관리자 사이드 메뉴 */}
            </div>

            {/* 공지사항 상세 내용 */}
            <div className={styles.content}>
                {noticeDetail && (
                    <AdminNoticeDetails noticeData={noticeDetail} />
                )}
            </div>
        </div>
    );
};

export default withAdminAuth(AdminNoticeDetailsPage, 'admin'); // 관리자 인증 적용
