import axios from './axios';

const baseUrl = "/api/interviews";

export const getMockQuestions = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/getmockquestion`, {
        params: { userId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        console.log(response.data);
        return response.data;  // 성공시 profile URL 반환
      }
    } catch (error) {
      console.error("프로필 이미지를 불러오는 중 오류가 발생했습니다:", error);
    }
  };