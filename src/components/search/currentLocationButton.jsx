import React, { useState } from 'react';
import currentLocationStyles from '@/styles/search/currentLocationBtn.module.css'; // CSS Modules 방식으로 import

const CurrentLocationButton = ({ map, isMapInitialized, isRoadviewVisible }) => {
    const [isActive, setIsActive] = useState(false);

    const handleCurrentLocation = () => {
        if (!isMapInitialized) return; // 맵이 초기화되지 않았을 경우 무시

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coords = new window.kakao.maps.LatLng(latitude, longitude);
                map.setCenter(coords);
                setIsActive(true); // 클릭 시 활성화 상태로 변경
                setTimeout(() => setIsActive(false), 2000); // 2초 후 비활성화 상태로 변경
            },
            (error) => {
                console.error("Error getting user location:", error);
                alert("위치를 가져올 수 없습니다.");
            }
        );
    };

    return (
        <button 
            onClick={handleCurrentLocation} 
            className={`${currentLocationStyles['current-location-btn']} ${isActive ? currentLocationStyles['active'] : ''}`} 
            style={{ 
                display: isRoadviewVisible ? 'none' : 'flex' /* 이미지 중앙 정렬을 위해 flex로 변경 */
            }}
        >
            <img src={`/images/marker-icon(3).png`} alt="Current Location" className={currentLocationStyles['img']} />
        </button>
    );
};

export default CurrentLocationButton;
