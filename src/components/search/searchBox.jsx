import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import stylesSearch from '@/styles/search/search.module.css';

import axios from 'axios'; // Axios로 API 호출
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';

const SearchBox = observer(({ handleSearch, setSearchInputFocus, searchInputRef, setCorpNm }) => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { userStore } = useStores();
    const baseURL = 'http://localhost:8080';

    const fetchSearchHistory = async () => {
        try {
            const email = userStore.email; // MobX Store에서 email 값을 가져옴

            // 이메일을 쿼리 파라미터로 포함하여 요청 보내기
            const response = await axios.get(`${baseURL}/api/search/searchHistory`, {
                params: { email }
            });
            console.log('Fetched search history:', response.data); // 검색 기록 로그
            setSearchHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch search history:', error);
        }
    };

    const searchHistoryCall = () => {
        console.log("box clicked");  // 입력값 로그
        setShowDropdown(true); // 검색 기록 드롭다운 표시
        fetchSearchHistory(); // 검색 기록을 가져옴
    };

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.addEventListener('focus', searchHistoryCall);
            searchInputRef.current.addEventListener('blur', () => {
                setTimeout(() => setShowDropdown(false), 200); // 약간의 지연 후 드롭다운 닫기
            });
        }
    }, [searchInputRef]);

    const saveSearchHistory = async (searchInput) => {
        try {
            const email = localStorage.getItem('email'); // 로컬스토리지에서 이메일 가져오기
            await axios.post(`${baseURL}/api/search/saveSearchHistory`, null, {
                params: { searchInput, email }
            });
            console.log('Search history saved successfully');
        } catch (error) {
            console.error('Failed to save search history:', error);
        }
    };

    const handleInputChange = (e) => {
        console.log("Input changed: ", e.target.value);  // 입력값 로그
        setCorpNm(e.target.value);
    };

    const handleSearchClick = async () => {
        console.log("Search button clicked");
        await saveSearchHistory(searchInputRef.current.value); // 검색 기록 저장
        handleSearch();
        setShowDropdown(false); // 검색을 수행한 후 드롭다운 닫기
    };

     // 삭제 이벤트 핸들러
     const handleDeleteSearchHistory = async (term, event) => {
        event.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
        try {
            const email = userStore.email;
            await axios.delete(`${baseURL}/api/search/deleteSearchHistory`, {
                params: { term, email }
            });
            // 로컬 상태에서 삭제된 항목 제거
            setSearchHistory(prevHistory => prevHistory.filter(item => item !== term));

            console.log(`Deleted search history term: ${term}`);
        } catch (error) {
            console.error('Failed to delete search history:', error);
        }
    };

    return (
        <div className={stylesSearch['search-container']}>
            <h2>지도</h2>
            <p>전국의 기업을 지도로 한눈에 확인하세요!</p>
            <div className={stylesSearch['search-box']}>
                <input 
                    type="text" 
                    placeholder="기업명을 검색해주세요" 
                    ref={searchInputRef} 
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchClick();
                        }
                    }}
                />
                <button onClick={handleSearchClick}><FontAwesomeIcon icon={faSearch} /></button>
                {showDropdown && searchHistory.length > 0 && (
                    <div className={stylesSearch.searchHistoryDropdown}>
                        <ul>
                            {searchHistory.slice(0, 3).map((term, index) => (
                                <li key={index} className={stylesSearch['search-history-item']}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <img 
                                            src="/images/searchhistory.png" 
                                            alt="Search Icon" 
                                            className={stylesSearch['search-icon']}
                                            style={{ flexShrink: 0 }}
                                        />
                                        <span 
                                            onClick={() => {
                                                setCorpNm(term);
                                                handleSearch();
                                                setShowDropdown(false);
                                            }}
                                            style={{
                                                flexGrow: 1, 
                                                marginLeft: '10px', 
                                                whiteSpace: 'nowrap', 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {term}
                                        </span>
                                        <button 
                                            className={stylesSearch['delete-btn']} 
                                            onClick={(event) => handleDeleteSearchHistory(term, event)}
                                            style={{ flexShrink: 0, marginLeft: '10px' }}
                                        >
                                            X
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <button 
                            className={stylesSearch['close-btn']} 
                            onClick={() => setShowDropdown(false)}
                        >
                            닫기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default SearchBox;
