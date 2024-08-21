import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import stylesSearch from '@/styles/search/search.module.css';
import stylesError from '@/styles/search/errorMessage.module.css'; // 오류 메시지 스타일 임포트

import axios from 'axios'; // Axios로 API 호출
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';

const SearchBox = observer(({ handleSearch, setSearchInputFocus, searchInputRef, setCorpNm, setSearchTriggered }) => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { userStore } = useStores();
    const baseURL = 'http://localhost:8080';
    const [errorMessage, setErrorMessage] = useState('');


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

    const validateSearchInput = (input) => {
        // 1. 검색어 길이 제한
        if (input.length < 2 || input.length > 15) {
            setErrorMessage("검색어는 2자 이상 15자 이하로 입력해주세요.");
            return false;
        }
    
        // 2. 특수문자 필터링
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>~`'\\/\[\];=_+-]/;
        if (specialCharPattern.test(input)) {
            setErrorMessage("특수문자는 사용할 수 없습니다.");
            return false;
        }
    
        // 3. 공백 처리
        const trimmedInput = input.trim().replace(/\s+/g, ' ');
    
        // 4. 금칙어 필터링
        const forbiddenWords = [
            "씨발", "섹스", "시발", "개새", "좆", "씹", "병신", "ㅅㅂ", "ㅂㅅ", "ㅄ", 
            "ㅈㄹ", "ㅈㄴ", "ㅗ", "ㅜ", "ㅁㅊ", "ㅊㅊ", "ㅉ", "ㄷㅊ", "ㅍㅅ", "ㄱㅅ", 
            "개년", "걸레", "쓰레기", "느개비", "닭대가리", "또라이", "똘추", "찌질이", 
            "빙신", "느개비", "좆까", "좆같", "좆밥", "썅", "싸가지", "개같", "개놈", 
            "개년", "개소리", "개새끼", "개자식", "개지랄", "개좆", "개호로", "개호로새끼", 
            "닥쳐", "닥치라", "닥치고", "닥치", "대갈빡", "대갈통", "대가리", "대갈", 
            "병신같", "병자", "뻐큐", "빡대가리", "빡치", "빻았", "새끼", "씹새", 
            "씹할", "씹년", "씹치", "씹팔", "씹창", "십창", "씨팔", "씨발놈", "씨발년", 
            "씨발새끼", "씨팔", "쌍년", "쌍놈", "쌍세끼", "썅년", "썅놈", "썅새끼", 
            "썩을", "썩창", "썅창", "쓰레기", "애미", "애비", "앰창", "엠창", "염병", 
            "엿먹", "조까", "조까치", "존나", "존맛", "죽일놈", "죽일년", "좆까", 
            "좆같", "좆밥", "좆만", "좆이", "좇같", "좇밥", "좇만", "짱깨", "짱개", 
            "창녀", "창놈", "캐년", "캐놈", "캐세끼", "호로", "호로새끼", "후레"
        ];
    
        const hasForbiddenWord = forbiddenWords.some(word => trimmedInput.includes(word));
        if (hasForbiddenWord) {
            setErrorMessage("부적절한 단어가 포함되어 있습니다.");
            return false;
        }
    
        // 5. 반복 문자 제한
        const repeatedCharPattern = /(.)\1{2,}/;
        if (repeatedCharPattern.test(trimmedInput)) {
            setErrorMessage("동일 문자가 3번 이상 반복되었습니다.");
            return false;
        }
    
        // 6. 글자 완성 제한 (자음, 모음만 있는 경우만 필터링)
        const incompleteCharPattern = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
        if (incompleteCharPattern.test(trimmedInput)) {
            setErrorMessage("완성된 한글만 입력해주세요.");
            return false;
        }
    
        // 오류가 없으면 에러 메시지를 지움
        setErrorMessage('');
        return trimmedInput;
    };
    

    const handleSearchClick = async () => {
        const searchValue = searchInputRef.current.value.trim();
        const validatedInput = validateSearchInput(searchValue); // 유효성 검사
    
        if (validatedInput) {
            try {
                await saveSearchHistory(validatedInput); // 유효성 검사를 통과한 경우에만 검색어 저장
                setCorpNm(validatedInput); // 상태 업데이트
                handleSearch(); // 검색을 실제로 실행
             
            } catch (error) {
                console.error('Failed to save search history:', error);
            }
        }
    };
    
    const handleSearchHistoryClick = (term) => {
        const validatedInput = validateSearchInput(term); // 유효성 검사
    
        if (validatedInput) {
            searchInputRef.current.value = validatedInput; // 검색 창에 클릭한 검색어를 표시
            setCorpNm(validatedInput); // 검색어 상태 업데이트
            setShowDropdown(false); // 드롭다운 닫기
        }
    };
    

  

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchClick(); // Enter 키를 눌렀을 때도 handleSearchClick 함수 호출
        }
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
            {errorMessage && (
                <div className={stylesError.errorPopup}>
                    {errorMessage}
                </div>
            )}
            <div className={stylesSearch['search-box']}>
                <input 
                    type="text" 
                    placeholder="기업명을 검색해주세요" 
                    ref={searchInputRef} 
                   onChange={handleInputChange}  // 검색어 입력 시 상태 업데이트
                    onKeyDown={handleKeyDown} // onKeyPress 대신 onKeyDown 사용
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
                                    onClick={() => handleSearchHistoryClick(term)} 
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
