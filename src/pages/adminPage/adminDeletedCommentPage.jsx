// adminDeletedCommentPage.jsx


import React from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import DeletedComment from 'components/adminPage/adminDeletedComment';
import { withAdminAuth } from '@/utils/withAdminAuth';

 function AdminDeletedCommentPage() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <DeletedComment />
                
            </div>
        </div>
    );
}
export default withAdminAuth(AdminDeletedCommentPage);