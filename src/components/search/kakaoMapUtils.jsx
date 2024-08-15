// src/components/kakaoMapUtils.js
export const initializeClusterer = (map) => {
    return new window.kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 5,
        gridSize: 60 // 클러스터의 격자 크기 설정
    });
};

export const addMarkersWithClusterer = (map, clusterer, companies) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const markers = [];

    companies.forEach(company => {
        const companyName = company.corpNm;
        geocoder.addressSearch(companyName, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                const marker = new window.kakao.maps.Marker({
                    position: coords
                });
                markers.push(marker);

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="width:150px;text-align:center;padding:6px 0;">${companyName}</div>`
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    infowindow.open(map, marker);
                });
            }
        });
    });

    clusterer.clear(); // 클러스터링: 기존 클러스터 제거
    clusterer.addMarkers(markers); // 클러스터링: 새 마커 추가
};
