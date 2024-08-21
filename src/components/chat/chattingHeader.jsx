import React from 'react';
import { PiWechatLogoBold } from "react-icons/pi";
import { GiExitDoor } from "react-icons/gi";
import { FaMoon, FaSun } from 'react-icons/fa';
import styles from '../../styles/chat/chattingHeader.module.css';

const ChattingHeader = ({ closeChatting, isDarkMode, toggleDarkMode }) => {
  return (
    <div className={styles.chattingHeader}>
      <span>
        <PiWechatLogoBold />
      </span>
      <div>
        &nbsp;&nbsp;&nbsp;Chatting
      </div>
      <div>
        <div className={styles.darkModeButton}>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <div className={styles.closeButton}>
          <button onClick={closeChatting} aria-label="Close chat">
            <GiExitDoor />
          </button>
        </div>


      </div>
    </div>
  );
};

export default ChattingHeader;
