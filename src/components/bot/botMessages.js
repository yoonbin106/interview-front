import React, { useRef, useEffect } from 'react';
import { FcLike, FcDislike } from "react-icons/fc";
import { BsRobot } from "react-icons/bs";
import { RiUserHeartFill } from "react-icons/ri";
import styles from '@/styles/bot/botMessages.module.css';

const BotMessages = ({ messages, feedbacks, addFeedback, isGenerating }) => {
  const messagesEndRef = useRef(null);

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
                <button
                  onClick={() => addFeedback(message.answerId, true)}
                  className={`${styles.feedbackButton} ${feedbacks[message.answerId] === 'liked' ? 'active' : ''}`}
                  aria-label="Like">
                  <FcLike />
                </button>
                <button
                  onClick={() => addFeedback(message.answerId, false)}
                  className={`${styles.feedbackButton} ${feedbacks[message.answerId] === 'disliked' ? 'active' : ''}`}
                  aria-label="Dislike">
                  <FcDislike/>
                </button>
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
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default BotMessages;