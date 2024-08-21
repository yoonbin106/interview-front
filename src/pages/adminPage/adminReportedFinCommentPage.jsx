//adminReportedFinCommentPage.jsx
import React from 'react';
import ReportedFinComment from '@/components/adminPage/adminReportedFinComment';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminReportedFinCommentPage() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
            <h2 className={styles.title}>신고처리 완료된 댓글 목록</h2>
                <ReportedFinComment />
                
            </div>
        </div>
    );
}