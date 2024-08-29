import React, { useRef, useEffect, useState } from 'react';
import { FcLike, FcDislike } from "react-icons/fc";
import { BsRobot } from "react-icons/bs";
import { RiUserHeartFill } from "react-icons/ri";
import LinearProgressWithLabel from '@/components/bot/linearProgressWithLabel'; 
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import styles from '@/styles/bot/botMessages.module.css';

const BotMessages = ({ messages, feedbacks, addFeedback, isGenerating }) => {
  const messagesEndRef = useRef(null);  
  const [progress, setProgress] = useState(10);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
      }, 800);
      return () => {
        clearInterval(timer);
      };
    }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.botMessages}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.messageContainer} ${styles[message.sender]}`}>
          {message.sender === 'user' && <div className={styles.userAvatar} aria-hidden="true">
            <RiUserHeartFill />
          </div>}
          {message.sender === 'bot' && <div className={styles.botAvatar} aria-hidden="true">
            <BsRobot />
          </div>}
          <div className={styles.messageContent}>
            <p>{message.text}</p>
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default BotMessages;