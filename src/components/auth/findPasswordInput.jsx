import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useStores } from '@/contexts/storeContext';
import styles from '@/styles/login/findPasswordInput.module.css';
import { resetPassword } from '@/api/emailApi';

const FindPasswordInput = () => {
  const { userStore } = useStores();
  const { username = '', email = '' } = userStore || {};
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordAgainVisibility = () => {
    setShowPasswordAgain(!showPasswordAgain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !passwordAgain) {
      setError('모든 비밀번호 필드를 입력해주세요.');
      return;
    }
    if (password !== passwordAgain) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await resetPassword(username, email, password);
      userStore.setUsername(username);
      userStore.setEmail(email);
      router.push('/auth/findPasswordEnd');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.findPasswordInputBox}>
        <h2 className="mb-4">비밀번호 재설정</h2>
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${styles['form-group']}`}>
            <label htmlFor="password" className="form-label">
              <i className="fa-solid fa-lock"></i>&nbsp;새 비밀번호
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fa-regular ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </div>
          </div>
          <div className={`form-group ${styles['form-group']}`}>
            <label htmlFor="passwordAgain" className="form-label">
              <i className="fa-solid fa-lock"></i>&nbsp;새 비밀번호 확인
            </label>
            <div className="input-group">
              <input
                type={showPasswordAgain ? "text" : "password"}
                className="form-control"
                id="passwordAgain"
                placeholder="새 비밀번호 확인"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordAgainVisibility}
              >
                <i
                  className={`fa-regular ${
                    showPasswordAgain ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </div>
          </div>
          {error && <p className={styles['alert-text']}>{error}</p>}
          <div className="btn-group d-flex justify-content-between">
            <a href="/auth" className="btn btn-primary me-2 rounded">처음으로</a>
            <button type="submit" className="btn btn-secondary rounded">다음</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPasswordInput;