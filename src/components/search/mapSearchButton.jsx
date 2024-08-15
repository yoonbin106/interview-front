import React from 'react';
import styles from '@/styles/search/mapSearchButton.module.css'; // 수정된 CSS 파일을 import 합니다.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons'; // 원하는 아이콘으로 수정

const MapSearchButton = ({ onClick }) => {
    return (
        <button className={styles['map-search-button']} onClick={onClick}>
            <FontAwesomeIcon icon={faRedo} className={styles['icon']} />
            현재 지도에서 검색
        </button>
    );
};

export default MapSearchButton;
