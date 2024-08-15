import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // 필요한 다른 설정들...
});

export const startChat = (id) => api.post('/bot/chat', null, { params: { id } });
export const endChat = (botId) => api.post(`/bot/chat/${botId}/end`);
export const saveJsonFile = (data) => api.post('/bot/save-json', data);
export const sendQuestion = (content, botId) => api.post('/bot/question', { content, botId });
export const getAnswer = (questionId) => api.post('/bot/answer', null, { params: { questionId } });
export const addFeedback = (answerId, isLike) => api.post('/bot/feedback', null, { params: { answerId, isLike } });

export default api;