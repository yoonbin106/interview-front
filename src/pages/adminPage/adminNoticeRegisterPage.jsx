//**adminNoticeRegisterPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminNoticeRegister.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminNoticeRegister from 'components/adminPage/adminNoticeRegister';

const AdminNoticeRegisterPage = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('공지사항이 등록되었습니다.');
        router.push('/adminPage/adminNoticePage');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['adminNoticeRegisterContainer']}>
                    <h2 className={styles['adminNoticeRegisterTitle']}>전체 공지사항</h2>
                    <AdminNoticeRegister />
                </div>
            </div>
        </div>
    );
};

export default AdminNoticeRegisterPage;