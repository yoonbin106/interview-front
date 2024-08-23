import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';

const successPremiumPayment = observer(() => {
    const router = useRouter();
    const { authStore, userStore } = useStores();

    useEffect(() => {
        if (!router.isReady) return;  // 라우터가 준비되었는지 확인

        const { 
            orderId,
            paymentKey,
            amount
        } = router.query;

        if (amount == parseInt(process.env.NEXT_PUBLIC_API_TOSS_PREMIUM_AMOUNT, 10)) {
            alert('결제 값 일치!');
            router.push('/');
        }
    }, [router.isReady, router.query]);

    return (
        <div>
            <p>결제 성공! 리다이렉트 중...</p>
        </div>
    );
});

export default successPremiumPayment;