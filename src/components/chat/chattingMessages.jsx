import React, { useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/chat/chattingMessages.module.css';



const ChattingMessages = ({ messages, userStore, onBack }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chattingMessages}>
      
      

      {messages.map((message, index) => (

        message.sender === userStore.username ? (
          <div key={index} className={`${styles.messageContainer} ${styles.my}`}>
            <div className={styles.messageContent}>
              <p>{message.text}</p>
            </div>
          </div>
        ) : (
          <div key={index} className={`${styles.messageContainer} ${styles.others}`}>

            <div className={styles.recieverAvatar} aria-hidden="true">
              <Avatar sx={{ width: 50, height: 50 }}></Avatar>
            </div>

            <div className={styles.othersMessageInfo}>

              <div className={styles.othersMessageSender}>
                {message.sender}
              </div>

              <div>
                <div className={styles.messageContent}>
                  {message.text}
                </div>
              </div>

            </div>
          </div>
        )

      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChattingMessages;