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
        {messages.map((message) => (

          message.senderId == userStore.id ? (
            <div key={message.id} className={`${styles.messageContainer} ${styles.my}`}>
              <div className={styles.messageContent}>
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div key={message.id} className={`${styles.messageContainer} ${styles.others}`}>

              <div className={styles.recieverAvatar} aria-hidden="true">
                <Avatar src={getSenderProfileImage(message.senderId)} sx={{ width: 50, height: 50 }}></Avatar>
                {/* 보내는 사람 아이디: {message.senderId} */}
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
    </>

  );
};

export default ChattingMessages;