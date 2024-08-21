//adminRefundPage.jsx

import React from 'react';
import AdminRefund from '@/components/adminPage/adminRefund';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminPage.module.css';

export default function AdminRefundPage() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <AdminRefund />
            </div>
        </div>
    );
}