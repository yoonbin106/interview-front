//**adminAdminNoticeRegisterPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import CreatePost from '@/components/adminPage/adminCreatePost';
import styles from '@/styles/adminPage/adminAdminNoticeRegister.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const AdminAdminNoticeRegisterPage = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('공지사항이 등록되었습니다.');
        router.push('/adminPage/adminAdminNoticePage');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['adminAdminNoticeRegisterContainer']}>
                    <h2 className={styles['adminAdminNoticeRegisterTitle']}>관리자 공지사항</h2>
                    <CreatePost />
                    <button type="button" onClick={handleSubmit} className={styles['adminAdminNoticeRegisterSubmitButton']}>등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default AdminAdminNoticeRegisterPage;