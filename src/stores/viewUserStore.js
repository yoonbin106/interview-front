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
    this.viewedUser = { 
      ...this.viewedUser, 
      [name]: value 
    };
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

    // 프로필 이미지가 있을 경우만 전송
    if (profileImage) {
      formData.append('profileImage', profileImage);
    } 

    const response = await axios.post('/api/auth/edituser', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    this.viewedUser = response.data; // 업데이트된 사용자 정보 반영
  } catch (error) {
    console.error("사용자 정보를 수정하는 데 오류가 발생했습니다:", error);
    throw error;
  }
}


  // 사용자 비활성화
  async deactivateUser(email) {
    try {
      const response = await axios.post('/api/auth/deactivateUser', { email }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        this.viewedUser.isActivated = 0; // 비활성화 상태 업데이트
        alert('사용자가 성공적으로 비활성화되었습니다.');
      } else {
        alert('비활성화 요청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('사용자를 비활성화하는 중 오류가 발생했습니다:', error);
      alert('비활성화 요청 처리 중 오류가 발생했습니다.');
    }
  }

  // 사용자 탈퇴
  async deleteUser(email) {
    try {
      const response = await axios.post('/api/auth/deleteUser', { email }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        this.viewedUser.isDeleted = 1; // 탈퇴 상태 업데이트
        this.viewedUser.deletedTime = new Date().toISOString(); // 탈퇴 시간 설정
        alert('사용자가 성공적으로 탈퇴되었습니다.');
      } else {
        alert('탈퇴 요청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('사용자를 탈퇴하는 중 오류가 발생했습니다:', error);
      alert('탈퇴 요청 처리 중 오류가 발생했습니다.');
    }
  }

  clearViewedUser() {
    this.viewedUser = null;
  }
}

const viewUserStore = new ViewUserStore();
export default viewUserStore;
