import axios from 'axios';

export const sendPhoneCode = async (phone) => {
    const response = await fetch('http://localhost:8080/api/phone/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
  
    return response.ok;
  };
  
  export const verifyPhoneCode = async (phone, code) => {
    const response = await fetch('http://localhost:8080/api/phone/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });
  
    if (response.ok) {
      return true;
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  };

  export const findEmailByUsernameAndPhone = async (username, phone) => {
    const response = await axios.get('http://localhost:8080/api/auth/find-email', {
        params: { username, phone }
    });
    return response.data;
};