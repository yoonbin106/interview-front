import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophoneLines, FaMicrophoneSlash } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import styles from '@/styles/bot/inputArea.module.css';
import EmojiPicker from 'emoji-picker-react';

const InputArea = ({ inputMessage, setInputMessage, isListening, startListening, stopListening, sendMessage, isDarkMode, setIsUserTyping }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    setInputMessage(prevInput => prevInput + emojiObject.emoji);
  };

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setInputMessage(newMessage);
    setIsUserTyping(newMessage.length > 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage();
      setInputMessage('');
      setIsUserTyping(false);
      setShowEmojiPicker(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.inputArea} ${isDarkMode ? styles.dark : ''}`}>
      <textarea
        className={styles.inputTextarea}
        value={inputMessage}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="궁금한 사항이 있으면 여기에 입력해주세요.."
      />
      <div className={styles.buttonGroup}>
        <button 
          className={styles.emojiButton}
          onClick={toggleEmojiPicker}
        >
          <EmojiEmotionsIcon />
        </button>
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
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className={styles.emojiPickerWrapper}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default InputArea;