import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';
import { useRouter } from 'next/router';
import authStore from 'stores/authStore';
import userStore from 'stores/userStore';

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: "http://localhost:8080"
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
    config => {
        // '/reissue' 요청은 인터셉터에서 액세스 토큰을 추가하지 않도록 합니다.
        if (config.url !== '/reissue') {
            if (typeof window !== 'undefined') { // 브라우저 환경인지 확인
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

const refreshToken = async () => {
    try {
        if (typeof window !== 'undefined') { // 브라우저 환경인지 확인
            const refreshToken = localStorage.getItem('refresh');
            const response = await instance.post('/reissue', null, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });
            const token = response.headers['authorization'] || response.headers['Authorization'];
            const pureToken = token.split(' ')[1];
            localStorage.setItem('token', pureToken);
            return pureToken;
        }
    } catch (error) {
        // 에러 응답을 확인합니다.
        if (error.response && error.response.data === 'refresh token expired') {
            // 리프레시 토큰이 만료된 경우 로그아웃 처리
            tokenlogout();
        } else {
            // 다른 종류의 에러 처리
            console.error('An error occurred:', error);
        }
    }
};

const tokenlogout = () => {
    if (typeof window !== 'undefined') { // 브라우저 환경인지 확인
        localStorage.clear(); // 로컬 스토리지 비우기
    }
    authStore.setLoggedIn(false);
    userStore.setEmail('');
    userStore.setUsername('');
    userStore.setAddress('');
    userStore.setGender('');
    userStore.setBirth('');
    userStore.setPhone('');
    userStore.setProfile('');
    userStore.setId('');
    // window.location.href = '/';
};

// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => response, // 정상 응답
    async (error) => {
        const originalRequest = error.config;

        // 401 오류가 발생하고, 이미 재시도를 한 적이 없다면
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 재시도 했음을 표시

            // 토큰을 갱신하고 재시도
            const newAccessToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // 원래 요청을 다시 수행
            return instance(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default instance;