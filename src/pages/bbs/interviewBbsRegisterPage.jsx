//bbsRegisterPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import CreatePost from '@/components/bbs/bbsCreatePost';
import sidebar from '@/styles/bbs/bbsPage.module.css';
import styles from '@/styles/bbs/bbsCreatePost.module.css';
import NestedList from '@/components/bbs/bbsSidebar';
const BbsRegister = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('글이 등록되었습니다.');
        router.push('/bbs/boardTable');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['CreatePostbbsRegisterContainer']}>
                    <h2 className={styles['CreatePostbbsRegisterTitle']}>면접자 게시판</h2>
                    <CreatePost />
                    <button type="button" onClick={handleSubmit} className={styles['submit-button']}>등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default BbsRegister;