export const fetchCorpInfo = async (params) => {
    try {
        // 요청 URL을 로그로 확인
        const requestUrl = `http://localhost:8080/api/search/corpInfo?${params.toString()}`;

        // API 요청
        const response = await fetch(requestUrl);

        // 응답이 정상인지 확인
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // 응답 데이터를 JSON으로 변환
        const data = await response.json();

        // 응답 데이터가 배열인지 확인
        if (Array.isArray(data)) {

            // 중복된 회사 이름 제거
            const uniqueCorpInfo = data.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.corpNm === item.corpNm
                ))
            );


            // 최종 데이터 변환 및 반환
            const result = uniqueCorpInfo.map(company => ({
                corpNm: company.corpNm,
                enpBsadr: company.enpBsadr || '', // 주소를 추가
                latitude: company.latitude, // 추가된 위도
                longitude: company.longitude // 추가된 경도
            }));

            return result;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
};
