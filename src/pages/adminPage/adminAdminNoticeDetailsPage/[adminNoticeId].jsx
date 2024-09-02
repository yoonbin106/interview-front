import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import axios from 'axios';
import AdminAdminNoticeDetails from 'components/adminPage/adminAdminNoticeDetails';

const AdminAdminNoticeDetailsPage = () => {
    const router = useRouter();
    const { adminNoticeId } = router.query; // 동적 라우트에서 AdminNoticeId 가져오기
    const [adminNoticeDetail, setAdminNoticeDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (adminNoticeId) {
            const fetchNoticeData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/adminnotice/${adminNoticeId}`);
                    setAdminNoticeDetail(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching notice data:', error);
                    setLoading(false);
                }
            };
            fetchNoticeData();
        }
    }, [adminNoticeId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                {adminNoticeDetail && (
                    <AdminAdminNoticeDetails
                        noticeData={adminNoticeDetail}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminAdminNoticeDetailsPage;