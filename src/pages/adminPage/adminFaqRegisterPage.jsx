//**adminFaqRegisterPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import FaqRegister from 'components/adminPage/adminFaqRegister';
import styles from '@/styles/adminPage/adminFaqRegister.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const AdminFaqRegisterPage = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('자주 묻는 질문이 등록되었습니다');
        router.push('/adminPage/adminFaqPage');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['faqPostNoticeRegisterContainer']}>
                    <FaqRegister />
                </div>
            </div>
        </div>
    );
};

export default AdminFaqRegisterPage;