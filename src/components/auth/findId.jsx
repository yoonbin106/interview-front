import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/login/findId.module.css';
import { sendPhoneCode, verifyPhoneCode, findEmailByUsernameAndPhone } from '@/api/phoneApi';
import { useStores } from '@/contexts/storeContext';

const FindId = () => {
  const [phone, setPhone] = useState('');
  const [username, setUserName] = useState('');
  const [phoneCodeVisible, setPhoneCodeVisible] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(180);
  const phoneTimerRef = useRef(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const router = useRouter();
  const { userStore } = useStores();

  const validatePhone = (phone) => {
    const phonePattern = /^\d{11}$/;
    return phonePattern.test(phone);
  };

  const handleSendPhoneCode = async () => {
    if (validatePhone(phone)) {
      try {
        const response = await sendPhoneCode(phone);
        if (response) {
          setPhoneCodeVisible(true);
          startPhoneTimer();
        } else {
          alert('인증번호 발송에 실패했습니다.');
        }
      } catch (error) {
        alert('인증번호 발송 중 오류가 발생했습니다.');
      }
    } else {
      alert('올바른 전화번호 형식을 입력해주세요. (11자리 숫자)');
    }
  };

  const handleVerifyPhoneCode = async () => {
    const code = document.getElementById('phoneCode').value;
    try {
      const response = await verifyPhoneCode(phone, code);
      if (response) {
        alert('전화번호 인증에 성공했습니다.');
        setIsPhoneVerified(true);
        clearInterval(phoneTimerRef.current);
        setPhoneCodeVisible(false);
      } else {
        alert('인증코드가 올바르지 않습니다.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const startPhoneTimer = () => {
    if (phoneTimerRef.current) {
      clearInterval(phoneTimerRef.current);
    }

    setPhoneTimer(180);
    phoneTimerRef.current = setInterval(() => {
      setPhoneTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(phoneTimerRef.current);
          setPhoneCodeVisible(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (phoneTimerRef.current) {
        clearInterval(phoneTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowNameError(false);
    setShowPhoneError(false);

    if (!username) {
      setShowNameError(true);
    }
    if (!isPhoneVerified) {
      setShowPhoneError(true);
    }
    if(username && isPhoneVerified){
      try {
        const responseEmail = await findEmailByUsernameAndPhone(username, phone);
        userStore.setUsername(username);
        userStore.setEmail(responseEmail || email);
        router.push('/auth/findIdEnd');
      } catch (error){
        userStore.setUsername(username);
        router.push('/auth/findIdEnd');
      }
    }
  };

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.findIdBox}>
        <h2 className="mb-4">아이디 찾기</h2>
        <hr />
        <form onSubmit={handleSubmit}>
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
          <div>
            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="phone" className="form-label">
                <i className="fa-solid fa-phone"></i>&nbsp;전화번호
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="전화번호 입력"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isPhoneVerified}
                />
                {!isPhoneVerified && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSendPhoneCode}
                    disabled={phoneCodeVisible}
                  >
                    인증번호 발송
                  </button>
                )}
              </div>
            </div>

            {phoneCodeVisible && !isPhoneVerified && (
              <div className={`form-group ${styles["form-group"]}`}>
                <label htmlFor="phoneCode" className="form-label">
                  <i className="fa-solid fa-phone"></i>&nbsp;인증코드 입력
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="phoneCode"
                    placeholder="인증코드 입력"
                  />
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={handleVerifyPhoneCode}
                  >
                    전화번호 인증
                  </button>
                  <span className="input-group-text text-danger">
                    {Math.floor(phoneTimer / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor(phoneTimer % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}
            {showPhoneError && <p className={styles['alert-text']}>* 전화번호: 인증이 필요합니다</p>}
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

export default FindId;