import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/bbs/bbsPage.module.css';
import NestedList from '@/components/bbs/bbsSidebar';
import axios from 'axios';
import BbsNoticeDetails from 'components/bbs/bbsNoticeDetails';

const BbsNoticeDetailsPage = () => {
    const router = useRouter();
    const { noticeId } = router.query; // 동적 라우트에서 NoticeId 가져오기
    const [noticeDetail, setNoticeDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (noticeId) {
            const fetchNoticeData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/notice/${noticeId}`);
                    setNoticeDetail(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching notice data:', error);
                    setLoading(false);
                }
            };
            fetchNoticeData();
        }
    }, [noticeId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                {noticeDetail && (
                    <BbsNoticeDetails
                        noticeData={noticeDetail}
                    />
                )}
            </div>
        </div>
    );
};

export default BbsNoticeDetailsPage;