import React from 'react';
import styles from '@/styles/login/registerEnd.module.css';
import { useRouter } from 'next/router';

const SignUpEnd = () => {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/auth');
  };

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.signUpEndBox}>
        <h2 className="mb-3">회원가입 완료</h2>
        <hr />
        <p className="mb-4">회원가입이 완료되었습니다. 로그인 페이지로 이동하여 로그인해 주세요.</p>
        <div className="btn-group d-flex justify-content-between">
          <button type="button" className="btn btn-secondary rounded" onClick={handleComplete}>
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpEnd;