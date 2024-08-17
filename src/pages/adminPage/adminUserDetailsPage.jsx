//**adminUserDetailsPage.jsx
import React from 'react';
import UserDetails from '@/components/adminPage/adminUserDetails';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminUserDetails(){
return (
    <div className={styles.container}>
        <div className={styles.sidebar}>
            <NestedList/>
        </div>
        <div className={styles.content}>
            <UserDetails />
        </div>
    </div>
    );
}