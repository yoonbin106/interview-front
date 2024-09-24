import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      <Image 
        src="/images/interviewLoading.gif"
        alt="Loading"
        width={900}
        height={900}
        unoptimized
      />
      <div className={styles.loadingText}>
        {messages[currentMessageIndex]}
      </div>
    </div>
  );
};

export default LoadingOverlay;