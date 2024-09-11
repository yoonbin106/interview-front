import React, { useRef, useEffect, useState } from 'react';
import { BsRobot } from "react-icons/bs";
import { RiUserHeartFill } from "react-icons/ri";
import { format } from 'date-fns';
import LinearProgressWithLabel from '@/components/bot/linearProgressWithLabel'; 
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import TextToSpeech from './textToSpeech';
import InteractiveOptions from './interactiveOption';

import styles from '@/styles/bot/botMessages.module.css';

// BotMessages 컴포넌트: 채팅 메시지를 표시하고 관리합니다.
const BotMessages = ({ messages, feedbacks, addFeedback, isGenerating, onOptionSelect, isUserTyping }) => {
  // messagesEndRef: 메시지 목록의 끝을 참조하는 ref입니다.
  const messagesEndRef = useRef(null);  
  // progress: 메시지 생성 중 표시되는 프로그레스 바의 현재 값입니다.
  const [progress, setProgress] = useState(10);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동시키는 useEffect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUserTyping]);
  
  // 프로그레스 바 애니메이션을 위한 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 타임스탬프를 포맷팅하는 함수
  const formatTime = (timestamp) => {
    // timestamp가 유효한 값인지 확인
    if (!timestamp) return '';
    try {
      // timestamp가 문자열이 아닌 경우 (예: Date 객체) 처리
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Invalid timestamp:', timestamp, error);
      return '';
    }
  };

  // 키워드 하이라이팅 함수
  const highlightKeywords = (text) => {
    const keywords = ['important', 'crucial', 'significant', 'key', 'essential'];
    let highlightedText = text;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="${styles.highlight}">$&</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className={styles.botMessages}>
      {/* 메시지 목록을 순회하며 각 메시지를 렌더링합니다. */}
      {messages.map((message, index) => (
        <div key={index} className={`${styles.messageContainer} ${styles[message.sender]}`}>
          {/* 사용자 아바타 */}
          {message.sender === 'user' && <div className={styles.userAvatar}><RiUserHeartFill /></div>}
          {/* 봇 아바타 */}
          {message.sender === 'bot' && <div className={styles.botAvatar}><BsRobot /></div>}          
          <div className={styles.messageContent}>
            {/* 메시지 내용을 키워드 하이라이팅과 함께 표시 */}
            {highlightKeywords(message.text)}
            {/* 봇 메시지에 대해 Text-to-Speech 기능 추가 */}
            {message.sender === 'bot' && <TextToSpeech text={message.text} />}
            {/* 인터랙티브 옵션이 있는 경우 표시 */}
            {message.sender === 'bot' && message.options && 
                <InteractiveOptions options={message.options} onSelect={onOptionSelect} />
            }
            {/* 봇 메시지에 대한 피드백 버튼 */}
            {message.sender === 'bot' && message.answerId && (
              <div className={styles.messageActions}>
                {!feedbacks[message.answerId] && (
                  <>
                    <button
                      onClick={() => addFeedback(message.answerId, true)}
                      className={styles.feedbackButton}
                      aria-label="Like">
                      <ThumbUpOffAltIcon />
                    </button>
                    <button
                      onClick={() => addFeedback(message.answerId, false)}
                      className={styles.feedbackButton}
                      aria-label="Dislike">
                      <ThumbDownOffAltIcon />
                    </button>
                  </>
                )}
                {/* 피드백이 이미 주어진 경우 아이콘 표시 */}
                {feedbacks[message.answerId] === 'liked' && (
                  <ThumbUpAltIcon style={{ color: '#5A8AF2' }} />
                )}
                {feedbacks[message.answerId] === 'disliked' && (
                  <ThumbDownAltIcon style={{ color: '#FF0000' }} />
                )}
              </div>
            )}
          </div>
          <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
        </div>
      ))}
      {/* 메시지 생성 중일 때 표시되는 로딩 인디케이터 */}
      {isGenerating && (
        <div className={`${styles.messageContainer} ${styles.bot}`}>
          <div className={styles.botAvatar} aria-hidden="true">
            <BsRobot />
          </div>
          <div className={`${styles.messageContent} ${styles.generating}`}>
            <LinearProgressWithLabel value={progress}/>
          </div>
        </div>
      )}
      {/* 사용자가 입력 중일 때 표시되는 타이핑 인디케이터 */}
      {isUserTyping && (
        <div className={`${styles.messageContainer} ${styles.user} ${styles.typing}`}>
          <div className={styles.userAvatar} aria-hidden="true">
            <span className={styles.typingDot}></span>
            <span className={styles.typingDot}></span>
            <span className={styles.typingDot}></span>
            <RiUserHeartFill />
          </div>
        </div>
      )}
      {/* 메시지 목록의 끝을 나타내는 div */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default BotMessages;