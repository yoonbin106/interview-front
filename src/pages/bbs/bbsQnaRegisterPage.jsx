// bbsQnaRegisterPage.jsx
import React from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import BbsQnaSideMenu from 'components/bbs/bbsQnaSideMenu';
import BbsQnaRegister from 'components/bbs/bbsQnaRegister';


const BbsQnaRegisterPage = () => {
  return (
    <div className={styles.container}>
    <div className={styles.sidebar}>
        <BbsQnaSideMenu />
    </div>
    <div className={styles.content}>
      <BbsQnaRegister />
      </div>
      </div>
  );
};
export default BbsQnaRegisterPage;