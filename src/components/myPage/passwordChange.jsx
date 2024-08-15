import React from "react";
import styles from '@/styles/myPage/passwordChange.module.css';
import InputGroup from './inputGroup';
import CampaignIcon from '@mui/icons-material/Campaign';

const PasswordChangeForm = () => {
  const inputGroups = [
    { label: "현재 비밀번호", placeholder: "현재 비밀번호 입력" },
    { label: "새 비밀번호", placeholder: "새 비밀번호 입력" },
    { label: "새 비밀번호 확인", placeholder: "새 비밀번호 확인 입력" }
  ];

  return (
    <form className={styles.formContact}>
      <h1 className={styles.formTitle}>비밀번호 변경</h1>
      <section className={styles.infoBox}>
        <div className={styles.infoHeader}>
            <CampaignIcon sx={{fontSize: 40}}/>
          <span className={styles.infoLabel}>안내</span>
        </div>
        <p className={styles.infoContent}>
          비밀번호는 다음과 같은 규칙 <br /> <br />
          - 아이디와 동일한 비밀번호 불가 <br />
          - 8~16자의 영문 대소문자, 숫자 및 특수문자 사용 <br />
          - 어쩌고 저쩌고
        </p>
      </section>
      <div className={styles.divider} />
      <h2 className={styles.formSubtitle}>비밀번호 변경</h2>
      
        {inputGroups.map((group, index) => (
            <InputGroup key={index} label={group.label} placeholder={group.placeholder} />
        ))}
      
      <div className={styles.divider} />
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.button}>
          <span className={styles.buttonText}>취소</span>
        </button>
        <button type="submit" className={styles.button}>
          <span className={styles.buttonText}>변경</span>
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;