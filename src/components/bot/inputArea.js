import React,{useState, useEffect} from 'react';
import { FaMicrophoneLines, FaMicrophoneSlash } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import styles from '@/styles/bot/inputArea.module.css';

const InputArea = ({ inputMessage, setInputMessage, isListening, startListening, stopListening, sendMessage, isDarkMode, setIsUserTyping }) => {

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setInputMessage(newMessage);
    setIsUserTyping(newMessage.length > 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      setIsUserTyping(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage();
    setInputMessage('');  // Clear the input after sending
    setIsUserTyping(false);
  };


  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`${styles.inputArea} ${isDarkMode ? styles.dark : ''}`}>
      <textarea
        className={styles.inputTextarea}
        value={inputMessage}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="궁금한 사항이 있으면 여기에 입력해주세요.."
      />
       <button 
        className={styles.sendButton}
        onClick={handleSendMessage}
      >
        <BsSendFill />
      </button>
      <button 
        className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
        onClick={toggleListening}
      >
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophoneLines />}
      </button>
    </div>
  );
};

export default InputArea;