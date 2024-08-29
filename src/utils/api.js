//src\utils\api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // 필요한 다른 설정들...
});

// 인터뷰 관련 API 호출
export const interviewApi = {
  getInterviewQuestions: (userId) => api.get(`/interview/questions/${userId}`),
  generateQuestions: (request) => api.post('/interview/generate-questions', request),
  getQuestions: (userId, questionType) => 
    api.get(`/interview/questions`, { params: { userId, questionType } }),
  recordInterview: (request) => api.post('/interview/record', request),
  uploadVideo: (formData) => api.post('/interview/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyzeInterview: (videoId) => api.post(`/interview/${videoId}/analyze`),
  getLatestResult: () => api.get('/interview/latest-result'),
};

// 챗봇 관련 API 호출
export const startChat = (id) => api.post('/bot/chat', null, { params: { id } });
export const endChat = (botId) => api.post(`/bot/chat/${botId}/end`);
export const saveJsonFile = (data) => api.post('/bot/save-json', data);
export const sendQuestion = (content, botId) => api.post('/bot/question', { content, botId });
export const getAnswer = (questionId) => api.post('/bot/answer', null, { params: { questionId } });
export const addFeedback = (answerId, isLike) => api.post('/bot/feedback', null, { params: { answerId, isLike } });

export default api;