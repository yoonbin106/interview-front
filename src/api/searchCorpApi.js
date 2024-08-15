export const fetchCorpInfo = async (params) => {
    try {
        // 요청 URL을 로그로 확인
        const requestUrl = `http://localhost:8080/api/search/corpInfo?${params.toString()}`;
        console.log('API 요청 URL:', requestUrl);

        // API 요청을 보내기 전 파라미터 확인
        console.log('요청 파라미터:', params);

        // API 요청
        const response = await fetch(requestUrl);
        console.log('API 요청 응답 상태:', response.status);

        // 응답이 정상인지 확인
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // 응답 데이터를 JSON으로 변환
        const data = await response.json();
        console.log('API 응답 데이터:', data);

        // 응답 데이터가 배열인지 확인
        if (Array.isArray(data)) {
            console.log('응답 데이터는 배열입니다.');

            // 중복된 회사 이름 제거
            const uniqueCorpInfo = data.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.corpNm === item.corpNm
                ))
            );

            console.log('중복 제거 후 회사 정보:', uniqueCorpInfo);

            // 최종 데이터 변환 및 반환
            const result = uniqueCorpInfo.map(company => ({
                corpNm: company.corpNm,
                enpBsadr: company.enpBsadr || '', // 주소를 추가
                latitude: company.latitude, // 추가된 위도
                longitude: company.longitude // 추가된 경도
            }));

            console.log('최종 반환 데이터:', result);
            return result;
        } else {
            console.error('Unexpected API response format:', data);
            return [];
        }
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};
