// adminReportedPostDetailsPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminReportedPostDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminReportedPostDetailsPage() {
    const router = useRouter();

    const handleDelete = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 삭제하시겠습니까?")) {
                alert("게시글 삭제가 완료되었습니다.");
                router.push('/adminPage/adminReportedPostPage');
            }
        }
    };

    const handleHide = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 숨기시겠습니까?")) {
                alert("게시글 숨김이 완료되었습니다.");
                router.push('/adminPage/adminReportedPostPage');
            }
        }
    };

    const handleBack = () => {
        router.push('/adminPage/adminReportedPostPage');
    };

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
        <div className={sidebar.content}>
            <div className={styles.ReportedPostDetailsWrapper}>
                <h2>단 6개월만에 취업성공? ICT2기 절찬리에 모집중@@--&gt;링크클릭</h2>
                <p className={styles.ReportedPostDetailsDate}>2023-08-10</p>
                <hr />
                <div className={styles.ReportedPostDetailsContent}>
                    <p><strong>카테고리:</strong> 광고</p>
                    <p><strong>작성자:</strong> user789</p>
                    <p>
                        요즘 취업이 어려운 상황 속에서 ICT2기 프로그램을 통해
                        단 6개월만에 취업에 성공한 사례가 늘고 있습니다.
                        이번 기회를 놓치지 마세요! 자세한 사항은 링크를 통해 확인해 주세요.
                    </p>
                    <hr />
                    <p><strong>신고사유:</strong></p>
                    <textarea
                        className={styles.ReportedPostDetailsReasonInput}
                        defaultValue="광고성 게시물입니다."
                        readOnly
                    />
                    <p><strong>신고자:</strong> user123</p>
                    <p><strong>신고날짜:</strong> 2023-08-11</p>
                </div>
                <div className={styles.ReportedPostDetailsButtonContainer}>
                    <button className={styles.ReportedPostDetailsDeleteButton} onClick={handleDelete}>게시글 삭제</button>
                    <button className={styles.ReportedPostDetailsHideButton} onClick={handleHide}>게시글 숨김</button>
                    <button className={styles.ReportedPostDetailsBackButton} onClick={handleBack}>목록</button>
                </div>
            </div>
        </div>
    </div>
    );
}