//adminReportedCommentPage.jsx
import React from 'react';
import ReportedComment from '@/components/adminPage/adminReportedComment';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import { withAdminAuth } from '@/utils/withAdminAuth';

function AdminReportedCommentPage() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <ReportedComment />
            </div>
        </div>
    );
}

export default withAdminAuth(AdminReportedCommentPage);