import React, { useEffect, useRef, useState } from 'react';
import currentLocationStyles from '@/styles/search/currentLocationBtn.module.css'; // CSS Modules 방식으로 import
import roadviewStyles from '@/styles/search/roadviewAndOverlay.module.css'; // CSS Modules 방식으로 import

import CurrentLocationButton from './currentLocationButton';
import ZoomControl from './zoomControl'; // ZoomControl 컴포넌트 import

const UserLocationMap = ({ companies = [], setMapBounds, searchTriggered, setFilteredCompanies, setLoading, selectedCompany }) => {
    const mapRef = useRef(null);
    const clustererRef = useRef(null);
    const markersRef = useRef([]);
    const customOverlaysRef = useRef([]);
    const currentOverlayRef = useRef(null);
    const currentMarkerRef = useRef(null);
    const roadviewCloseBtnRef = useRef(null);
    const [isRoadviewVisible, setIsRoadviewVisible] = useState(false);
    const [isMapInitialized, setIsMapInitialized] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08e8f7e5d84e3b83d217c292b2ae3bef&libraries=services,clusterer`;
        script.async = true;
        script.onload = () => {
            console.log('Kakao Map script loaded');
            initializeUserLocation();
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const initializeUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                initializeMap(latitude, longitude);
            },
            (error) => {
                console.error("Error getting user location:", error);
                initializeMap(37.5665, 126.9780);  // 기본 위치로 초기화 (서울)
            }
        );
    };

    const initializeMap = (latitude, longitude) => {
        if (window.kakao && window.kakao.maps) {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 3
            };
            const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
            mapRef.current = newMap;
            setIsMapInitialized(true); // 맵 초기화 완료 상태 설정

            clustererRef.current = new window.kakao.maps.MarkerClusterer({
                map: newMap,
                averageCenter: true,
                minLevel: 5,
                gridSize: 60
            });

            window.kakao.maps.event.addListener(newMap, 'idle', () => {
                const bounds = newMap.getBounds();
                setMapBounds(bounds);
            });

            addMarkers(); // 맵 초기화 후 마커 추가
            console.log('Map initialized');
        } else {
            console.error("카카오 맵 객체를 로드하지 못했습니다.");
        }
    };

    useEffect(() => {
        if (mapRef.current) {
            console.log('Companies state changed:', companies);
            addMarkers();
        }
    }, [companies, searchTriggered]);

    useEffect(() => {
        if (selectedCompany && mapRef.current) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(selectedCompany.enpBsadr, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    mapRef.current.setCenter(coords);

                    if (currentOverlayRef.current) {
                        currentOverlayRef.current.setMap(null);
                        currentMarkerRef.current = null;
                    }

                    const overlay = createCustomOverlay(selectedCompany, coords);
                    overlay.setMap(mapRef.current);
                    currentOverlayRef.current = overlay;
                    currentMarkerRef.current = coords;

                    setTimeout(() => {
                        setupInfoWindowEventHandlers(selectedCompany, overlay, coords);
                    }, 0);
                }
            });
        }
    }, [selectedCompany]);

    const addMarkers = async () => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const markers = [];
        const overlays = [];
        const successfulCompanies = [];
        let firstMarkerPosition = null;

        clustererRef.current.clear();
        markersRef.current = [];
        customOverlaysRef.current = [];

        for (const company of companies) {
            const address = company.enpBsadr || company.corpNm;
            const success = await geocodeAddress(geocoder, address, company, markers, overlays);
            if (success) {
                successfulCompanies.push(company);
                if (!firstMarkerPosition) {
                    firstMarkerPosition = new window.kakao.maps.LatLng(success.y, success.x);
                }
            }
        }

        if (markers.length > 0) {
            clustererRef.current.addMarkers(markers);
            markersRef.current = markers;
            customOverlaysRef.current = overlays;
            console.log('Clusterer markers added:', markers);
            if (searchTriggered && firstMarkerPosition) {
                mapRef.current.relayout();
                setLoading(false);
            }
        }

        setFilteredCompanies(successfulCompanies);
    };

    const geocodeAddress = (geocoder, address, company, markers, overlays) => {
        return new Promise((resolve) => {
            geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    const markerImage = new window.kakao.maps.MarkerImage(
                        `/images/marker-icon.png`,
                        new window.kakao.maps.Size(24, 35)
                    );
                    const marker = new window.kakao.maps.Marker({
                        position: coords,
                        image: markerImage
                    });
                    markers.push(marker);

                    const overlay = createCustomOverlay(company, coords);
                    overlays.push(overlay);

                    window.kakao.maps.event.addListener(marker, 'click', () => {
                        console.log('Marker clicked:', company.corpNm);
                        if (currentOverlayRef.current) {
                            currentOverlayRef.current.setMap(null);
                        }
                        overlay.setMap(mapRef.current);
                        currentOverlayRef.current = overlay;

                        setTimeout(() => {
                            setupInfoWindowEventHandlers(company, overlay, coords);
                        }, 0);
                    });

                    resolve({ y: result[0].y, x: result[0].x });
                } else {
                    console.log(`Geocoder failed for: ${address} with status: ${status}`);
                    resolve(false);
                }
            });
        });
    };

    const createCustomOverlay = (company, position) => {
        const content = document.createElement('div');
        content.className = roadviewStyles['custom-overlay'];

        content.innerHTML = `
        <div class="${roadviewStyles['overlay-content']}">
            <div class="${roadviewStyles['close-btn']}">&times;</div>
            <div class="${roadviewStyles['title']}">${company.corpNm}</div>
            <div class="${roadviewStyles['address']}">${company.enpBsadr}</div>
            <img src="/images/marker-icon(1).png" class="${roadviewStyles['roadview-icon']}">
        </div>
        <div class="${roadviewStyles['overlay-arrow']}"></div>
    `;

        const overlay = new window.kakao.maps.CustomOverlay({
            position,
            content,
            yAnchor: 1.4,
            xAnchor: 0.5
        });

        overlay.onClose = () => {
            overlay.setMap(null);
        };

        return overlay;
    };

    const setupInfoWindowEventHandlers = (company, overlay, coords) => {
        const closeButton = overlay.getContent().querySelector(`.${roadviewStyles['close-btn']}`);
        const roadviewIcon = overlay.getContent().querySelector(`.${roadviewStyles['roadview-icon']}`);

        closeButton.onclick = () => {
            overlay.setMap(null);
            currentOverlayRef.current = null;
            currentMarkerRef.current = null;
        };

        roadviewIcon.onclick = () => {
            openRoadview(company, coords);
        };
    };

    const openRoadview = (company, coords) => {
        console.log('로드뷰 아이콘 클릭됨');
        const roadviewContainer = document.getElementById('roadview');
        roadviewContainer.style.display = 'block';
        setIsRoadviewVisible(true); // 로드뷰 표시 상태 변경

        // 닫기 버튼 초기화
        if (roadviewCloseBtnRef.current) {
            roadviewCloseBtnRef.current.style.display = 'none';
            roadviewCloseBtnRef.current = null;
        }

        const roadview = new window.kakao.maps.Roadview(roadviewContainer);
        const roadviewClient = new window.kakao.maps.RoadviewClient();

        roadviewClient.getNearestPanoId(coords, 50, (panoId) => {
            if (panoId !== null) {
                console.log('로드뷰 파노라마 ID:', panoId);
                roadview.setPanoId(panoId, coords);

                // 로드뷰에 마커 추가
                const markerImage = new window.kakao.maps.MarkerImage(
                    `/images/marker-icon.png`,
                    new window.kakao.maps.Size(24, 35)
                );

                const rvMarker = new window.kakao.maps.Marker({
                    position: coords,
                    map: roadview,
                    image: markerImage
                });

                // 로드뷰 마커에 커스텀 오버레이 추가
                const rvOverlay = createCustomOverlay(company, coords);
                rvOverlay.setMap(roadview);

                // 작은 지도 추가
                const mapContainer = document.createElement('div');
                mapContainer.id = 'roadview-map';
                mapContainer.style.position = 'absolute';
                mapContainer.style.bottom = '10px';
                mapContainer.style.left = '10px';
                mapContainer.style.width = '150px';
                mapContainer.style.height = '150px';
                mapContainer.style.zIndex = '9999';
                mapContainer.style.border = '2px solid #1e90ff';
                mapContainer.style.borderRadius = '8px';
                mapContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                roadviewContainer.appendChild(mapContainer);

                const mapOption = {
                    center: coords,
                    level: 4
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);

                const mapMarkerImage = new window.kakao.maps.MarkerImage(
                    `/images/marker-icon(2).png`,
                    new window.kakao.maps.Size(24, 35)
                );

                const mapMarker = new window.kakao.maps.Marker({
                    position: coords,
                    map: map,
                    image: mapMarkerImage
                });

                // 닫기 버튼이 이미 존재하면 display를 block으로 설정하고, 위치와 스타일을 다시 설정합니다.
                if (roadviewCloseBtnRef.current) {
                    roadviewCloseBtnRef.current.style.display = 'block';
                } else {
                    // 로드뷰 닫기 버튼이 없을 경우 추가
                    const closeBtn = document.createElement('div');
                    closeBtn.id = 'roadview-close-btn';
                    closeBtn.className = roadviewStyles['roadview-close-btn'];
                    closeBtn.innerHTML = '&times;';
                    closeBtn.onclick = () => {
                        console.log('로드뷰 닫기 버튼 클릭됨');
                        roadviewContainer.style.display = 'none';
                        setIsRoadviewVisible(false);
                    };
                    roadviewContainer.appendChild(closeBtn);
                    roadviewCloseBtnRef.current = closeBtn;
                }
            } else {
                alert('해당 위치의 로드뷰를 찾을 수 없습니다.');
                console.log('로드뷰를 찾을 수 없음');

                 // 로드뷰를 닫고 원래 지도 화면으로 돌아가기
                roadviewContainer.style.display = 'none';
                setIsRoadviewVisible(false);
            }
        });
    };
    if (typeof window !== 'undefined') {
        window.closeOverlay = function() {
            if (currentOverlayRef.current) {
                currentOverlayRef.current.setMap(null);
                currentOverlayRef.current = null;
            }
        };
    };
    return (
        <div>
            <div id="map" style={{ flex: 1, height: '100vh' }}></div>
            <div id="roadview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'none', zIndex: 10 }}></div>
            <CurrentLocationButton map={mapRef.current} isMapInitialized={isMapInitialized} isRoadviewVisible={isRoadviewVisible} className={currentLocationStyles['button']} />
            <ZoomControl map={mapRef.current} isMapInitialized={isMapInitialized} isRoadviewVisible={isRoadviewVisible} />
        </div>
    );
}

export default UserLocationMap;
