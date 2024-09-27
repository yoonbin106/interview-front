// CompanyList.js
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import favoriteStore from '@/stores/favoriteStore';

const CompanyList = observer(({ companies, onCompanyClick, onMarkerClick }) => {
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    if (userEmail) {
      favoriteStore.fetchLikedCompanies(userEmail);
    }
  }, [userEmail]);

  const handleLikeClick = (company) => {
    if (favoriteStore.likedCompanies.some(likedCompany => likedCompany.companyName === company.corpNm)) {
      favoriteStore.removeFavorite(company.enpBsadr, company.corpNm, userEmail);
    } else {
      favoriteStore.addFavorite(company, userEmail);
    }
  };

  return (
    <div>
      {companies.map((company, index) => (
        <div 
          key={index} 
          id={company.corpNm}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
            margin: '10px 0', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            backgroundColor: '#fff', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.border = '1px solid blue'}
          onMouseLeave={(e) => e.currentTarget.style.border = '1px solid #ccc'}
        >
          <div onClick={() => {
              onCompanyClick(company);
          }} style={{ flex: 1, wordWrap: 'break-word', whiteSpace: 'normal' }}>
            <strong>{company.corpNm}</strong>
            <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{company.enpBsadr}</p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick(company);
            }} 
            style={{ 
              width: '30px', 
              height: '30px', 
              background: `url(${favoriteStore.likedCompanies.some(likedCompany => likedCompany.companyName === company.corpNm)
                ? '/images/searchliked-icon.png'
                : '/images/searchliked-icon.png'
              }) no-repeat center/contain`,
              filter: favoriteStore.likedCompanies.some(likedCompany => likedCompany.companyName === company.corpNm) ? 'grayscale(100%)' : 'none'
            }}
          ></div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(company);
            }} 
            style={{ width: '30px', height: '30px', background: 'url(/images/marker-icon.png) no-repeat center/contain' }}
          ></div>
        </div>
      ))}
    </div>
  );
});

export default CompanyList;
