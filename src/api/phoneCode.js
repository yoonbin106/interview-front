import axios from 'axios';

export const sendPhoneCode = (phone) => {
    return axios.post('/api/sendCode', { phone });
};

export const verifyPhoneCode = (phone, code) => {
    return axios.post('/api/verifyCode', { phone, code });
};