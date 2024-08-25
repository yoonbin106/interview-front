// bbsQnaListPage.jsx
import React from 'react';
import BbsQnaList from '@/components/bbs/bbsQnaList';
import BbsQnaSideMenu from '@/components/bbs/bbsQnaSideMenu';
import styles from '@/styles/adminPage/adminPage.module.css';

const BbsQnaListPage = () => {
  return (
    <div className={styles.container}>
    <div className={styles.sidebar}>
        <BbsQnaSideMenu/>
    </div>
    <div className={styles.content}>
      <BbsQnaList />
      </div>
      </div>
  );
};
export default BbsQnaListPage;