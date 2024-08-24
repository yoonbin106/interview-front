import React, { useState, useEffect  } from 'react';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../../styles/chat/searchBar.module.css';

export default function SearchBar({ onSearch }) {

    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = () => {
        onSearch(searchKeyword); //부모 컴포넌트로 값 전달해주기
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => { //입력값 바뀔때마다 얘가 다 인식함
        if (searchKeyword === '') {
            handleSearch();
        }
    }, [searchKeyword]);

    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.searchBarContent}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="이름이나 이메일로 사용자 검색하기"
                    inputProps={{ 'aria-label': '유저 검색' }}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <div className={styles.searchBarIcon}>
                    <button className={styles.searchButton} onClick={handleSearch}>
                        <SearchIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}