//adminDeletedPostDetailsPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminDeletedPostDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminDeletedPostDetailsPage() {
    const router = useRouter();

    const handleDelete = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 완전히 삭제하시겠습니까?")) {
                alert("게시글 삭제가 완료되었습니다.");
                router.push('/adminPage/adminDeletedPostPage');
            }
        }
    };



    const handleBack = () => {
        router.push('/adminPage/adminDeletedPostPage');
    };

    return (
    <div className={sidebar.container}>
        <div className={sidebar.sidebar}>
            <NestedList/>
        </div>
        <div className={sidebar.content}>
            <div className={styles.deletedPostDetailsWrapper}>
                <h2>게시글1</h2>
                <p className={styles.deletedPostDetailsDate}>2023-08-10</p>
                <hr />
                <div className={styles.deletedPostDetailsContent}>
                    <p><strong>게시판:</strong> 무슨 게시판</p><br></br>
                    <p><strong>작성자:</strong> user789</p><br></br>
                    <p>
                        게시글1 게시글1 게시글1 게시글1 게시글1 
                        게시글1 게시글1 게시글1 게시글1 게시글1
                        게시글1 게시글1 게시글1 게시글1 게시글1 
                        게시글1 게시글1 게시글1 게시글1 게시글1 
                        게시글1 게시글1 게시글1 게시글1 게시글1 
                        게시글1 게시글1 게시글1 게시글1 게시글1 
                        <br></br>
                        
                    </p>
                    <hr />
                    <br></br>
                    <p><strong>게시글 등록 날짜:</strong> 2023-08-11</p>
                    
                </div>
                <div className={styles.deletedPostDetailsButtonContainer}>
                    <button className={styles.deletedPostDetailsDeleteButton} onClick={handleDelete}>게시글 영구삭제</button>
                    <button className={styles.deletedPostDetailsBackButton} onClick={handleBack}>목록</button>
                </div>
            </div>
        </div>
    </div>
    );
}