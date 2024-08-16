import { makeAutoObservable } from 'mobx';

class UserStore {
  username = '';
  email = '';
  phone = '';
  gender = '';
  birth = '';
  address = '';
  profile = '';
  id = '';

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      this.loadUserData(); // 페이지 로드 시 사용자 데이터를 복원 (클라이언트 환경에서만)
    }
  }

  setEmail(email) {
    this.email = email;
    if (typeof window !== 'undefined') {
      localStorage.setItem('email', email);
    }
  }

  setUsername(username) {
    this.username = username;
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username);
    }
  }

  setPhone(phone) {
    this.phone = phone;
    if (typeof window !== 'undefined') {
      localStorage.setItem('phone', phone);
    }
  }

  setGender(gender) {
    this.gender = gender;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gender', gender);
    }
  }

  setAddress(address) {
    this.address = address;
    if (typeof window !== 'undefined') {
      localStorage.setItem('address', address);
    }
  }

  setBirth(birth) {
    this.birth = birth;
    if (typeof window !== 'undefined') {
      localStorage.setItem('birth', birth);
    }
  }

  setId(id) {
    this.id = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('id', id);
    }
  }

  setProfile(profile) {
    this.profile = profile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('profile', profile);
    }
  }

  loadUserData() {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username') || '';
      this.email = localStorage.getItem('email') || '';
      this.phone = localStorage.getItem('phone') || '';
      this.gender = localStorage.getItem('gender') || '';
      this.birth = localStorage.getItem('birth') || '';
      this.address = localStorage.getItem('address') || '';
      this.profile = localStorage.getItem('profile') || '';
      this.id = localStorage.getItem('id') || '';
    }
  }
}

const userStore = new UserStore();
export default userStore;