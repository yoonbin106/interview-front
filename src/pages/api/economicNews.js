// import { fetchEconomicNews } from '@/api/economicNewsApi';

// export default async function handler(req, res) {
//     try {
//         //console.log('API request received at /api/economicNews');
//         const newsList = await fetchEconomicNews(); // 크롤링 수행 및 뉴스 리스트 가져오기
//         //console.log('Successfully fetched news list:', newsList.length, 'items'); // 성공적으로 가져온 뉴스 아이템 개수 출력
//         res.status(200).json(newsList); // JSON 형식으로 응답 반환
//     } catch (error) {
//         //console.error('Error in /api/economicNews:', error.message);
//         res.status(500).json({ error: 'Failed to fetch economic news' }); // 오류 처리
//     }
// }
