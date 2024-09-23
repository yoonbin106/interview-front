import React, { useState, useEffect, useCallback } from 'react';
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

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // 이전 음성을 취소
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'ko-KR';
      window.speechSynthesis.speak(speech);
    }
  }, []);

  useEffect(() => {
    // 첫 번째 메시지 즉시 재생
    speakText(messages[currentMessageIndex]);

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % messages.length;
        return newIndex;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 메시지가 변경될 때마다 새로운 음성 출력
  useEffect(() => {
    speakText(messages[currentMessageIndex]);
  }, [currentMessageIndex, speakText, messages]);

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