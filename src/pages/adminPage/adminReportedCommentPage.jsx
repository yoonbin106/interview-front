//adminReportedCommentPage.jsx
import React from 'react';
import ReportedComment from '@/components/adminPage/adminReportedComment';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminReportedCommentPage() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
            <h2 className={styles.title}>신고된 댓글 목록</h2>
                <ReportedComment />
                
            </div>
        </div>
    );
}