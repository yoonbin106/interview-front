import React from 'react';
import { PiWechatLogoBold } from "react-icons/pi";
import { GiExitDoor } from "react-icons/gi";
import { FaMoon, FaSun } from 'react-icons/fa';
import styles from '@/styles/bot/botHeader.module.css';

const BotHeader = ({ endBot, isDarkMode, toggleDarkMode }) => {
  return (
    <div className={styles.botHeader}>
      <span className='botIcon'>
        <PiWechatLogoBold /> 
      </span>
        focusjob 챗봇 force
      <span>
      <button onClick={toggleDarkMode} className={styles.darkModeButton}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
      <button className={styles.closeButton} onClick={endBot} aria-label="Close chat">
        <GiExitDoor />
      </button>
        </span>
    </div>
  );
};

export default BotHeader;
