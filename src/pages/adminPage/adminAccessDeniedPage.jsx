// /pages/adminPage/adminAccessDenied.js
import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminAccessDenied.module.css'; 

const AdminAccessDeniedPage = () => {
  const router = useRouter();

  return (
    <div className={styles.accessDeniedPage}>
      <div className={styles.imageContainer}>
          <img
            src='../../images/accessDenied.png' // 일러스트 이미지 경로
            alt="Access Denied 이미지"
            className={styles.image}
              />
        </div>
    <div className={styles.accessDeniedContainer}>
      <h1 className={styles.accessDeniedTitle}>- Access Denied -</h1>
      <p className={styles.accessDeniedMessage}>접근할 수 있는 권한이 없습니다.</p>
      <button className={styles.accessDeniedButton} onClick={() => router.push('/')}>
        홈으로 돌아가기
      </button>
    </div>
    </div>
  );
};

export default AdminAccessDeniedPage;
