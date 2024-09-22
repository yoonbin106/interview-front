import React, { useRef, useEffect, useState, useCallback } from 'react';
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
const BotMessages = ({ messages, feedbacks, addFeedback, isGenerating, isUserTyping, setMessages }) => {
  
  const messagesEndRef = useRef(null);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  const [prevIsGenerating, setPrevIsGenerating] = useState(false);
  const [progress, setProgress] = useState(10);
  const [highlightedMessages, setHighlightedMessages] = useState([]);

  useEffect(() => {
    const newHighlightedMessages = messages.map(message => ({
      ...message,
      highlightedText: highlightKeywords(message.text)
    }));
    setHighlightedMessages(newHighlightedMessages);
  }, [messages]);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > prevMessagesLength) {
      scrollToBottom();
      setPrevMessagesLength(messages.length);
    }
  }, [messages, prevMessagesLength, scrollToBottom]);

  useEffect(() => {
    if (isGenerating && !prevIsGenerating) {
      // 봇이 답변 생성을 시작할 때
      scrollToBottom();
    } else if (!isGenerating && prevIsGenerating) {
      // 봇이 답변 생성을 완료했을 때
      setTimeout(scrollToBottom, 100); // 약간의 지연을 주어 메시지가 렌더링될 시간을 줍니다
    }
    setPrevIsGenerating(isGenerating);
  }, [isGenerating, prevIsGenerating, scrollToBottom]);
  
  useEffect(() => {
    if (messages.length > 0 || isUserTyping) {
      scrollToBottom();
    }
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
  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Invalid timestamp:', timestamp, error);
      return '';
    }
  }, []);

  const highlightKeywords = useCallback((text) => {
    const keywords = ['중요한', '결정적인', '핵심', '필수적인', '중대한', '면접', '취업', '이력서','챗봇', 'force', 'focusjob'];
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const highlightedText = text.replace(regex, `<span class="${styles.highlight}">$1</span>`);
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  }, []);

  const handleOptionSelect = useCallback((option) => {
    console.log('Selected option:', option);
    setMessages(prevMessages => [...prevMessages, { text: `Selected option: ${option}`, sender: 'user' }]);
    // 필요한 경우 여기서 추가 로직을 구현할 수 있습니다.
  }, [setMessages]);

  return (
    <div className={styles.botMessages}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.messageContainer} ${styles[message.sender]}`}>
          {message.sender === 'user' && (
            <div className={styles.userAvatar}> 
              <Image 
                src="/images/user.gif"
                alt="user"
                width={70}
                height={70}
                unoptimized
              />
            </div>
          )}
          {message.sender === 'bot' && (
            <div className={styles.botAvatar}>
              <Image 
                src="/images/virtualAssistant.gif"
                alt="bot"
                width={80}
                height={80}
                unoptimized
              />
            </div>
          )}          
          <div className={styles.messageContent}>
            {highlightKeywords(message.text)}
            {message.sender === 'bot' && <TextToSpeech text={message.text} />}
            {message.sender === 'bot' && message.options && 
              <InteractiveOptions options={message.options} onSelect={handleOptionSelect} />
            }
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

export default React.memo(BotMessages);