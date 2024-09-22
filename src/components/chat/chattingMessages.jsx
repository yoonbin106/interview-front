import React, { useRef, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/chat/chattingMessages.module.css';
import { getAllUsers } from 'api/user';

import { UserRoundPlus, Menu } from 'lucide-react';
import PopOver from './popOver';


const ChattingMessages = ({ messages, userStore, chatRoomTitle, users, usersInChatroom, currentChatRoomId }) => {
  const messagesEndRef = useRef(null);

  const getSenderProfileImage = (senderId) => {
    const user = users.find((user) => user.id == senderId);
    // return user ? user.profileImage : '';
    // console.log('user: ', user);
    return user ? user.profileImage : '';
  };
  
  const formatTime = (timestamp) => {

    // 마지막 메시지의 날짜
    const messageDate = new Date(timestamp);
    const now = new Date();

    // 마지막 메시지의 날짜가 오늘이면 시간만 반환
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 시간만 반환
    } else {
      // 어제 또는 그 이전이면 날짜와 시간 모두 반환
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 날짜와 시간 모두 반환
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);


  return (
    <>
      <div className={styles.chattingMessageHeader}>
        <div className={styles.chattingMessageTitle}>{chatRoomTitle}</div>
        <div className={styles.chattingMessageCreate}>
          <button>
            <UserRoundPlus />
          </button>
        </div>
        <div className={styles.chattingMessageSettings}>
          <button>
            {/* <Menu onClick={() => {getUsersInChatroom();}}/> */}
            <PopOver usersInChatroom={usersInChatroom} userStore={userStore} currentChatRoomId={currentChatRoomId}/>
          </button>
        </div>
      </div>

 

      <div className={styles.chattingMessages}>
        {messages.map((message, index) => (

          message.senderId == userStore.id ? (
            <div key={index} className={`${styles.messageContainer} ${styles.my}`}>
              <div className={styles.messageContent}>
                <p>{message.text}</p>
              </div>
              <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
            </div>
          ) : (
            <div key={index} className={`${styles.messageContainer} ${styles.others}`}>

              <div className={styles.recieverAvatar} aria-hidden="true">
                <Avatar src={getSenderProfileImage(message.senderId)} sx={{ width: 50, height: 50 }}></Avatar>
              </div>

              <div className={styles.othersMessageInfo}>
                <div className={styles.othersMessageSender}>
                  {message.sender}
                </div>
                <div className={styles.messageContentFlex}>
                  <div className={styles.messageContent}>
                    {message.text}
                  </div>
                  <div className={styles.messageTimeOther}>{formatTime(message.timestamp)}</div>
                </div>
              </div>
            
            </div>
          )
          

        ))}

        <div ref={messagesEndRef} />
      </div>
    </>

  );
};

export default ChattingMessages;