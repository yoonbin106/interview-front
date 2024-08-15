import React from 'react';
import styles from '@/styles/login/findPasswordEnd.module.css';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';

const FindPasswordEnd = observer(() => {
  const { userStore } = useStores();
  const { username = '', email = '' } = userStore || {};

  const message = email
    ? `${username} 님의 비밀번호가 정상적으로 변경되었습니다.` 
    : `${username} 님의 회원정보가 없습니다.`;

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.findPasswordEndBox}>
        <h2 className="mb-4">비밀번호 변경</h2>
        <div className={`form-group ${styles['form-group']}`}>
          <p className={`text-center ${styles['upper-text']}`}>{message}</p>
        </div>
        <a href="/auth" className="btn btn-dark w-100 mb-3">로그인</a>
      </div>
    </div>
  );
});

export default FindPasswordEnd;