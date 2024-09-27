import axios from 'axios';


export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const Q_NUM = '6';

export const Q_URL = 'https://www.career.go.kr/inspct/openapi/test';  // question
export const R_URL = 'https://inspct.career.go.kr/inspct/openapi/psycho';  // result

export const GetQuestionAPI = async () => {
    const response = await axios.get(`${Q_URL}/questions?apikey=${API_KEY}&q=${Q_NUM}`);
    return response.data.RESULT;
};

export const PostResultAPI = async (data) => { 
    const pushResponse = await axios.post(`http://www.career.go.kr/inspct/openapi/test/report`, data);
    return pushResponse;
};