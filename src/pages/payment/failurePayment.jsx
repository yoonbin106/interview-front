// pages/payment/failurePayment.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const FailurePayment = () => {
    const router = useRouter();
    const { code, message, orderId } = router.query;

    useEffect(() => {
        if (code) {
            // 에러 메시지 정의
            const errorMessages = {
                'PAY_PROCESS_CANCELED': '결제가 취소되었습니다.',
                'PAY_PROCESS_ABORTED': '결제가 실패하였습니다.',
                'REJECT_CARD_COMPANY': '카드 정보에 문제가 있습니다.',
                // 기타 에러 코드에 대한 메시지를 추가할 수 있습니다.
            };

            // 에러 코드에 따라 알림 메시지를 선택
            const userMessage = errorMessages[code] || message || '알 수 없는 오류가 발생했습니다.';

            // 사용자에게 알림 표시 및 확인 후 리다이렉트
            alert(userMessage);
            router.push('/payment');
        }
    }, [code, message, router]);

    return (
        <div>
            <p>결제 실패! 리다이렉트 중...</p>
        </div>
    );
};

export default FailurePayment;