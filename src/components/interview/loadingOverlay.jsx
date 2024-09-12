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
      try {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'ko-KR';
        window.speechSynthesis.speak(speech);
      } catch (error) {
        console.error('Speech synthesis error:', error);
      }
    } else {
      console.error('Speech synthesis not supported');
    }
  }, []);

  useEffect(() => {
    let interval;
    const speakAndSetInterval = () => {
      speakText(messages[currentMessageIndex]);
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % messages.length;
          speakText(messages[newIndex]);
          return newIndex;
        });
      }, 10000);
    };

    speakAndSetInterval();

    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [messages, speakText, currentMessageIndex]);

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