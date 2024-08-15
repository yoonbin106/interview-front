import { useCallback } from 'react';
import { startChat, endChat, saveJsonFile } from '@/utils/api';

export const useBotActions = (
  setMessages,
  setCurrentBotId,
  setBotStartTime,
  setBotEndTime,
  currentBotId,
  messages,
  botStartTime,
  setIsOpen
) => {
  const startNewBot = useCallback(async (tempId) => {
    try {
      const response = await startChat(tempId);
      console.log("New chat started with ID:", response.data.botId);
      setCurrentBotId(response.data.botId);
      setBotStartTime(new Date(response.data.createdTime));
      setBotEndTime(null);

      const greetingMessage = "안녕하세요! VIP 고객님을 위한 챗봇 서비스입니다. 무엇을 도와드릴까요?";
      setMessages([{ text: greetingMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Error starting new chat:', error);
      setMessages([{ text: "채팅 시작 중 오류가 발생했습니다.", sender: 'system' }]);
    }
  }, [setCurrentBotId, setBotStartTime, setBotEndTime, setMessages]);

  const endBot = useCallback(async () => {
    if (currentBotId) {
      try {
        await endChat(currentBotId);
        const endTime = new Date();
        setBotEndTime(endTime);

        const endMessages = [
          { text: "챗봇을 종료합니다. 이용해 주셔서 감사합니다!", sender: 'bot' }
        ];

        setMessages(prev => [...prev, ...endMessages]);

        await saveJsonFile({
          botId: currentBotId,
          messages: messages,
          startTime: botStartTime,
          endTime: endTime
        });

      } catch (error) {
        console.error('Error ending chat:', error);
        setMessages(prev => [...prev, { text: "채팅 종료 중 오류가 발생했습니다.", sender: 'system' }]);
      } finally {
        setTimeout(() => {
          setIsOpen(false);
          setCurrentBotId(null);
          setMessages([]);
        }, 1000);
      }
    } else {
      setIsOpen(false);
    }
  }, [currentBotId, setMessages, setBotEndTime, setIsOpen, setCurrentBotId, messages, botStartTime]);

  return { startNewBot, endBot };
};