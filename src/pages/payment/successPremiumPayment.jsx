import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import { paymentCheck } from 'api/user';

const successPremiumPayment = observer(() => {
    const router = useRouter();
    const { authStore, userStore } = useStores();

    useEffect(() => {
        async function fetchData() {
            if (!router.isReady) return;
    
            const { orderId, paymentKey, amount } = router.query;
            const id = userStore.id;
    
            if (amount == parseInt(process.env.NEXT_PUBLIC_API_TOSS_PREMIUM_AMOUNT, 10)) {
                alert('결제 값 일치!');
                console.log(orderId);
                console.log(paymentKey);
                console.log(amount);
                console.log(id);
                try {
                    const response = await paymentCheck(orderId, paymentKey, amount, id);
                    if (response.status === 200) {
                        router.push('/payment');
                    }
                } catch (error) {
                    console.error('결제 결과 확인 중 오류:', error);
                    alert('결제 결과 확인 중 오류가 발생했습니다.');
                }
            }
        }
    
        fetchData();
    }, [router.isReady, router.query]);

    return (
        <div>
            <p>결제 성공! 리다이렉트 중...</p>
        </div>
    );
});

export default successPremiumPayment;