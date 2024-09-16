import { makeAutoObservable } from 'mobx';
import axios from '../api/axios';

class ViewUserStore {
  viewedUser = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 이메일로 사용자 정보를 가져오는 함수
  async fetchUserByEmail(email) {
    try {
      const response = await axios.get(`/api/auth/findUserByEmail`, {
        params: { email },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      this.viewedUser = response.data;
    } catch (error) {
      console.error("유저 정보를 가져오는 데 오류가 발생했습니다:", error);
    }
  }

  // 필드 업데이트 (사용자 정보 수정)
  updateField(name, value) {
    if (this.viewedUser) {
      this.viewedUser = { ...this.viewedUser, [name]: value };
    }
  }

  // 사용자 정보 수정
  async updateUserDetails(email, username, address, birth, profileImage) {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('address', address);
      formData.append('birth', birth);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.post('/api/auth/edituser', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      this.viewedUser = response.data;
    } catch (error) {
      console.error("사용자 정보를 수정하는 데 오류가 발생했습니다:", error);
      throw error;
    }
  }

  clearViewedUser() {
    this.viewedUser = null;
  }
}

const viewUserStore = new ViewUserStore();
export default viewUserStore;
