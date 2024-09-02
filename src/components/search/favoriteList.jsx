import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';
import styles from '@/styles/search/favoriteList.module.css'; // CSS 모듈을 임포트합니다.

const FavoriteList = observer(() => {
    const { userStore } = useStores();
    const [likedCompanies, setLikedCompanies] = useState([]);
    const [isFavoriteListVisible, setIsFavoriteListVisible] = useState(false); // 찜 목록 가시성 상태 추가
    const userEmail = userStore.email;

    // 찜한 회사 목록 가져오는 함수
    const fetchLikedCompanies = () => {
        axios.get(`http://localhost:8080/api/favorite/getFavorites`, { params: { email: userEmail } })
            .then(response => {
                setLikedCompanies(response.data.slice(0, 10)); // 최대 10개만 가져오기
            })
            .catch(error => console.error('Error fetching favorites:', error));
    };

    useEffect(() => {
        fetchLikedCompanies(); // 컴포넌트가 마운트될 때 찜 목록 가져오기
    }, [userEmail]);

    const toggleFavoriteList = () => {
        if (!isFavoriteListVisible) {
            fetchLikedCompanies(); // 찜 목록을 열 때마다 최신 상태로 가져오기
        }
        setIsFavoriteListVisible(!isFavoriteListVisible);
    };

    const handleCompanyClickFavoriteList = (companyName) => {
        handleCompanyClick(companyName); // SearchBox로 회사 이름 전달
        setIsFavoriteListVisible(false); // 목록 닫기
    };

    return (
        <div className={styles.favoriteListContainer}>
            <button onClick={toggleFavoriteList} className={styles.favoriteListButton}>
                찜 목록
            </button>
            {isFavoriteListVisible && (
                <div className={styles.favoriteListDropdown}>
                    {likedCompanies.length > 0 ? (
                        likedCompanies.map((company, index) => (
                            <div key={index} className={styles.favoriteListItem}>
                                <strong>{company.companyName}</strong>
                                <p>{company.companyId}</p>
                                <button className={styles.removeButton}>X</button> {/* X 버튼 추가 */}
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
