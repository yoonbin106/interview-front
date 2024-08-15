// src/stores/authStore.js
import { makeAutoObservable } from 'mobx';

class AuthStore {
  loggedIn = false;
  isAdmin = false;

  constructor() {
    makeAutoObservable(this);
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