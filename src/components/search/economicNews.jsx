import React, { useEffect, useState } from 'react';
import styles from '@/styles/search/economicNews.module.css';  // 수정된 CSS 모듈

const EconomicNews = () => {
    const [news, setNews] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/economicNews'); 
                if (!response.ok) {
                    throw new Error('뉴스 데이터를 가져오는 데 실패했습니다.');
                }
                const data = await response.json();
                setNews(data); 
            } catch (error) {
                setError(error.message);
                //console.error('Error fetching economic news:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchNews(); 
    }, []);

    if (loading) {
        return <p>뉴스 데이터를 로드 중입니다...</p>; 
    }

    if (error) {
        return <p>오류 발생: {error}</p>; 
    }

    if (news.length === 0) {
        return <p>표시할 뉴스가 없습니다.</p>; 
    }

    return (
        <div className={styles.container}>
            <h2>경제 뉴스</h2>
            <ul>
                {news.map((item, index) => (
                    <li key={index}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <img 
                                src={item.imgUrl} 
                                alt={item.title} 
                                width="110" 
                                height="75"
                                onError={(e) => e.target.src = '/images/default.jpg'} // 이미지 로드 실패 시 대체 이미지로 교체
                            />
                            <div>
                                <strong>{item.title}</strong>
                                <div><span className={styles.press}>{item.press}</span> - <span className={styles.time}>{item.time}</span></div> {/* 기사 작성 단체 및 시간 표시 */}
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EconomicNews;