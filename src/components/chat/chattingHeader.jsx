import React from 'react';
import { PiWechatLogoBold } from "react-icons/pi";
import { GiExitDoor } from "react-icons/gi";
import { FaMoon, FaSun } from 'react-icons/fa';
import styles from '../../styles/chat/chattingHeader.module.css';

const ChattingHeader = ({ closeChatting, isDarkMode, toggleDarkMode }) => {
  return (
    <div className={styles.chattingHeader}>
      <span className='botIcon'>
        <PiWechatLogoBold /> 
      </span>Chatting
      <span>
      <button onClick={toggleDarkMode} className={styles.darkModeButton}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
      <button className={styles.closeButton} onClick={closeChatting} aria-label="Close chat">
        <GiExitDoor />
      </button>
        </span>
    </div>
  );
};

export default ChattingHeader;
