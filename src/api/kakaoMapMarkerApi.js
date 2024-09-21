import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ companies }) => {

    
    const mapRef = useRef(null);
    const clustererRef = useRef(null); // 클러스터링을 위한 ref

    useEffect(() => {
        const script = document.createElement('script');
        const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY; // 환경 변수에서 API 키를 가져옴
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services,clusterer`; // 클러스터링 추가
       
        script.async = true;

        script.onload = () => {
            console.log('Kakao Map script loaded');
            initializeMap();
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            console.log('Companies state changed:', companies);
            addMarkers();
        }
    }, [companies]);

    const initializeMap = () => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map;

        clustererRef.current = new window.kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            minLevel: 5,
            gridSize: 60 // 클러스터의 격자 크기 설정
        });

        console.log('Map initialized');
    };

    const addMarkers = () => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const markers = [];

        companies.forEach((company) => {
            const companyName = company.corpNm;
            geocoder.addressSearch(companyName, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    const marker = new window.kakao.maps.Marker({
                        position: coords
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;z-index:1;">${companyName}</div>`
                    });

                    infowindow.open(mapRef.current, marker);

                    markers.push(marker);

                    // 클러스터러에 마커 추가
                    if (markers.length === companies.length) {
                        clustererRef.current.addMarkers(markers);
                        console.log('Clusterer markers added:', markers);
                    }
                } else {
                    console.log('Geocoder failed for:', companyName, 'with status:', status);
                }
            });
        });
    };

    return (
        <div id="map" style={{ flex: 1, height: '100vh' }}></div>
    );
}

export default KakaoMap;
