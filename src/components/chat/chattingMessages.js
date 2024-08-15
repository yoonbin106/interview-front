import React, { useRef, useEffect } from 'react';
import { RiUserHeartFill } from "react-icons/ri";
import styles from '../../styles/chat/chattingMessages.module.css';

const ChattingMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chattingMessages}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.messageContainer} ${styles[message.sender]}`}>
          {message.sender === 'user' && <div className={styles.userAvatar} aria-hidden="true">

          </div>}
          {message.sender === 'bot' && <div className={styles.botAvatar} aria-hidden="true">
            <RiUserHeartFill />
          </div>}
          <div className={styles.messageContent}>
            <p>{message.text}</p>

            {/* 
            // 핱트 벝튼
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
            */}



          </div>
          {/* 
          // 텍스트 입력중 애니메이션
          <div className={`${styles.messageContent} ${styles.generating}`}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          */}

        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChattingMessages;