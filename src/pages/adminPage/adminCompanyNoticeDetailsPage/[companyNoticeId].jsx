import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import axios from 'axios';
import AdminCompanyNoticeDetails from 'components/adminPage/adminCompanyNoticeDetails';

const AdminCompanyNoticeDetailsPage = () => {
    const router = useRouter();
    const { companyNoticeId } = router.query; // 동적 라우트에서 AdminNoticeId 가져오기
    const [adminCompanyNoticeDetail, setAdminCompanyNoticeDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (companyNoticeId) {
            const fetchCompanyNoticeData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/companynotice/${companyNoticeId}`);
                    setAdminCompanyNoticeDetail(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching notice data:', error);
                    setLoading(false);
                }
            };
            fetchCompanyNoticeData();
        }
    }, [companyNoticeId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                {adminCompanyNoticeDetail && (
                    <AdminCompanyNoticeDetails
                        noticeData={adminCompanyNoticeDetail}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminCompanyNoticeDetailsPage;