import React, { createContext, useContext } from 'react';
import { useBotState } from '@/hooks/useBotState';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const botState = useBotState();
  
  return (
    <ChatContext.Provider value={botState}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};