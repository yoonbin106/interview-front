import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/login/findPassword.module.css';
import { sendEmailCode, verifyEmailCode, verifyUserByUsernameAndEmail } from '@/api/emailApi';
import { useStores } from '@/contexts/storeContext';

const FindPassword = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [emailCodeVisible, setEmailCodeVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(180);
  const timerRef = useRef(null);
  const [showNameError, setShowNameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const router = useRouter();
  const { userStore } = useStores();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSendCode = async () => {
    if (validateEmail(email)) {
      try {
        const response = await sendEmailCode(email);
        if (response) {
          setEmailCodeVisible(true);
          setIsCodeSent(true);
          startTimer();
          setEmail(email);
        } else {
          alert('인증번호 발송에 실패했습니다.');
        }
      } catch (error) {
        alert('인증번호 발송 중 오류가 발생했습니다.');
      }
    } else {
      alert('올바른 이메일 형식을 입력해주세요.');
    }
  };

  const handleVerifyEmailCode = async () => {
    const code = document.getElementById('emailCode').value;
    try {
      const response = await verifyEmailCode(email, code);
      if (response) {
        alert('이메일 인증에 성공했습니다.');
        setIsEmailVerified(true);
        clearInterval(timerRef.current);
        setEmailCodeVisible(false);
      } else {
        alert('인증코드가 올바르지 않습니다.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimer(180);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setEmailCodeVisible(false);
          setIsCodeSent(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowNameError(false);
    setShowEmailError(false);

    if (!username) {
      setShowNameError(true);
    }
    if (!isEmailVerified) {
      setShowEmailError(true);
    }

    if (username && isEmailVerified) {
      try {
        const responseEmail = await verifyUserByUsernameAndEmail(username, email);
        userStore.setUsername(username);
        userStore.setEmail(responseEmail || email);
        router.push('/auth/findPasswordInput');
      } catch (error) {
        userStore.setUsername(username);
        router.push('/auth/findPasswordEnd');
      }
    }
  };

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.findPasswordBox}>
        <h2 className="mb-4">비밀번호 찾기</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <div className={`form-group ${styles['form-group']}`}>
              <label htmlFor="username" className="form-label">
                <i className="fa-regular fa-user">&nbsp;</i>이름
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="이름 입력"
                name="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              {showNameError && <p className={styles['alert-text']}>* 이름: 필수정보입니다</p>}
            </div>
            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="email" className="form-label">
                <i className="fa-regular fa-envelope"></i>&nbsp;이메일
              </label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="이메일 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailVerified}
                />
                {!isEmailVerified && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSendCode}
                    disabled={isCodeSent}
                  >
                    인증번호 발송
                  </button>
                )}
              </div>
            </div>

            {emailCodeVisible && !isEmailVerified && (
              <div className={`form-group ${styles["form-group"]}`}>
                <label htmlFor="emailCode" className="form-label">
                  <i className="fa-regular fa-envelope"></i>&nbsp;인증코드 입력
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="emailCode"
                    placeholder="인증코드 입력"
                  />
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={handleVerifyEmailCode}
                  >
                    이메일 인증
                  </button>
                  <span className="input-group-text text-danger">
                    {Math.floor(timer / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor(timer % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}
            {showEmailError && <p className={styles['alert-text']}>* 이메일: 인증이 필요합니다</p>}
          </div>
          <div className="btn-group d-flex justify-content-between">
            <a href="/auth" className="btn btn-primary me-2 rounded">이전</a>
            <button type="submit" className="btn btn-secondary rounded">다음</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;