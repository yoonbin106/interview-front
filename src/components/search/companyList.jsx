import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyList = ({ companies, onCompanyClick, onMarkerClick }) => {
    const [likedCompanies, setLikedCompanies] = useState([]);
    const [isFavoriteListVisible, setIsFavoriteListVisible] = useState(false); // 찜 목록 가시성 상태

    // 로컬 스토리지에서 이메일 가져오기
    const userEmail = localStorage.getItem('email');

    // 컴포넌트가 마운트될 때 서버에서 찜한 회사 목록을 가져오는 useEffect 훅 추가
    useEffect(() => {
        if (userEmail) {
            axios.get('http://localhost:8080/api/favorite/getFavorites', { params: { email: userEmail } })
                .then(response => {
                    setLikedCompanies(response.data.map(company => company.companyName));
                })
                .catch(error => console.error('Error fetching favorites:', error));
        }
    }, [userEmail]);


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

    const toggleFavoriteList = () => {
        setIsFavoriteListVisible(!isFavoriteListVisible);
    };

    return (
        <div>
          

            {/* 찜 목록 표시 영역 */}
            {isFavoriteListVisible && (
                <div className="favorite-list" style={{ marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                    {likedCompanies.map((company, index) => (
                        <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                            <strong>{company.companyName}</strong>
                            <p>{company.companyId}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* 회사 리스트를 나열하는 기존 컴포넌트 */}
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
        </div>
    );
};

export default CompanyList;
