import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/bbs/qnaTable.module.css';

const QnaTable = () => {
  const router = useRouter();
  const posts = [
    { id: 1, title: '질문이 있어요1', author: '김길동', date: '2024.07.27', views: 12, status: '대기중' },
    { id: 2, title: '질문이 있어요2', author: '홍길동', date: '2024.07.23', views: 10, status: '답변완료' },
    { id: 3, title: '질문이 있어요3', author: '박길동', date: '2024.06.20', views: 12, status: '답변중' },
  ];

  const handleRowClick = (postId) => {
    router.push(`/bbs/adminBbsPage/${postId}`);
  };

  const handleCreatePost = () => {
    router.push('@/components/bbs/qnaPost');
  };

  return (
    <div className={styles.qnaContainer}>
      <div className={styles.qna}>
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} onClick={() => handleRowClick(post.id)} className={styles.clickableRow}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
                <td>{post.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.qnaFooter}>
        <div className={styles.buttonContainer}>
          <button onClick={handleCreatePost} className={styles.createPostButton}>
            글 등록
          </button>
        </div>

        <div className={styles.paginationContainer}>
          <button>1</button>
          <button>2</button>
          <button>3</button>
        </div>

        <div className={styles.searchContainer}>
          <input type="text" placeholder="검색..." className={styles.searchInput} />
          <button className={styles.searchButton}>검색</button>
        </div>
      </div>
    </div>
  );
};

export default QnaTable;