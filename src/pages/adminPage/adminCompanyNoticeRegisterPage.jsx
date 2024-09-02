//**adminCompanyNoticeRegisterPage.jsx


import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminCompanyNoticeRegister.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminCompanyNoticeRegister from 'components/adminPage/adminCompanyNoticeRegister';

const AdminCompanyNoticeRegisterPage = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('공지사항이 등록되었습니다.');
        router.push('/adminPage/adminCompanyNoticePage');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['adminCompanyNoticeRegisterContainer']}>
                    <h2 className={styles['adminCompanyNoticeRegisterTitle']}>기업별 공지사항</h2>
                    <AdminCompanyNoticeRegister />
                    <button type="button" onClick={handleSubmit} className={styles['adminCompanyNoticeRegisterSubmitButton']}>등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default AdminCompanyNoticeRegisterPage;