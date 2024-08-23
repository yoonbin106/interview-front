import React, { useState } from "react";
import styles from '@/styles/myPage/passwordChange.module.css';
import InputGroup from './inputGroup';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useRouter } from 'next/router';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import { changePassword } from '@/api/emailApi';

const PasswordChangeForm = observer(() => {
  const router = useRouter();
  const { userStore } = useStores();
  const email = userStore.email;
  const username = userStore.username;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});

  const inputGroups = [
    { label: "현재 비밀번호", placeholder: "현재 비밀번호 입력", value: currentPassword, setValue: setCurrentPassword, errorKey: "currentPassword" },
    { label: "새 비밀번호", placeholder: "새 비밀번호 입력", value: newPassword, setValue: setNewPassword, errorKey: "newPassword" },
    { label: "새 비밀번호 확인", placeholder: "새 비밀번호 확인 입력", value: confirmPassword, setValue: setConfirmPassword, errorKey: "confirmPassword" }
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
  
    if (!currentPassword) {
      newErrors.currentPassword = "* 현재 비밀번호를 입력해주세요";
      valid = false;
    }
  
    if (!newPassword) {
      newErrors.newPassword = "* 새 비밀번호를 입력해주세요";
      valid = false;
    }
  
    if (!confirmPassword) {
      newErrors.confirmPassword = "* 새 비밀번호 확인을 입력해주세요";
      valid = false;
    }
  
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "* 새 비밀번호 확인이 일치하지 않습니다";
      valid = false;
    }
  
    setError(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await changePassword(username, email, newPassword, currentPassword);
      router.push('/myPage');
    } catch (err) {
      if (err.response && err.response.status === 512) {
        setError({ newPassword: "* 이전 비밀번호는 사용할 수 없습니다" });
      } else if (err.response && err.response.status === 514){
        setError({ currentPassword: "* 현재 비밀번호가 일치하지 않습니다" });
      } else{
        setError({ general: err.message });
      }
    }
  };

  return (
    <form className={styles.formContact} onSubmit={handleSubmit}>
      <h1 className={styles.formTitle}>비밀번호 변경</h1>

      <section className={styles.infoBox}>
        <div className={styles.infoHeader}>
          <CampaignIcon sx={{ fontSize: 40 }} />
          <span className={styles.infoLabel}>안내</span>
        </div>
        
        <div className={styles.infoContent}>
          비밀번호는 다음과 같은 규칙 <br /> <br />
          - 이전 비밀번호와 동일한 비밀번호 불가 <br /> <br />
          - 4~16자의 영문 대소문자, 숫자만 가능
        </div>
      </section>

      <div className={styles.passwordChangeFrame} >
        {inputGroups.map((group, index) => (
          <div key={index}>
            <InputGroup
              label={group.label}
              placeholder={group.placeholder}
              value={group.value}
              onChange={(e) => group.setValue(e.target.value)}
            />
            {error[group.errorKey] && (
              <p className={styles['alert-text']}>{error[group.errorKey]}</p>
            )}
          </div>
        ))}
      </div>
      {error.general && <p className={styles['alert-text']}>{error.general}</p>}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.button}
          onClick={() => router.push('/myPage')}
        >
          <span className={styles.buttonText}>취소</span>
        </button>
        <button type="submit" className={styles.button}>
          <span className={styles.buttonText}>변경</span>
        </button>
      </div>
    </form>
  );
});

export default PasswordChangeForm;