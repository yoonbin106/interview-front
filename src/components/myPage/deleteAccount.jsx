import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from '@/styles/myPage/deleteAccount.module.css';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useStores } from '@/contexts/storeContext';

const DeleteAccount = observer(() => {
  const { userStore } = useStores();
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(userStore.email);
  }, []);

  return (
    <main className={styles.formContact}>
      <h1 className={styles.title}>회원 탈퇴</h1>
      <section className={styles.warningContainer}>
        <LogoutIcon sx={{ fontSize: 80 }} />
        <p className={styles.warningText}>정말 탈퇴하실 건가요?</p>
      </section>
      <hr className={styles.divider} />


      <h2 className={styles.confirmationTitle}>회원 탈퇴 확인</h2>

      <div className={styles.confirmationFrame}>
          <div className={styles.inputGroup}>
              <div className={styles.inputLabel}>
                <span className={styles.emailLabel}>이메일</span>
              </div>
              <div className={styles.inputWrapper}>
                <span className={styles.emailValue}>{email}</span>
              </div>
          </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            <LockIcon />
            <div className={styles.emailLabel}>비밀번호 입력</div>
          </label>

          <div className={styles.inputWrapper}>
            <input type="password" className={styles.input} placeholder="비밀번호 입력" />
          </div>
        </div>

      </div>

      {/* <hr className={styles.divider} /> */}
      <div className={styles.buttonGroup}>
        {/* <button type="button" className={styles.button}>
          <span className={styles.buttonText}>취소</span>
        </button> */}
        <button type="submit" className={styles.button}>
          <span className={styles.buttonText}>확인</span>
        </button>
      </div>
    </main>
  );
});

export default DeleteAccount;