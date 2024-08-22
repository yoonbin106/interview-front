import { fetchMainEconomicNews } from '@/api/mainEconomicNewsApi'; // API 함수 경로

export default async function handler(req, res) {
   

    try {
        // 크롤링 수행 및 뉴스 리스트 가져오기

        const newsList = await fetchMainEconomicNews();
        
        // 성공적으로 가져온 뉴스 아이템 개수 출력
     

        // JSON 형식으로 응답 반환
       
        res.status(200).json(newsList);
        
    } catch (error) {
        // 오류 처리 및 로그 출력
       
        res.status(500).json({ error: 'Failed to fetch main economic news' });
    }

   
}
