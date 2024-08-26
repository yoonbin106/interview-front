import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/main.module.css';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import { useRouter } from "next/router";

const clientKey = process.env.NEXT_PUBLIC_API_TOSS_CLIENT_ID;
const customerKey = uuidv4();

const BasicPaymentCheckoutPage = observer(() => {
  const { authStore, userStore } = useStores();
  const [payment, setPayment] = useState(null);
  const router = useRouter(); // useRouter 훅 사용
  
  const [amount] = useState({
    currency: "KRW",
    value: parseInt(process.env.NEXT_PUBLIC_API_TOSS_BASIC_AMOUNT, 10),
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  function selectPaymentMethod(method) {
    setSelectedPaymentMethod(method);
  }

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const payment = tossPayments.payment({
          customerKey,
        });
        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }
    fetchPayment();
  }, [clientKey, customerKey]);

  async function requestPayment() {
    if (!authStore.loggedIn) {
      router.push("/payment");
      return;
    }

    try {
      await payment.requestPayment({
        method: "CARD", // 카드 및 간편결제
        amount: amount,
        orderId: uuidv4(), // 고유 주문번호
        orderName: "베이직플랜",
        successUrl: `http://localhost:3000/payment/successBasicPayment`, // 결제 요청이 성공하면 리다이렉트되는 URL
        failUrl: "http://localhost:3000/auth", // 결제 요청이 실패하면 리다이렉트되는 URL
        customerEmail: userStore.email,
        customerName: userStore.username,
        customerMobilePhone: userStore.phone,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT", // 통합결제창 여는 옵션
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
      router.push("/payment");
    }
  }

  return (
    <button className={styles.ticketbutton} onClick={() => requestPayment()}>
      결제하기
    </button>
  );
});

export default BasicPaymentCheckoutPage;