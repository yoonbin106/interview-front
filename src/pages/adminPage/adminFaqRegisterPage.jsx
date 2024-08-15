//adminFaqRegisterPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import CreatePost from '@/components/adminPage/adminCreatePost';
import styles from '@/styles/adminPage/adminCreatePost.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const FaqRegister = () => {
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
                <div className={styles['CreatePostNoticeRegisterContainer']}>
                    <h2 className={styles['CreatePostNoticeRegisterTitle']}>자주 묻는 질문</h2>
                    <CreatePost />
                    <button type="button" onClick={handleSubmit} className={styles['CreatePostSubmitButton']}>등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default FaqRegister;