import React from 'react';
import styles from '@/styles/search/zoomControl.module.css'; // 올바른 경로

const ZoomControl = ({ map, isMapInitialized, isRoadviewVisible }) => {
    const handleZoomIn = () => {
        if (map && isMapInitialized) {
            const level = map.getLevel();
            map.setLevel(level - 1);
        } else {
            console.error("Map is not initialized.");
        }
    };

    const handleZoomOut = () => {
        if (map && isMapInitialized) {
            const level = map.getLevel();
            map.setLevel(level + 1);
        } else {
            console.error("Map is not initialized.");
        }
    };

    return (
        <div className={styles['zoom-control']} style={{ display: isRoadviewVisible ? 'none' : 'flex' }}>
            <button onClick={handleZoomIn}>+</button>
            <button onClick={handleZoomOut}>-</button>
        </div>
    );
};

export default ZoomControl;
