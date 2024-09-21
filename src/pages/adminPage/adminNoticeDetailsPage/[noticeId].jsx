import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import axios from 'axios';
import AdminNoticeDetails from 'components/adminPage/adminNoticeDetails';
import {withAdminAuth} from '@/utils/withAdminAuth';

const AdminNoticeDetailsPage = () => {
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
                    <AdminNoticeDetails
                        noticeData={noticeDetail}
                    />
                )}
            </div>
        </div>
    );
};

export default withAdminAuth(AdminNoticeDetailsPage, 'admin');