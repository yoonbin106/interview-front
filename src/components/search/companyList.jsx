import React, { useState } from 'react';
import axios from 'axios';

const CompanyList = ({ companies, onCompanyClick, onMarkerClick }) => {
    const [likedCompanies, setLikedCompanies] = useState([]);

    // 로컬 스토리지에서 이메일 가져오기
    const userEmail = localStorage.getItem('email');

    const handleLikeClick = (company) => {
        const favoriteDto = {
            userEmail,  // 사용자 이메일
            companyId: company.enpBsadr,
            companyName: company.corpNm  // 회사 이름
        };

        if (!favoriteDto.companyId) {
            console.error('Company ID is missing:', company);
            return;
        }
        
        if (likedCompanies.includes(company.corpNm)) {
            // 찜 해제 시 서버에 요청
            axios.delete(`http://localhost:8080/api/favorite/removeFavorite`, { data: favoriteDto })
                .then(response => {
                    console.log('Removed from liked companies:', response.data);
                    setLikedCompanies(likedCompanies.filter(name => name !== company.corpNm));
                })
                .catch(error => console.error('Error removing favorite:', error));
        } else {
            // 찜 추가 시 서버에 요청
            axios.post(`http://localhost:8080/api/favorite/addFavorite`, favoriteDto)
                .then(response => {
                    console.log('Added to liked companies:', response.data);
                    setLikedCompanies([...likedCompanies, company.corpNm]);
                })
                .catch(error => console.error('Error adding favorite:', error));
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
                        console.log(`Company clicked: ${company.corpNm}`);
                        onCompanyClick(company);
                    }} style={{ flex: 1, wordWrap: 'break-word', whiteSpace: 'normal' }}>
                        <strong>{company.corpNm}</strong>
                        <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{company.enpBsadr}</p>
                    </div>
                    {/* 찜하기 버튼 추가 - 로드뷰 버튼 왼쪽에 위치 */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation(); // 부모 요소의 클릭 이벤트 중단
                            handleLikeClick(company);
                        }} 
                        style={{ 
                            width: '30px', 
                            height: '30px', 
                            background: `url(${likedCompanies.includes(company.corpNm) 
                                ? '/images/searchliked-icon.png'  // 찜한 상태일 때 흑백 이미지
                                : '/images/searchliked-icon.png' // 찜하지 않은 상태일 때 컬러 이미지
                            }) no-repeat center/contain`,
                            filter: likedCompanies.includes(company.corpNm) ? 'grayscale(100%)' : 'none'
                        }}
                    ></div>
                    {/* 로드뷰 버튼 */}
                    <div 
                        onClick={(e) => {
                            e.stopPropagation(); // 부모 요소의 클릭 이벤트 중단
                            console.log(`Marker icon clicked: ${company.corpNm}`);
                            onMarkerClick(company);
                        }} 
                        style={{ width: '30px', height: '30px', background: 'url(/images/marker-icon.png) no-repeat center/contain' }}
                    ></div>
                </div>
            ))}
        </div>
    );
};

export default CompanyList;
