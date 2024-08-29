//**adminAdminNoticeRegisterPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminAdminNoticeRegister.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminFaqRegister from 'components/adminPage/adminFaqRegister';

const AdminAdminNoticeRegisterPage = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('FAQ가 등록되었습니다.');
        router.push('/adminPage/adminFaqPage');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['adminAdminNoticeRegisterContainer']}>
                    <AdminFaqRegister />
                </div>
            </div>
        </div>
    );
};

export default AdminAdminNoticeRegisterPage;