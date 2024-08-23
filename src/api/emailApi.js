import axios from 'axios';

export const sendEmailCode = async (email) => {
  try {
    const response = await axios.post('http://localhost:8080/api/email/send-code', { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error('이메일 주소가 올바르지 않습니다.');
    } else {
      throw new Error('인증코드 발송에 실패하였습니다.');
    }
  }
};

export const verifyEmailCode = async (email, code) => {
  try {
    const response = await axios.post('http://localhost:8080/api/email/verify-code', { email, code });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error('인증코드가 일치하지 않습니다.');
    } else {
      throw new Error('인증에 실패하였습니다.');
    }
  }
};

export const verifyUserByUsernameAndEmail = async (username, email) => {
  const response = await axios.get('http://localhost:8080/api/auth/verify-user', {
      params: { username, email }
  });
  return response.data;
};

export const resetPassword = async (username, email, newPassword) => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
      username,
      email,
      newPassword
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버에서 응답이 온 경우
      if (error.response.status === 512) {
        throw new Error("이전 비밀번호는 사용할 수 없습니다.");
      } else {
        throw new Error(error.response.data);
      }
    } else {
      // 서버에서 응답이 오지 않은 경우
      throw new Error("비밀번호 재설정 중 오류가 발생했습니다.");
    }
  }
};

export const changePassword = async (username, email, newPassword, currentPassword) => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/changePassword', {
      username,
      email,
      newPassword,
      currentPassword
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버에서 응답이 온 경우
      if (error.response.status === 512) {
        throw new Error("이전 비밀번호는 사용할 수 없습니다.");
      } else if (error.response.status === 514){
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
      } else {
        throw new Error(error.response.data);
      }
    } else {
      // 서버에서 응답이 오지 않은 경우
      throw new Error("비밀번호 재설정 중 오류가 발생했습니다.");
    }
  }
};