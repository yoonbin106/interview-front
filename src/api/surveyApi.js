import axios from 'axios';


export const API_KEY = 'd5241a566d0ce0013bc58e7ae1b0cdd6';
export const Q_NUM = '6';

export const Q_URL = 'https://www.career.go.kr/inspct/openapi/test';  // question
// export const R_URL = 'https://inspct.career.go.kr/inspct/openapi/psycho/vocation';  // result
export const R_URL = 'https://inspct.career.go.kr/inspct/openapi/psycho';  // result
// export const R_URL = 'https://www.career.go.kr/inspct/openapi/test/';  // result
// 하드코딩 = https://www.career.go.kr/inspct/openapi/test/s?apikeyquestion=d5241a566d0ce0013bc58e7ae1b0cdd6&q=6

export const GetQuestionAPI = async () => {
    const response = await axios.get(`${Q_URL}/questions?apikey=${API_KEY}&q=${Q_NUM}`);
    // console.log(response.data.RESULT);
    return response.data.RESULT;
};

export const PostResultAPI = async (data) => { 
    const pushResponse = await axios.post(`http://www.career.go.kr/inspct/openapi/test/report`, data);
    return pushResponse;
};

// export const PostResultAPI = async (data) => { 
//     const pushResponse = await axios.post(`${Q_URL}/report?apikey=${API_KEY}&q=${Q_NUM}` , data);
//     console.log(pushResponse);
//     const SEQ_NUM = pushResponse.data.RESULT.url.split('=')[1];
//     const pullResponse = await axios.get(`${R_URL}/report?seq=${SEQ_NUM}`);
//     console.log(pullResponse);
//     return pullResponse;
// };


// https://www.career.go.kr/inspct/openapi/test/report?apikey=d5241a566d0ce0013bc58e7ae1b0cdd6&q=6
// https://inspct.career.go.kr/inspct/openapi/psycho/report?seq=6