// /components/search/naverEconomicNews.js

import React, { useEffect, useState } from 'react';
import styles from '@/styles/search/naverEconomicNews.module.css';

function NaverEconomicNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/naverEconomicNews');
                const data = await response.json();

                // 네이버 뉴스만 필터링
                const naverNews = data.filter(item => item.link.includes('news.naver.com'));

                setNews(naverNews);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // HTML 엔티티를 디코딩하는 함수
    const decodeHtmlEntity = (str) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <h2>뉴스</h2>
            <ul>
                {news.map((item, index) => (
                    <li key={index}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {decodeHtmlEntity(item.title.replace(/<[^>]+>/g, ''))} {/* HTML 태그 제거 및 엔티티 디코딩 */}
                        </a>
                        <p className="time">{new Date(item.pubDate).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NaverEconomicNews;
