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
                <ReportedFinComment />
                
            </div>
        </div>
    );
}