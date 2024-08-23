// /pages/api/naverEconomicNews.js

import axios from 'axios';

export default async function handler(req, res) {
    const clientId = 'A2fvVL2QbQLXV3LQ_g9z'; // 네이버 클라이언트 ID
    const clientSecret = 'cMJZTEHQIN'; // 네이버 클라이언트 시크릿

    const query = '네이버 뉴스'; // 검색어
    const display = 35; // 가져올 뉴스 개수
    const sort = 'date'; // 정렬 방식 (날짜순)
    
    const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&sort=${sort}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
            },
        });

        const newsItems = response.data.items;
        res.status(200).json(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
