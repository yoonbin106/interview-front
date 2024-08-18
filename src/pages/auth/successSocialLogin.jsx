import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';

const LoginSuccess = observer(() => {
    const router = useRouter();
    const { authStore, userStore } = useStores();

    useEffect(() => {
        if (!router.isReady) return;  // 라우터가 준비되었는지 확인

        const { 
            access, 
            refresh, 
            isAdmin, 
            id, 
            gender = '', 
            username, 
            email, 
            birth = '', 
            phone = '',
            profile 
        } = router.query;

        if (access && refresh) {
            if (typeof window !== 'undefined') {
                // JWT 토큰과 사용자 정보를 로컬 스토리지에 저장
                localStorage.setItem("token", access);
                localStorage.setItem("isAdmin", isAdmin === 'true');
                localStorage.setItem("refresh", refresh);

                // URL 인코딩된 username을 디코딩하여 저장
                const decodedUsername = decodeURIComponent(username);

                // 스토어에 데이터 설정
                userStore.setId(id);
                userStore.setEmail(email);
                userStore.setUsername(decodedUsername);
                userStore.setAddress('');
                userStore.setGender(gender);
                userStore.setBirth(birth);
                userStore.setPhone(phone);
                userStore.setProfile(profile);
                authStore.setIsAdmin(isAdmin === 'true');
                authStore.checkLoggedIn();
            }

            // 원하는 페이지로 리다이렉트
            router.push('/');
        }
    }, [router.isReady, router.query]);

    return (
        <div>
            <p>로그인 성공! 리다이렉트 중...</p>
        </div>
    );
});

export default LoginSuccess;