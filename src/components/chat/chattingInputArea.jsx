import React from 'react';
import { BsSendFill } from "react-icons/bs";
import styles from '../../styles/chat/chattingInputArea.module.css';

const ChattingInputArea = ({ inputMessage, setInputMessage, sendMessage, isDarkMode }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`${styles.inputArea} ${isDarkMode ? 'styles.dark' : ''}`}>
      <textarea
        className={styles.inputTextarea}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="메시지를 입력하세요..."
      />
      <button 
        className={styles.sendButton}
        onClick={sendMessage}
      >
        <BsSendFill />
      </button>
    </div>
  );
};

export default ChattingInputArea;