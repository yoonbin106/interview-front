//adminNoticeRegisterPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import CreatePost from '@/components/bbs/bbsCreatePost';
import styles from '@/styles/bbs/bbsCreatePost.module.css';
import sidebar from '@/styles/bbs/bbsPage.module.css';
import NestedList from '@/components/bbs/bbsSidebar';

const NoticeRegister = () => {
    const router = useRouter();
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('공지사항이 등록되었습니다.');
        router.push('/bbs/bbsNoticePage');
    };

    return(
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <div className={styles['CreatePostNoticeRegisterContainer']}>
                    <h2 className={styles['CreatePostNoticeRegisterTitle']}>전체 공지사항</h2>
                    <CreatePost />
                    <button type="button" onClick={handleSubmit} className={styles['CreatePostSubmitButton']}>등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default NoticeRegister;