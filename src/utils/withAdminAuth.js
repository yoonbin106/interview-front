import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import authStore from '@/stores/authStore';

export const withAdminAuth = (WrappedComponent, requiredRole = 'admin') => {
    return function AuthGuard(props) {
        const router = useRouter();
        const [loading, setLoading] = useState(true);  // 로딩 상태를 추가합니다.

        useEffect(() => {
            // 로그인 상태와 관리자 권한을 확인합니다.
            authStore.checkLoggedIn();

            // 로딩 상태를 잠시 유지하며 권한을 확인
            if (!authStore.loggedIn) {
                // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
                router.push('/auth');
            } else if (requiredRole === 'admin' && !authStore.isAdmin) {
                // 관리자가 아닌 경우 403 페이지로 리다이렉트
                router.push('http://localhost:3000/adminPage/adminAccessDeniedPage');
            } else {
                // 모든 확인이 끝나면 로딩 상태를 false로 변경
                setLoading(false);
            }
        }, [router, authStore.loggedIn, authStore.isAdmin]); // authStore 상태에 의존

        // 로딩 중일 때는 아무것도 렌더링하지 않음 (또는 로딩 스피너 표시)
        if (loading) {
            return <div>Loading...</div>;
        }
        
        // 권한이 있는 경우에만 컴포넌트를 렌더링
        return <WrappedComponent {...props} />;
    };
};
