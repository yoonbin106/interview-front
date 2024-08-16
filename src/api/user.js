// src/api/user.js
import axios from './axios';

const baseUrl = "/api/auth";

export const singUp = (singUpData) => {
    return axios.post(baseUrl + "/user", singUpData).then(res => {
        return res;
    });
}

export const login = async (loginData, authStore, userStore) => {  // authStore를 인자로 받음
  const response = await axios.post("/login", loginData, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    }
  });
  const token = response.headers['authorization'] || response.headers['Authorization'];
  console.log("받은 값:",response.data);
  if (token) {
    const pureToken = token.split(' ')[1];
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', pureToken);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      localStorage.setItem('refresh', response.data.refresh);
      userStore.setId(response.data.id);
      userStore.setEmail(response.data.username);
      userStore.setUsername(response.data.name);
      userStore.setAddress(response.data.address);
      userStore.setGender(response.data.gender);
      userStore.setBirth(response.data.birth);
      userStore.setPhone(response.data.phone);
      authStore.setIsAdmin(response.data.isAdmin);
      authStore.setLoggedIn(response.data.status == 200 ? true : false);
    }
  }
  return response.data;
};

export const logout = async (authStore, userStore) => {
  return axios.post("/logout").then(res =>{
    localStorage.clear(); // 로컬 스토리지 비우기
    authStore.setLoggedIn(false);
    userStore.setEmail('');
    userStore.setUsername('');
    userStore.setAddress('');
    userStore.setGender('');
    userStore.setBirth('');
    userStore.setPhone('');
    userStore.setProfile('');
    return res
  });
};

export const getProfileImage = async (email, userStore) => {
  try {
    const response = await axios.get(`${baseUrl}/profile-image`, {
      params: { email },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.status === 200) {
      userStore.setProfile(response.data); // 프로필 이미지를 userStore에 저장
    }
  } catch (error) {
    console.error("프로필 이미지를 불러오는 중 오류가 발생했습니다:", error);
  }
};