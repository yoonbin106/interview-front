import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/bot/bot.module.css';
import BotHeader from '@/components/bot/botHeader';
import BotMessages from '@/components/bot/botMessages';
import InputArea from '@/components/bot/inputArea';
import BotMusicPlayer from '@/components/bot/botMusicPlayer';
import { useChat } from '@/contexts/chatContext';
import { useBotActions } from '@/hooks/useBotAction';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import { Snackbar } from '@mui/material';

const Bot = ({onClose}) => {
  // 채팅 컨텍스트에서 필요한 상태와 함수들을 가져옵니다.
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

  // 메시지 생성 중 상태와 스낵바 상태를 관리합니다.
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isUserTyping, setIsUserTyping] = useState(false);
  // 봇 액션 훅을 사용하여 봇 시작과 종료 함수를 가져옵니다.
  const { startNewBot, endBot } = useBotActions(
    setMessages,
    setCurrentBotId,
    setBotStartTime,
    setBotEndTime,
    currentBotId,
    messages,
    botStartTime,
    closeBot
  );
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [playlist, setPlaylist] = useState([
    '/music/Gold and Crawfish - Density & Time.mp3',
    '/music/Jumpin June - The Soundlings.mp3',
    '/music/Loading Screen - Dyalla.mp3',
    '/music/Quirk n Twerk - The Soundlings.mp3',
    '/music/Why Oh Why - The Soundlings.mp3',
  ]);
  const handleMessage = useCallback(async (message) => {
    console.log("Received message:", message);  // 이 줄을 추가
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('뮤직 실행')) {
      console.log("Music playback requested");  // 이 줄을 추가
      setShowMusicPlayer(true);
    } else if (lowerMessage.includes('뮤직 종료')) {
      setShowMusicPlayer(false);
    } else if (lowerMessage.includes('다음곡')) {
      handleNext();
    } else if (lowerMessage.includes('이전곡')) {
      handlePrevious();
    } else {
      // 기존의 메시지 처리 로직
      // ...
    }
  }, [setMessages]);

  const handleStop = () => {
    setShowMusicPlayer(false);
    setMessages(prev => [...prev, {
      text: "음악 재생을 중지했습니다.",
      sender: 'bot'
    }]);
  };

  const handleNext = () => {
    setMessages(prev => [...prev, {
      text: "다음 곡으로 넘어갑니다.",
      sender: 'bot'
    }]);
  };

  const handlePrevious = () => {
    setMessages(prev => [...prev, {
      text: "이전 곡으로 돌아갑니다.",
      sender: 'bot'
    }]);
  };
  // 메시지 처리 훅을 사용하여 메시지 관련 함수들을 가져옵니다.
  const {
    inputMessage,
    setInputMessage,
    isListening,
    sendMessage: originalSendMessage,
    handleKeyPress,
    startListening
  } = useMessageHandling(setMessages, currentBotId, handleMessage);

  // 메시지 전송 함수를 래핑하여 생성 중 상태를 관리합니다.
  const sendMessage = useCallback(async () => {
    setIsGenerating(true);
    await originalSendMessage();
    handleMessage(inputMessage);  // 이 부분이 중요합니다
    setIsGenerating(false);
  }, [originalSendMessage, inputMessage, handleMessage]);

  // 임시 ID 생성 함수
  const tempId = useCallback(() => {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${timestamp}${randomSuffix}`;
  }, []);

  // 채팅방이 열리고 봇 ID가 없을 때 새 봇을 시작합니다.
  useEffect(() => {
    if (isOpen && !currentBotId) {
      console.log("Starting new chat");
      startNewBot(tempId());
    }
  }, [isOpen, currentBotId, startNewBot, tempId]);

  // 피드백 추가 함수
  const addFeedback = async (answerId, isLike) => {
    if (answerId === undefined || answerId === null || isNaN(answerId)) {
      console.error('Invalid answerId:', answerId);
      setSnackbar({ open: true, message: '유효하지 않은 답변 ID입니다.', severity: 'error' });
      return;
    }
    if (feedbacks[answerId]) {
      setSnackbar({ open: true, message: '이미 피드백을 주셨습니다.', severity: 'info' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/bot/feedback', null, {
        params: { answerId, isLike }
      });
      console.log('Feedback added:', response.data);
      setSnackbar({ open: true, message: '피드백이 성공적으로 추가되었습니다.', severity: 'success' });
      updateMessageFeedback(answerId, isLike);
      setFeedbacks(prev => ({
        ...prev,
        [answerId]: isLike ? 'liked' : 'disliked'
      }));
    } catch (error) {
      console.error('Error adding feedback:', error.response?.data || error.message);
      setSnackbar({ open: true, message: '피드백 추가 중 오류가 발생했습니다.', severity: 'error' });
    }
  };

  // 메시지 피드백 업데이트 함수
  const updateMessageFeedback = (answerId, isLike) => {
    setMessages(prevMessages => prevMessages.map(msg => {
      if (msg.answerId === answerId) {
        return { ...msg, feedback: isLike ? 'liked' : 'disliked' };
      }
      return msg;
    }));
  };

  // 스낵바 닫기 핸들러
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleClose = useCallback(() => {
    endBot();
    onClose(); // SpeedDial의 상태를 업데이트하는 함수
  }, [endBot, onClose]);
  // 챗봇이 닫혀있을 때는 아무것도 렌더링하지 않음
  if (!isOpen) return null;


  return (
    <div className={`${styles.botContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <BotHeader endBot={handleClose} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className={styles.botContent}>
        {botStartTime && (
          <div className={styles.botInfo}>
            {botStartTime.toLocaleString()}
          </div>
        )}
        <BotMessages 
          messages={messages} 
          feedbacks={feedbacks} 
          addFeedback={addFeedback} 
          isGenerating={isGenerating}
          isUserTyping={isUserTyping}
          setMessages={setMessages}  // setMessages 함수를 props로 전달
        />
        {showMusicPlayer && 
          <BotMusicPlayer 
            playlist={playlist} 
            onStop={handleStop} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        }
        {botEndTime && (
          <div className={styles.botInfo}>
            {botEndTime.toLocaleString()}
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
          isDarkMode={isDarkMode}
          setIsUserTyping={setIsUserTyping}  // 이 부분을 변경
        />
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
};

export default Bot;