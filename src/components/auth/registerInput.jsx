import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/styles/login/registerInput.module.css";
import { useRouter } from "next/router";
import { sendPhoneCode, verifyPhoneCode } from "../../api/phoneApi";
import { sendEmailCode, verifyEmailCode } from "../../api/emailApi";
import {
  useLoadDaumPostcodeScript,
  openPostcodePopup,
} from "../../api/getPostCode";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [formState, setFormState] = useState({
    email: "",
    phone: "",
    password: "",
    passwordAgain: "",
    username: "",
    birth: "",
    gender: "",
    postcode: "",
    address: "",
    extraAddress: "",
    specificAddress: "",
  });

  const [validationState, setValidationState] = useState({
    isEmailVerified: false,
    isPhoneVerified: false,
    emailCodeVisible: false,
    phoneCodeVisible: false,
    timer: 180,
    phoneTimer: 180,
    emailError: "",
    passwordError: "",
    passwordAgainError: "",
    nameError: "",
    birthError: "",
    genderError: "",
    phoneError: "",
    postcodeError: "",
  });

  const timerRef = useRef(null);
  const phoneTimerRef = useRef(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleValidationChange = (key, value) => {
    setValidationState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^\d{11}$/;
    return phonePattern.test(phone);
  };

  const handleSendCode = async () => {
    if (validateEmail(formState.email)) {
      try {
        const response = await sendEmailCode(formState.email);
        if (response) {
          handleValidationChange("emailCodeVisible", true);
          handleValidationChange("emailError", "");
          startTimer();
        } else {
          alert("인증번호 발송에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error sending verification code:", error);
        alert("인증번호 발송 중 오류가 발생했습니다.");
      }
    } else {
      handleValidationChange(
        "emailError",
        "올바른 이메일 형식을 입력해주세요."
      );
    }
  };

  const handleVerifyEmailCode = async () => {
    const code = document.getElementById("emailCode").value;
    try {
      const response = await verifyEmailCode(formState.email, code);
      if (response) {
        alert("이메일 인증에 성공했습니다.");
        handleValidationChange("isEmailVerified", true);
        clearInterval(timerRef.current);
        handleValidationChange("emailCodeVisible", false);
      } else {
        alert("인증코드가 올바르지 않습니다.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSendPhoneCode = async () => {
    if (validatePhone(formState.phone)) {
      try {
        const response = await sendPhoneCode(formState.phone);
        if (response) {
          handleValidationChange("phoneCodeVisible", true);
          handleValidationChange("phoneError", "");
          startPhoneTimer();
        } else {
          alert("인증번호 발송에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error sending phone verification code:", error);
        alert("인증번호 발송 중 오류가 발생했습니다.");
      }
    } else {
      handleValidationChange(
        "phoneError",
        "올바른 전화번호 형식을 입력해주세요. (11자리 숫자)"
      );
    }
  };

  const handleVerifyPhoneCode = async () => {
    const code = document.getElementById("phoneCode").value;
    try {
      const response = await verifyPhoneCode(formState.phone, code);
      if (response) {
        alert("전화번호 인증에 성공했습니다.");
        handleValidationChange("isPhoneVerified", true);
        clearInterval(phoneTimerRef.current);
        handleValidationChange("phoneCodeVisible", false);
      } else {
        alert("인증코드가 올바르지 않습니다.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    handleValidationChange("timer", 180); // 3분으로 타이머 설정
    timerRef.current = setInterval(() => {
      setValidationState((prevState) => {
        const newTimer = prevState.timer - 1;
        if (newTimer <= 0) {
          clearInterval(timerRef.current);
          handleValidationChange("emailCodeVisible", false);
          return { ...prevState, timer: 0 };
        }
        return { ...prevState, timer: newTimer };
      });
    }, 1000);
  };

  const startPhoneTimer = () => {
    if (phoneTimerRef.current) {
      clearInterval(phoneTimerRef.current);
    }

    handleValidationChange("phoneTimer", 180); // 3분으로 타이머 설정
    phoneTimerRef.current = setInterval(() => {
      setValidationState((prevState) => {
        const newTimer = prevState.phoneTimer - 1;
        if (newTimer <= 0) {
          clearInterval(phoneTimerRef.current);
          handleValidationChange("phoneCodeVisible", false);
          return { ...prevState, phoneTimer: 0 };
        }
        return { ...prevState, phoneTimer: newTimer };
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

  useEffect(() => {
    return () => {
      if (phoneTimerRef.current) {
        clearInterval(phoneTimerRef.current);
      }
    };
  }, []);

  useLoadDaumPostcodeScript();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!validationState.isEmailVerified) {
      handleValidationChange("emailError", "* 이메일: 인증이 필요합니다");
      hasError = true;
    }

    if (!validationState.isPhoneVerified) {
      handleValidationChange("phoneError", "* 전화번호: 인증이 필요합니다");
      hasError = true;
    }

    if (!formState.password) {
      handleValidationChange(
        "passwordError",
        "* 비밀번호 입력: 필수정보입니다"
      );
      hasError = true;
    } else {
      handleValidationChange("passwordError", "");
    }

    if (!formState.passwordAgain) {
      handleValidationChange(
        "passwordAgainError",
        "* 비밀번호 재 입력: 필수정보입니다"
      );
      hasError = true;
    } else {
      handleValidationChange("passwordAgainError", "");
    }

    if (!formState.username) {
      handleValidationChange("nameError", "* 이름: 필수정보입니다");
      hasError = true;
    } else {
      handleValidationChange("nameError", "");
    }

    if (!formState.birth) {
      handleValidationChange("birthError", "* 생년월일: 필수정보입니다");
      hasError = true;
    } else {
      handleValidationChange("birthError", "");
    }

    if (!formState.gender) {
      handleValidationChange("genderError", "* 성별: 필수정보입니다");
      hasError = true;
    } else {
      handleValidationChange("genderError", "");
    }

    if (!postcode) {
      handleValidationChange("postcodeError", "* 우편번호: 필수정보입니다");
      hasError = true;
    } else {
      handleValidationChange("postcodeError", "");
    }

    if (hasError) return;

    // 폼 데이터를 객체로 변환
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // 이메일과 전화번호 상태 추가
    if (validationState.isEmailVerified) {
      formObject.email = formState.email;
    }

    if (validationState.isPhoneVerified) {
      formObject.phone = formState.phone;
    }

    // 주소 데이터 추가
    formObject.address = `${postcode} ${address} ${specificAddress} ${extraAddress}`;

    console.log(formObject);

    // 페이지 이동
    router.push({
      pathname: "/auth/registerInputProfile",
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
          <form onSubmit={handleSubmit}>
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
                    value={formState.email}
                    onChange={(e) => handleInputChange(e)}
                    disabled={validationState.isEmailVerified} // 이메일 인증 시 입력 비활성화
                  />
                  {!validationState.isEmailVerified && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSendCode}
                    >
                      인증번호 발송
                    </button>
                  )}
                </div>
                {validationState.emailError && (
                  <p className={styles["alert-text"]}>
                    {validationState.emailError}
                  </p>
                )}
              </div>

              {validationState.emailCodeVisible &&
                !validationState.isEmailVerified && (
                  <div className={`form-group ${styles["form-group"]}`}>
                    <label htmlFor="emailCode" className="form-label">
                      <i className="fa-regular fa-envelope"></i>&nbsp;인증코드
                      입력
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
                        {Math.floor(validationState.timer / 60)
                          .toString()
                          .padStart(2, "0")}
                        :
                        {Math.floor(validationState.timer % 60)
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
                    value={formState.password}
                    onChange={handleInputChange}
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
                {validationState.passwordError && (
                  <p className={styles["alert-text"]}>
                    {validationState.passwordError}
                  </p>
                )}
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
                    name="passwordAgain"
                    value={formState.passwordAgain}
                    onChange={handleInputChange}
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
                {validationState.passwordAgainError && (
                  <p className={styles["alert-text"]}>
                    {validationState.passwordAgainError}
                  </p>
                )}
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
                value={formState.username}
                onChange={handleInputChange}
              />
              {validationState.nameError && (
                <p className={styles["alert-text"]}>
                  {validationState.nameError}
                </p>
              )}
            </div>

            <div className={`form-group ${styles["form-group"]}`}>
              <label htmlFor="birth" className="form-label">
                <i className="fa-regular fa-calendar">&nbsp;</i>생년월일
              </label>
              <input
                type="date"
                className="form-control"
                id="birth"
                placeholder="생년월일 입력"
                name="birth"
                value={formState.birth}
                onChange={handleInputChange}
              />
              {validationState.birthError && (
                <p className={styles["alert-text"]}>
                  {validationState.birthError}
                </p>
              )}
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
                    checked={formState.gender === "men"}
                    onChange={handleInputChange}
                    style={{ position: "absolute", opacity: 0 }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="men"
                    style={buttonStyle(formState.gender === "men")}
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
                    checked={formState.gender === "women"}
                    onChange={handleInputChange}
                    style={{ position: "absolute", opacity: 0 }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="women"
                    style={buttonStyle(formState.gender === "women")}
                  >
                    여자
                  </label>
                </div>
              </div>
              {validationState.genderError && (
                <p className={styles["alert-text"]}>
                  {validationState.genderError}
                </p>
              )}
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
                    value={formState.phone}
                    onChange={handleInputChange}
                    disabled={validationState.isPhoneVerified} // 전화번호 인증 시 입력 비활성화
                  />
                  {!validationState.isPhoneVerified && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSendPhoneCode}
                    >
                      인증번호 발송
                    </button>
                  )}
                </div>
                {validationState.phoneError && (
                  <p className={styles["alert-text"]}>
                    {validationState.phoneError}
                  </p>
                )}
              </div>

              {validationState.phoneCodeVisible &&
                !validationState.isPhoneVerified && (
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
                        {Math.floor(validationState.phoneTimer / 60)
                          .toString()
                          .padStart(2, "0")}
                        :
                        {Math.floor(validationState.phoneTimer % 60)
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
              {validationState.postcodeError && (
                  <p className={styles["alert-text"]}>
                    {validationState.postcodeError}
                  </p>
              )}
            </div>

            <div className="btn-group d-flex justify-content-between">
              <a href="/auth/register" className="btn btn-primary me-2 rounded">
                이전
              </a>
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
