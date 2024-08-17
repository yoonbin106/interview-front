// src/stores/authStore.js
import { makeAutoObservable } from 'mobx';

class AuthStore {
  loggedIn = false;
  isAdmin = false;

  constructor() {
    makeAutoObservable(this);
  }
  // 초기화 함수 추가
  initializeAuthStore() {
    this.loggedIn = false;
    this.isAdmin = false;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
    }
  }
  setLoggedIn(status) {
    console.log('setLoggedIn: ', status);
    this.loggedIn = status;
  }

  checkLoggedIn() {
    this.loggedIn = !!localStorage.getItem('token');
  }

  setIsAdmin(status) {
    console.log('setIsAdmin: ', status);
    this.isAdmin = status;
  }
}

const authStore = new AuthStore();
export default authStore;