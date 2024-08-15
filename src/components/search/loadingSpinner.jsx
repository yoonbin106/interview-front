import React from 'react';
import styles from '@/styles/search/loadingSpinner.module.css'; // 수정된 부분

const LoadingSpinner = () => (
    <div className={styles['spinner-overlay']}>
        <div className={styles['spinner']}></div>
    </div>
);

export default LoadingSpinner;
