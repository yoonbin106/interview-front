import { fetchMainEconomicNews } from '@/api/mainEconomicNewsApi'; // API 함수 경로

export default async function handler(req, res) {
    console.log('1. [API 시작] /api/mainEconomicNews 요청이 들어왔습니다.');

    try {
        // 크롤링 수행 및 뉴스 리스트 가져오기
        console.log('2. [크롤링 시작] fetchMainEconomicNews 호출');
        const newsList = await fetchMainEconomicNews();
        
        // 성공적으로 가져온 뉴스 아이템 개수 출력
        console.log(`3. [크롤링 성공] 뉴스 아이템 개수: ${newsList.length}개`);

        // JSON 형식으로 응답 반환
        console.log('4. [응답 반환] 클라이언트에 JSON 형식으로 응답 반환');
        res.status(200).json(newsList);
        
    } catch (error) {
        // 오류 처리 및 로그 출력
        console.error('5. [오류 발생] /api/mainEconomicNews 핸들러 오류:', error.message);
        res.status(500).json({ error: 'Failed to fetch main economic news' });
    }

    console.log('6. [API 종료] /api/mainEconomicNews 요청 처리 완료');
}
