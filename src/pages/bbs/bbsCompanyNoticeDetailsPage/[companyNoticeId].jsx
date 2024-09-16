import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/bbs/bbsPage.module.css';
import NestedList from '@/components/bbs/bbsSidebar';
import axios from 'axios';
import BbsCompanyNoticeDetails from 'components/bbs/bbsCompanyNoticeDetails';

const BbsCompanyNoticeDetailsPage = () => {
    const router = useRouter();
    const { companyNoticeId } = router.query; // 동적 라우트에서 AdminNoticeId 가져오기
    const [bbsCompanyNoticeDetail, setBbsCompanyNoticeDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (companyNoticeId) {
            const fetchCompanyNoticeData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/companynotice/${companyNoticeId}`);
                    setBbsCompanyNoticeDetail(response.data);
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
                {bbsCompanyNoticeDetail && (
                    <BbsCompanyNoticeDetails
                        noticeData={bbsCompanyNoticeDetail}
                    />
                )}
            </div>
        </div>
    );
};

export default BbsCompanyNoticeDetailsPage;