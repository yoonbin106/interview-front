// adminDeletedCommentPage.jsx


import React from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import DeletedComment from 'components/adminPage/adminDeletedComment';

export default function AdminDeletedCommentPage() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
            <h2 className={styles.title}>삭제된 댓글 목록</h2>
                <DeletedComment />
                
            </div>
        </div>
    );
}