import React, { useState, useEffect } from 'react';
import RingLoader from 'react-spinners/RingLoader';
import styles from '@/styles/interview/interviewLoading.module.css';

const LoadingOverlay = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = [
    'AI가 사용자의 이력서를 분석하고 있습니다',
    'AI가 이력서를 바탕으로 질문을 생성하고 있습니다',
    '잠시만 기다려주세요',
    '이제 곧 질문을 보실 수 있습니다'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 10000); // 10초마다 문구 변경

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      <RingLoader color="#2397d3" size={90} speedMultiplier={1.25} />
      <div className={styles.loadingText}>
        {messages[currentMessageIndex]}
      </div>
    </div>
  );
};

export default LoadingOverlay;