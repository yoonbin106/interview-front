// favoriteStore.js
import { makeAutoObservable, action } from 'mobx';
import axios from 'axios';

class FavoriteStore {
  likedCompanies = [];
  isFavoriteListVisible = false;

  constructor() {
    makeAutoObservable(this, {
      setLikedCompanies: action,
      toggleFavoriteListVisibility: action,
      addLikedCompany: action,
      removeLikedCompany: action,
    });
  }

  setLikedCompanies(companies) {
    this.likedCompanies = companies;
  }

  toggleFavoriteListVisibility() {
    this.isFavoriteListVisible = !this.isFavoriteListVisible;
  }

  fetchLikedCompanies(email) {
    axios.get(`http://localhost:8080/api/favorite/getFavorites`, { params: { email } })
      .then(response => {
        this.setLikedCompanies(response.data.slice(0, 10));
      })
      .catch(error => console.error('Error fetching favorites:', error));
  }

  addFavorite(company, email) {
    const favoriteDto = {
      userEmail: email,
      companyId: company.enpBsadr,
      companyName: company.corpNm,
    };

    axios.post(`http://localhost:8080/api/favorite/addFavorite`, favoriteDto)
      .then(response => {
        console.log('Added to liked companies:', response.data);
        this.addLikedCompany({
          companyId: company.enpBsadr,
          companyName: company.corpNm,
        });
      })
      .catch(error => console.error('Error adding favorite:', error));
  }

  removeFavorite(companyId, companyName, email) {
    const favoriteDto = {
      userEmail: email,
      companyId,
      companyName,
    };

    axios.delete(`http://localhost:8080/api/favorite/removeFavorite`, { data: favoriteDto })
      .then(response => {
        console.log('Removed from liked companies:', response.data);
        this.removeLikedCompany(companyId);
      })
      .catch(error => console.error('Error removing favorite:', error));
  }

  addLikedCompany(company) {
    this.likedCompanies.push(company);
  }

  removeLikedCompany(companyId) {
    this.likedCompanies = this.likedCompanies.filter(company => company.companyId !== companyId);
  }
}

const favoriteStore = new FavoriteStore();
export default favoriteStore;
