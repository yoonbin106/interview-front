import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from '@/styles/bot/botButton.module.css';

const BotButton = ({ onClick }) => {
  return (
    <div className={styles.botButtonContainer}>
       <button 
        className={styles.botButton}
        onClick={onClick}
        aria-label="Open Chatbot"
      >
        <MessageCircle size={40} />
        <span className={styles.botButtonText}>VIP</span>
      </button>
    </div>
  );
};

export default BotButton;