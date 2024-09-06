import axios from './axios';
import qs from 'qs';
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
        return response.data;
      }
    } catch (error) {
      console.error("이력서 기반 질문을 가져오는 중 오류가 발생하였습니다:", error);
    }
  };

  export const getInterviewQuestions = async (questionIds) => {
    try {
      const response = await axios.get(`${baseUrl}/getinterviewquestions`, {
        params: { questionId: questionIds },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        const data = response.data;
        console.log("데이터입니다: ",data);
        return data;
      }
    } catch (error) {
      console.error("사용자 선택 지문을 가져오는 중 오류가 발생하였습니다:", error);
    }
  };