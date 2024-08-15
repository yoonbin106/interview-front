//adminAdminNoticeRegisterPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import CreatePost from '@/components/adminPage/adminCreatePost';
import styles from '@/styles/adminPage/adminCreatePost.module.css';

const AdminNoticeRegister = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('공지사항이 등록되었습니다.');
        router.push('/adminPage/adminNoticePage');
    };

    return(
        <div className={styles['CreatePostNoticeRegisterContainer']}>
            <h2 className={styles['CreatePostNoticeRegisterTitle']}>관리자 공지사항</h2>
            <CreatePost />
            <button type="button" onClick={handleSubmit} className={styles['CreatePostSubmitButton']}>등록하기</button>
        </div>
    );
};

export default AdminNoticeRegister;