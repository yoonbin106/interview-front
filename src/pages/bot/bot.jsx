import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '@/styles/bot/bot.module.css';
import BotHeader from '@/components/bot/botHeader';
import BotMessages from '@/components/bot/botMessages';
import InputArea from '@/components/bot/inputArea';
import { useChat } from '@/contexts/chatContext';
import { useBotActions } from '@/hooks/useBotAction';
import { useMessageHandling } from '@/hooks/useMessageHandling';

const Bot = () => {
  const {
    isOpen,
    closeBot,
    messages,
    setMessages,
    currentBotId,
    setCurrentBotId,
    botStartTime,
    setBotStartTime,
    botEndTime,
    setBotEndTime,
    feedbacks,
    setFeedbacks,
    isDarkMode,
    toggleDarkMode
  } = useChat();

  const { startNewBot, endBot } = useBotActions(
    setMessages,
    setCurrentBotId,
    setBotStartTime,
    setBotEndTime,
    currentBotId,
    messages,
    botStartTime,
    closeBot // Changed from setIsOpen to closeBot
  );

  const {
    inputMessage,
    setInputMessage,
    isListening,
    sendMessage,
    handleKeyPress,
    startListening
  } = useMessageHandling(setMessages, currentBotId);


  const tempId = useCallback(() => {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${timestamp}${randomSuffix}`;
  }, []);

  useEffect(() => {
    if (isOpen && !currentBotId) {
      console.log("Starting new chat");
      startNewBot(tempId());
    }
  }, [isOpen, currentBotId, startNewBot, tempId]);

  const addFeedback = async (answerId, isLike) => {
    if (answerId === undefined || answerId === null || isNaN(answerId)) {
      console.error('Invalid answerId:', answerId);
      showNotification('유효하지 않은 답변 ID입니다.', 'error');
      return;
    }
    try {
      const response = await axios.post('/api/bot/feedback', null, {
        params: { answerId, isLike }
      });
      console.log('Feedback added:', response.data);
      showNotification('피드백이 성공적으로 추가되었습니다.', 'success');
      updateMessageFeedback(answerId, isLike);
      setFeedbacks(prev => ({
        ...prev,
        [answerId]: isLike ? 'liked' : 'disliked'
      }));
    } catch (error) {
      console.error('Error adding feedback:', error.response?.data || error.message);
      showNotification('피드백 추가 중 오류가 발생했습니다.', 'error');
    }
  };

  const showNotification = (message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const updateMessageFeedback = (answerId, isLike) => {
    setMessages(prevMessages => prevMessages.map(msg => {
      if (msg.answerId === answerId) {
        return { ...msg, feedback: isLike ? 'liked' : 'disliked' };
      }
      return msg;
    }));
  };
  if (!isOpen) return null; // 챗봇이 닫혀있을 때는 아무것도 렌더링하지 않음

  return (
    <div className={`${styles.botContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <BotHeader endBot={endBot} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className={styles.botContent}>
        {botStartTime && (
          <div className={styles.botInfo}>
            Started: {botStartTime.toLocaleString()}
          </div>
        )}
        <BotMessages messages={messages} feedbacks={feedbacks} addFeedback={addFeedback} />
        {botEndTime && (
          <div className={styles.botInfo}>
            Ended: {botEndTime.toLocaleString()}
          </div>
        )}
      </div>
      <div className={styles.inputArea}>
        <InputArea
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          startListening={startListening}
          isListening={isListening}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Bot;