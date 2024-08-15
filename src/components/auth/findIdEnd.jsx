import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from '@/styles/login/findIdEnd.module.css';
import { useStores } from '@/contexts/storeContext';

const FindIdEnd = observer(() => {
  const { userStore } = useStores();
  const { username = '', email = '' } = userStore || {};

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.findIdEndBox}>
        <h2 className="mb-4">아이디 찾기 결과</h2>
        <div className={`form-group ${styles['form-group']}`}>
          <p className={`text-center ${styles['upper-text']}`}>{username} 님의 아이디 정보입니다.</p>
        </div>
        <div className={`form-group ${styles['form-group']}`}>
          {email ? (
            <p className={`text-center ${styles['lower-text']}`}>
              회원님의 아이디는
              <br />
              <span className={`${styles['id-text']}`}>{email}</span> 입니다.
            </p>
          ) : (
            <p className={`text-center ${styles['lower-text']}`}>
              회원님의 아이디는 존재하지 않습니다.
            </p>
          )}
        </div>
          <a href="/auth" className="btn btn-dark w-100 mb-3">로그인</a>
      </div>
    </div>
  );
});

export default FindIdEnd;