import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
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
import { BsRobot } from 'react-icons/bs';

// BotMessages 컴포넌트: 채팅 메시지를 표시하고 관리합니다.
const BotMessages = ({ messages, feedbacks, addFeedback, isGenerating, onOptionSelect, isUserTyping }) => {
  
  const messagesEndRef = useRef(null);  
  const [progress, setProgress] = useState(10);
  const [highlightedMessages, setHighlightedMessages] = useState([]);

  useEffect(() => {
    const newHighlightedMessages = messages.map(message => ({
      ...message,
      highlightedText: highlightKeywords(message.text)
    }));
    setHighlightedMessages(newHighlightedMessages);
  }, [messages]);
  
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
    if (!timestamp) return '';
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Invalid timestamp:', timestamp, error);
      return '';
    }
  };

  // 키워드 하이라이팅 함수
  const highlightKeywords = (text) => {
    const keywords = ['중요한', '결정적인', '핵심', '필수적인', '중대한', '면접', '취업', '이력서','챗봇', 'force', 'focusjob'];
    let highlightedText = text;

    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="${styles.highlight}">$1</span>`);
    });
  
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className={styles.botMessages}>
      {/* 메시지 목록을 순회하며 각 메시지를 렌더링합니다. */}
      {messages.map((message, index) => (
        <div key={index} className={`${styles.messageContainer} ${styles[message.sender]}`}>
          {/* 사용자 아바타 */}
          {message.sender === 'user' && <div className={styles.userAvatar}> 
          <Image 
            src="/images/user.gif"
            alt="user"
            width={70}
            height={70}
            unoptimized
      /></div>}
          {/* 봇 아바타 */}
          {message.sender === 'bot' && <div className={styles.botAvatar}>
          <Image 
            src="/images/virtualAssistant.gif"
            alt="bot"
            width={80}
            height={80}
            unoptimized
      /></div>}          
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default BotMessages;