import React from "react";
import styles from '@/styles/myPage/deleteAccount.module.css';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';

function DeleteAccount() {
  return (
    <main className={styles.formContact}>
      <h1 className={styles.title}>회원 탈퇴</h1>
      <section className={styles.warningContainer}>
        <LogoutIcon sx={{fontSize: 80}}/>
        <p className={styles.warningText}>정말 탈퇴하실 건가요?</p>
      </section>
      <hr className={styles.divider} />
      <h2 className={styles.confirmationTitle}>회원 탈퇴 확인</h2>
      <div className={styles.emailContainer}>
        <span className={styles.emailLabel}>이메일</span>
        <span className={styles.emailValue}>example01@gmail.com</span>
      </div>


      <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
                <LockIcon/>
                <span>비밀번호 입력</span>
            </label>
            <div className={styles.inputWrapper}>
                <input type="password" className={styles.input} placeholder="비밀번호 입력"/>
            </div>
        </div>

      <hr className={styles.divider} />
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.button}>
          <span className={styles.buttonText}>취소</span>
        </button>
        <button type="submit" className={styles.button}>
          <span className={styles.buttonText}>변경</span>
        </button>
      </div>
    </main>
  );
}

export default DeleteAccount;