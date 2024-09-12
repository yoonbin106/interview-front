import axios from './axios';
import qs from 'qs';
const baseUrl = "/api/interviews";

export const getMockQuestions = async (choosedResume, userId) => {
    try {
      const response = await axios.get(`${baseUrl}/getmockquestion`, {
        params: { choosedResume, userId },
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

  export const getRealQuestions = async (choosedResume, userId) => {
    try {
      const response = await axios.get(`${baseUrl}/getrealquestion`, {
        params: { choosedResume, userId },
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

  export const uploadInterviewVideo = async (formData) => {
    try {
      const response = await axios.post(`${baseUrl}/upload-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        console.log("Video uploaded successfully:", response.data);
        return response.data;  // 서버에서 반환한 데이터 (videoId 포함) 반환
      }
    } catch (error) {
      console.error("Error uploading interview video:", error);
      throw error;
    }
  };

  export const getInterviewResults = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/getinterviewresults`, {
        params: { userId: userId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        const data = response.data;
        console.log("면접 결과 데이터입니다: ",data);
        return data;
      }
    } catch (error) {
      console.error("면접 결과를 가져오는 중 오류가 발생하였습니다:", error);
    }
  };

  export const fetchInterviewResult = async (videoId) => {
    try {
      const response = await axios.get(`${baseUrl}/fetchinterviewresult`, {
        params: { videoId: videoId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        const data = response.data;
        console.log("가져온 면접 데이터입니다: ", data);
        return data;
      }
    } catch (error) {
      console.error("면접 결과를 가져오는 중 오류가 발생하였습니다:", error);
    }
  };