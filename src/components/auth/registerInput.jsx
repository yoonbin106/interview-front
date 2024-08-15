import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/styles/login/registerInput.module.css';
import { useRouter } from 'next/router';
import { sendPhoneCode, verifyPhoneCode } from '../../api/phoneApi';
import { sendEmailCode, verifyEmailCode } from '../../api/emailApi';
import { useLoadDaumPostcodeScript, openPostcodePopup } from '../../api/getPostCode';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [emailCodeVisible, setEmailCodeVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const timerRef = useRef(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCodeVisible, setPhoneCodeVisible] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(180); // 3분 = 180초
  const phoneTimerRef = useRef(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const router = useRouter();

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSendCode = async () => {
    if (validateEmail(email)) {
      try {
        const response = await sendEmailCode(email);
        if (response) {
          console.log('이메일 유효성 검사 통과. 인증번호를 발송합니다.');
          setEmailCodeVisible(true);
          setIsCodeSent(true);
          startTimer();
        } else {
          alert('인증번호 발송에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error sending verification code:', error);
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
        setIsEmailVerified(true); // 이메일 인증 성공 시 상태 업데이트
        clearInterval(timerRef.current); // 타이머 제거
        setEmailCodeVisible(false); // 이메일 인증 버튼 제거
      } else {
        alert('인증코드가 올바르지 않습니다.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSendPhoneCode = async () => {
    if (validatePhone(phone)) {
      try {
        const response = await sendPhoneCode(phone);
        if (response) {
          console.log('전화번호 유효성 검사 통과. 인증번호를 발송합니다.');
          setPhoneCodeVisible(true);
          startPhoneTimer();
        } else {
          alert('인증번호 발송에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error sending phone verification code:', error);
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
        clearInterval(phoneTimerRef.current); // 타이머 제거
        setPhoneCodeVisible(false); // 전화번호 인증 버튼 제거
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

    setTimer(180); // 3분으로 타이머 설정
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setEmailCodeVisible(false);
          setIsCodeSent(false); // 3분 후 인증 코드 발송 버튼 활성화
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const startPhoneTimer = () => {
    if (phoneTimerRef.current) {
      clearInterval(phoneTimerRef.current);
    }

    setPhoneTimer(180); // 3분으로 타이머 설정
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

  // 전화번호 유효성 검사
  const validatePhone = (phone) => {
    const phonePattern = /^\d{11}$/;
    return phonePattern.test(phone);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (phoneTimerRef.current) {
        clearInterval(phoneTimerRef.current);
      }
    };
  }, []);

  useLoadDaumPostcodeScript();

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const buttonStyle = (isSelected) => ({
    display: 'block',
    padding: '10px 0',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#ccc' : '#f8f9fa', // 선택된 경우와 아닌 경우의 배경색
    border: '1px solid',
    borderColor: isSelected ? '#bbb' : '#dee2e6', // 선택된 경우와 아닌 경우의 테두리 색상
    color: '#333',
    fontSize: '16px',
    textAlign: 'center',
    width: '100%'
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordAgainVisibility = () => {
    setShowPasswordAgain(!showPasswordAgain);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
  
    if (isEmailVerified) {
      formObject.email = email;
    }
  
    if (isPhoneVerified) {
      formObject.phone = phone;
    }
    formObject.address = `${postcode} ${address} ${specificAddress} ${extraAddress}`;
    console.log(formObject);
    router.push({
      pathname: '/auth/registerInputProfile',
      query: formObject,
    });
  };


  return (
    <div
      className={`${styles.container} d-flex justify-content-center align-items-center`}
    >
      <div className={styles.signUpBox}>
        <div className={`card ${styles.card}`}>
          <h2 className={styles.title}>회원가입</h2>
          <hr />
          <form onSubmit={handleNextClick}>
            <div>
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
                    disabled={isEmailVerified} // 이메일 인증 시 입력 비활성화
                  />
                  {!isEmailVerified && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSendCode}
                      disabled={isCodeSent} // 인증 코드 발송 후 비활성화
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
            </div>

            <div>
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">
                  <i className="fa-solid fa-lock">&nbsp;</i>비밀번호
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="비밀번호 입력"
                    name="password"
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
              <div className="form-group mb-3">
                <label htmlFor="passwordAgain" className="form-label">
                  <i className="fa-solid fa-lock">&nbsp;</i>비밀번호 재 입력
                </label>
                <div className="input-group">
                  <input
                    type={showPasswordAgain ? "text" : "password"}
                    className="form-control"
                    id="passwordAgain"
                    placeholder="비밀번호 재 입력"
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
            </div>

            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="username" className="form-label">
                <i className="fa-regular fa-user">&nbsp;</i>이름
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="이름 입력"
                name="username"
              />
            </div>

            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="birth" className="form-label">
                <i className="fa-regular fa-calendar">&nbsp;</i>생년월일 8자리
              </label>
              <input
                type="date"
                className="form-control"
                id="birth"
                placeholder="생년월일 입력"
                name="birth"
              />
            </div>

            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="genderSelection" className="form-label">
                <i className="fa-solid fa-person">&nbsp;</i>성별 선택
              </label>
              <div className="input-group">
                <div className="form-check ps-0 flex-grow-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="men"
                    name="gender"
                    value="men"
                    checked={selectedGender === "men"}
                    onChange={handleGenderChange}
                    style={{ position: "absolute", opacity: 0 }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="men"
                    style={buttonStyle(selectedGender === "men")}
                  >
                    남자
                  </label>
                </div>
                <div className="form-check flex-grow-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="women"
                    name="gender"
                    value="women"
                    checked={selectedGender === "women"}
                    onChange={handleGenderChange}
                    style={{ position: "absolute", opacity: 0 }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="women"
                    style={buttonStyle(selectedGender === "women")}
                  >
                    여자
                  </label>
                </div>
              </div>
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
                    disabled={isPhoneVerified} // 전화번호 인증 시 입력 비활성화
                  />
                  {!isPhoneVerified && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSendPhoneCode}
                      disabled={phoneCodeVisible} // 인증 코드 발송 후 비활성화
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
            </div>
    
            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="zipcode" className="form-label">
                <i className="fa-solid fa-location-dot">&nbsp;</i>우편번호
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="zipcode"
                  placeholder="우편번호"
                  value={postcode}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    openPostcodePopup(setPostcode, setAddress, setExtraAddress)
                  }
                >
                  우편번호 검색
                </button>
              </div>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="주소"
                  value={address}
                  readOnly
                />
              </div>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control me-2 rounded"
                  id="specificAddress"
                  placeholder="상세주소"
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control rounded"
                  id="extraAddress"
                  placeholder="참고항목"
                  value={extraAddress}
                  readOnly
                />
              </div>
            </div>

            <p className={styles["alert-text"]}>* 아이디: 필수정보입니다</p>
            <p className={styles["alert-text"]}>* 비밀번호: 필수정보입니다</p>
            <div className="btn-group d-flex justify-content-between">
              <a href="/auth/register" className="btn btn-primary me-2 rounded">이전</a>
            <button type="submit" className="btn btn-secondary rounded">
              다음
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default SignupForm;