// FavoriteList.js
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';
import favoriteStore from '@/stores/favoriteStore';
import styles from '@/styles/search/favoriteList.module.css';

const FavoriteList = observer(() => {
  const { userStore } = useStores();
  const userEmail = userStore.email;
  

  useEffect(() => {
    favoriteStore.fetchLikedCompanies(userEmail);
  }, [userEmail]);

  const toggleFavoriteList = () => {
    if (!favoriteStore.isFavoriteListVisible) {
      favoriteStore.fetchLikedCompanies(userEmail);
    }
    favoriteStore.toggleFavoriteListVisibility();
  };

  return (
    <div className={styles.favoriteListContainer}>
      <button onClick={toggleFavoriteList} className={styles.favoriteListButton}>
        찜 목록
      </button>
      {favoriteStore.isFavoriteListVisible && (
         <div className={`${styles.favoriteListDropdown} ${styles.favoriteScrollbar}`}> {/* filter-scrollbar 클래스 추가 */}
          {favoriteStore.likedCompanies.length > 0 ? (
            favoriteStore.likedCompanies.map((company, index) => (
              <div key={index} className={styles.favoriteListItem}>
                <strong>{company.companyName}</strong>
                <p>{company.companyId}</p>
                <button
                  className={styles.removeButton}
                  onClick={() => favoriteStore.removeFavorite(company.companyId, company.companyName, userEmail)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p>찜한 회사가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
});

export default FavoriteList;
