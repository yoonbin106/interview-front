/**adminReportedCommentPage.jsx*/

import React from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import ReportedFinCommentTable from '@/components/adminPage/adminReportedFinCommentTable';


const reportedComments = [
    { id: 3021, category: '광고', content: '단 6개월만에 취업성공? ICT2기 절찬리에 모집중@@-->링크클릭', author: 'user789', date: '2023-08-10' },
    { id: 3022, category: '스팸', content: '무의미한 반복 텍스트...', author: 'user654', date: '2023-08-09' },
    { id: 3023, category: '욕설', content: '이 씨발', author: 'user123', date: '2023-08-08' },
    { id: 3024, category: '비방', content: 'ewns__<<이사람 조심하세요 미쳐있음', author: 'user456', date: '2023-08-07' },
    { id: 3025, category: '허위 정보', content: '2강의실 최고대가리는 "최가흔" 모두들 기억해주세요', author: 'user987', date: '2023-08-06' },
    { id: 3026, category: '광고', content: '플젝이 어렵다? ☆PPT주말반☆ 속성 강의가 있답니다.', author: 'user321', date: '2023-08-05' },
    { id: 3027, category: '스팸', content: '또 다른 무의미한 텍스트...', author: 'user123', date: '2023-08-04' },
    { id: 3028, category: '욕설', content: '플젝 너무 힘들엉 십발', author: 'user654', date: '2023-08-03' },
    { id: 3029, category: '광고', content: '[개봉//임박]추피티vs흥파고 리벤지대결!!!!', author: 'user456', date: '2023-08-02' },
    { id: 3030, category: '허위 정보', content: '사실 이거 전혀 사실이 아니에요', author: 'user789', date: '2023-08-01' },
    { id: 3031, category: '광고', content: '이거 한번 봐봐요! 대박!', author: 'user987', date: '2023-07-31' },
    { id: 3032, category: '스팸', content: '같은 내용 반복...', author: 'user321', date: '2023-07-30' },
    { id: 3033, category: '욕설', content: '정말 나쁜 말들...', author: 'user123', date: '2023-07-29' },
    { id: 3034, category: '비방', content: '너무 못하네요', author: 'user654', date: '2023-07-28' },
    { id: 3035, category: '허위 정보', content: '이거 진짜라고 하는데 아닌 듯...', author: 'user456', date: '2023-07-27' }
];

export default function AdminReportComment() {
    const rows = reportedComments.map(post => ({
        id : post.id,
        category: post.category,
        title: post.content,
        author: post.author,
        date: post.date,
    }));

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList/>
            </div>
            <div className={styles.content}>
                <h2>　[완료]신고된 댓글 목록</h2>
                <ReportedFinCommentTable rows={rows} />
            </div>
        </div>
    );
}
