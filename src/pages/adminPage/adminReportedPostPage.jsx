//**adminReportedFinPostPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import ReportedPostTable from '@/components/adminPage/adminReportedPost';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const reportedPosts = [
    { id: 3021, category: '광고', title: '단 6개월만에 취업성공? ICT2기 절찬리에 모집중@@-->링크클릭', author: 'user789', date: '2023-08-10', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3022, category: '스팸', title: '무의미한 반복 텍스트...', author: 'user654', date: '2023-08-09', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3023, category: '욕설', title: '이 씨발', author: 'user123', date: '2023-08-08', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3024, category: '비방', title: 'ewns__<<이사람 조심하세요 미쳐있음', author: 'user456', date: '2023-08-07', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3025, category: '허위 정보', title: '2강의실 최고대가리는 "최가흔" 모두들 기억해주세요', author: 'user987', date: '2023-08-06', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3026, category: '광고', title: '플젝이 어렵다? ☆PPT주말반☆ 속성 강의가 있답니다.', author: 'user321', date: '2023-08-05', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3027, category: '스팸', title: '또 다른 무의미한 텍스트...', author: 'user123', date: '2023-08-04', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3028, category: '욕설', title: '플젝 너무 힘들엉 십발', author: 'user654', date: '2023-08-03', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3029, category: '광고', title: '[개봉//임박]추피티vs흥파고 리벤지대결!!!!', author: 'user456', date: '2023-08-02', content: '여기에 게시글 내용이 들어갑니다.' },
    { id: 3030, category: '허위 정보', title: '사실 이거 전혀 사실이 아니에요', author: 'user789', date: '2023-08-01', content: '여기에 게시글 내용이 들어갑니다.' },
   
];

export default function AdminReportPostPage() {
    const router = useRouter();

    const rows = reportedPosts.map(post => ({
        id: post.id,
        category: post.category,
        title: post.title,
        author: post.author,
        date: post.date,
        onClick: () => navigate(`/adminPage/adminReportedPostDetailsPage`), // 특정 ID 없이 고정된 경로로 이동
    }));

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList/>
            </div>
            <div className={styles.content}>
                <h2>　[완료]신고된 게시글 목록</h2>
                <ReportedPostTable rows={rows} />
            </div>
        </div>
    );
}