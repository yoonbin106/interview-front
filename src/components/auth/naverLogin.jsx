import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const NaverLogin = () => {

    const iconStyle = {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        cursor: 'pointer'
    };

    const naverHandleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_API_NAVER_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = 'http://localhost:8080/login/naver/callback'; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.
        
        const state = uuidv4(); // UUID를 사용하여 고유한 상태 토큰을 생성합니다.
        localStorage.setItem('naver_login_state', state); // 이 값을 로컬 스토리지에 저장합니다.
    
        // 네이버 OAuth 인증 URL을 생성합니다.
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&state=${encodeURIComponent(state)}`;
    
        // 생성된 URL로 리다이렉션합니다.
        window.location.href = naverAuthUrl;
    };

    return (
        <img style={iconStyle} src="/images/naverButton.png" alt="Naver" onClick={naverHandleLogin}/>
    );
};

export default NaverLogin;