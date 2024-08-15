import React from 'react';
import { FaMicrophoneLines } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import styles from '@/styles/bot/inputArea.module.css';

const InputArea = ({ inputMessage, setInputMessage, isListening, startListening, sendMessage, isDarkMode }) => {
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
      <button 
        className={`${styles.micButton} ${isListening ? 'styles.listening' : ''}`}
        onClick={startListening}
      >
        <FaMicrophoneLines />
      </button>
    </div>
  );
};

export default InputArea;