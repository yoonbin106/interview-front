import React from 'react';

const KakaoLogin = () => {

    const iconStyle = {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        cursor: 'pointer'
    };
    
    const kakaoHandleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_API_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = 'http://localhost:8080/login/kakao/callback'; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.

        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&through_account=true`;
    };

    return (
        <img style={iconStyle} src="/images/kakaoButton.png" onClick={kakaoHandleLogin} alt="Kakao" />
    );
};

export default KakaoLogin;
