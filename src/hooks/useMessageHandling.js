import { useState, useCallback } from 'react';
import { sendQuestion, getAnswer } from '@/utils/api';

export const useMessageHandling = (setMessages, currentBotId) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);

  const sendMessage = useCallback(async () => {
    if (inputMessage.trim() && currentBotId) {
      const userMessage = { 
        text: inputMessage, 
        sender: 'user',
        timestamp: new Date().toISOString()  // 타임스탬프 추가
      };
      setMessages(prev => [...prev, userMessage]);
      setConversationContext(prev => [...prev, userMessage]);
      setInputMessage('');
      try {
        const questionResponse = await sendQuestion(inputMessage, currentBotId, conversationContext);
        const answerResponse = await getAnswer(questionResponse.data.questionId);

        const newBotMessage = {
          text: answerResponse.data.content,
          sender: 'bot',
          answerId: answerResponse.data.answerId,
          timestamp: new Date().toISOString()  // 봇 메시지에도 타임스탬프 추가
        };
        setMessages(prev => [...prev, newBotMessage]);
        setConversationContext(prev => [...prev, newBotMessage]);
      } catch (error) {
        console.error('Error processing message:', error);
        const errorMessage = { 
          text: "죄송합니다. 오류가 발생했습니다.", 
          sender: 'bot',
          timestamp: new Date().toISOString()  // 에러 메시지에도 타임스탬프 추가
        };
        setMessages(prev => [...prev, errorMessage]);
        setConversationContext(prev => [...prev, errorMessage]);
      }
    }
  }, [inputMessage, currentBotId, setMessages, conversationContext]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  }, []);

  return {
    inputMessage,
    setInputMessage,
    isListening,
    sendMessage,
    handleKeyPress,
    startListening,
    conversationContext
  };
};