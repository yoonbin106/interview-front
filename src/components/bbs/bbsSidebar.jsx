import React from 'react';
import styles from '@/styles/bbs/bbsSidebar.module.css';

const Sidebar = () => (
  
  
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <h1>게시판</h1>
          <li><a href="/bbs/bbsPage">전체 게시판</a></li>
          <li><a href="/bbs/interviewBbsPage">면접자 게시판</a></li>
          <li><a href="/bbs/noticePage">공지사항</a></li>
        </ul>
      </nav>
  </aside>
  
);

export default Sidebar;