import React, { useRef, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/chat/chattingMessages.module.css';
import { getAllUsers } from 'api/user';


const ChattingMessages = ({ messages, userStore }) => {
  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState([]);

  const getAllUserList = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    }
    catch (error) {
      console.log('Error: ', error);
    }
  }

  const getSenderProfileImage = (senderId) => {
    const user = users.find((user) => user.id == senderId);
    // return user ? user.profileImage : '';
    // console.log('user: ', user);
    return user ? user.profileImage : '';
  };

  useEffect(() => {
    getAllUserList()
  }, []);

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
  );
};

export default ChattingMessages;