import { useState, useCallback } from 'react';

export const useBotState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentBotId, setCurrentBotId] = useState(null);
  const [botStartTime, setBotStartTime] = useState(null);
  const [botEndTime, setBotEndTime] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  const openBot = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeBot = useCallback(() => {
    setIsOpen(false);
  }, []);


  return {
    isOpen,
    setIsOpen,
    openBot,
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
    toggleChat,
    toggleDarkMode
  };
};