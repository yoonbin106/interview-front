import React from 'react';

const GoogleLogin = () => {

    const iconStyle = {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        cursor: 'pointer'
    };

    const googleHandleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_API_GOOGLE_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = 'http://localhost:8080/login/google/callback'; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.
    
        // 구글 OAuth 인증 URL을 생성합니다.
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&scope=email profile`;
    
        // 생성된 URL로 리다이렉션합니다.
        window.location.href = googleAuthUrl;
    };

    return (
        <img style={iconStyle} src="/images/googleButton.png" alt="Google" onClick={googleHandleLogin}/>
    );
};

export default GoogleLogin;