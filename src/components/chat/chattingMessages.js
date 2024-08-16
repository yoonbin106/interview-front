import React, { useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/chat/chattingMessages.module.css';

const ChattingMessages = ({ messages, userInfo }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chattingMessages}>
      {messages.map((message, index) => (

        message.sender === userInfo.username ? (
          <div key={index} className={`${styles.messageContainer} ${styles.my}`}>
            <div className={styles.messageContent}>
              <p>{message.text}</p>
            </div>
          </div>
        ) : (
          <div key={index} className={`${styles.messageContainer} ${styles.others}`}>

            <div className={styles.recieverAvatar} aria-hidden="true">
              <Avatar>Y</Avatar>
            </div>
            <div className={styles.messageContent}>
                <p>{message.text}</p>
              </div>

{/*               
            <div className={styles.othersMessageContent}>
              <div className={styles.othersMessageSender}>{message.sender}</div>
              
            </div> */}


            {/*             
            <div className={styles.othersMessageSender}>{message.sender}</div>
            <div className={styles.messageContent}>
              <p>{message.text}</p>
            </div> */}

            {/* 

          
              <div className={styles.recieverAvatar} aria-hidden="true">
                <Avatar>Y</Avatar>
              </div>
              <div className={styles.othersMessageContent}>
                <div className={styles.othersMessageSender}>{message.sender}</div>
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                </div>
              </div>
            */}

          </div>
        )


        // <div key={index} className={`${styles.messageContainer} ${message.sender === userInfo.username ? styles.my : styles.others}`}>
        //   {message.sender !== userInfo.username && <div className={styles.recieverAvatar} aria-hidden="true">
        //   <Avatar>Y</Avatar>
        //   {/* <div>{message.sender}</div> */}
        //   </div>}
        //   <div className={styles.messageContent}>
        //     <p>{message.text}</p>

        //   </div>
        // </div>



      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

{/* 
          // 텍스트 입력중 애니메이션
          <div className={`${styles.messageContent} ${styles.generating}`}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          */}

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

export default ChattingMessages;