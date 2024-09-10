import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/login/login.module.css';
import { login, getProfileImage } from '@/api/user';
import { handleAxiosError } from '@/api/errorAxiosHandle';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';
import KakaoLogin from '@/components/auth/kakaoLogin';
import NaverLogin from '@/components/auth/naverLogin';
import GoogleLogin from '@/components/auth/googleLogin';
import mqtt from 'mqtt';

const Login = observer(() => {
  const router = useRouter();
  const { authStore, userStore, mqttStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!authStore) {
      console.error('authStore is undefined');
      return;
    }
    // 로그인 상태를 확인
    authStore.checkLoggedIn();

    if (authStore.loggedIn) {
      // 로그인된 상태라면 메인 페이지로 이동
      router.push('/');
    }
  }, [authStore, router]);

  const validateForm = (formObject) => {
    let isValid = true;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formObject.email) {
      setEmailError('* 이메일: 필수정보입니다');
      isValid = false;
    } else if (!emailPattern.test(formObject.email)) {
      setEmailError('* 이메일 형식이 올바르지 않습니다');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!formObject.password) {
      setPasswordError('* 비밀번호: 필수정보입니다');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    console.log(formObject);

    if (!validateForm(formObject)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(formObject, authStore, userStore);
      console.log(response);

      if (response.status === 200) {
        // 로그인 성공 시 프로필 이미지를 불러옵니다.
        await getProfileImage(response.username, userStore);

        try {
          const mqttClient = mqtt.connect('mqtt://192.168.0.137:1884');
          mqttStore.setMqttClient(mqttClient);

          mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker');
            // setIsConnected(true);
          });
        } catch (err) {
          console.log('MQTT CONNECT ERROR: ', err);
        }

        // 로그인 성공 후 홈 페이지로 리다이렉션
        router.push('/');
      } else {
        setError('로그인 실패: ' + response.status);
      }
    } catch (error) {
      // 에러 핸들링
      handleAxiosError(error);
      setError('로그인 실패: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const iconStyle = {
    width: '40px',
    height: '40px',
    objectFit: 'cover'
  };

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.loginBox}>
        <h2 className="mb-4">로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">이메일</label>
            <input type="email" className="form-control" id="email" name="email" placeholder="이메일 입력" />
            {emailError && <p className={styles['alert-text']}>{emailError}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">비밀번호</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="비밀번호 입력" />
            {passwordError && <p className={styles['alert-text']}>{passwordError}</p>}
          </div>
          <div>
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">로그인 상태 유지</label>
            </div>
          </div>
          <button type="submit" className="btn btn-dark w-100 mb-3">로그인</button>
        </form>
        <div className="d-flex justify-content-around mb-4">
          <NaverLogin />
          <KakaoLogin />
          <GoogleLogin />
        </div>
        <div className="d-flex justify-content-between mt-3">
          <a href="./auth/register" className={`${styles.link} text-decoration-none`}>회원가입</a>
          <div>
            <a href="/auth/findId" className={`${styles.link} text-decoration-none me-3`}>아이디 찾기</a>
            <a href="/auth/findPassword" className={`${styles.link} text-decoration-none`}>비밀번호 찾기</a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;