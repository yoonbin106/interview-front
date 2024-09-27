import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import { paymentCheck } from 'api/user';

const successBasicPayment = observer(() => {
    const router = useRouter();
    const { payStore, userStore } = useStores();
    
    useEffect(() => {
        async function fetchData() {
            if (!router.isReady) return;
    
            const { orderId, paymentKey, amount } = router.query;
            const id = userStore.id;
    
            if (amount == parseInt(process.env.NEXT_PUBLIC_API_TOSS_BASIC_AMOUNT, 10)) {
                try {
                    const response = await paymentCheck(orderId, paymentKey, amount, id);
                    if (response.status === 200) {
                        payStore.setPayApproved(response.data.approvedAt);
                        payStore.setOrderId(response.data.orderId);
                        payStore.setOrderName(response.data.orderName);
                        payStore.setPayMethod(response.data.payMethod);
                        payStore.setPrice(response.data.price);
                        payStore.setUseCount(response.data.useCount);
                        payStore.setUserId(response.data.userId.id);
                        payStore.setPaySecret(response.data.paySecret);
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

export default successBasicPayment;