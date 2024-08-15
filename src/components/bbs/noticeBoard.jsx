import React from 'react';
import '@/styles/bbs/noticeBoard.module.css';

function NoticeBoard() {
  const notices = [
    { id: 524, title: '[면접]면접일정안내', author: '관리자', date: '2024.07.23', views: 12, comments: 2 },
    { id: 524, title: '[합격]합격자발표', author: '관리자', date: '2024.07.23', views: 12, comments: 2 },
    { id: 524, title: '면접하세요', author: '관리자', date: '2024.07.23', views: 12, comments: 2 },
    // ... 추가 공지사항 항목들
  ];

  return (
    <div className="notice-board">
      
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice, index) => (
            <tr key={index}>
              <td>{notice.title}</td>
              <td>{notice.author}</td>
              <td>{notice.date}</td>
              <td>{notice.views}</td>
              <td>{notice.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeBoard;