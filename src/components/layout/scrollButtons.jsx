import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import styles from '@/styles/scrollButtons.module.css'; // 새로운 CSS 모듈 생성

function ScrollButtons() {
    // 위로 스크롤
    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 부드러운 스크롤 애니메이션
        });
    };

    // 아래로 스크롤
    const scrollDown = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth' // 부드러운 스크롤 애니메이션
        });
    };

    return (
        <div className={styles.scrollButtonsContainer}>
            <button className={styles.scrollButton} onClick={scrollUp}>
                <ArrowDropUpIcon style={{ color: 'white' }} />
            </button>
            <button className={styles.scrollButton} onClick={scrollDown}>
                <ArrowDropDownIcon style={{ color: 'white' }} />
            </button>
        </div>
    );
}

export default ScrollButtons;