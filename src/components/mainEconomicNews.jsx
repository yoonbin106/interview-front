import React, { useEffect, useState, useRef } from 'react';
import styles from '@/styles/main.module.css';

const MainEconomicNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideTrackRef = useRef(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/mainEconomicNews');
                if (!response.ok) {
                    throw new Error('뉴스 데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                setNews([...data, data[0]]); // 슬라이드 데이터를 복제하여 첫 슬라이드를 마지막에 추가
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        if (slideTrackRef.current) {
            if (currentSlide === news.length - 1) { // 마지막 슬라이드 도달
                setTimeout(() => {
                    slideTrackRef.current.style.transition = 'none';
                    slideTrackRef.current.style.transform = 'translateX(0)'; // 트랜지션 없이 첫 슬라이드로 이동
                    setCurrentSlide(0);
                }, 500); // 트랜지션 끝난 후 딜레이 적용
            } else {
                slideTrackRef.current.style.transition = 'transform 0.5s ease-in-out';
                slideTrackRef.current.style.transform = `translateX(-${currentSlide * 100 / news.length}%)`;
            }
        }
    }, [currentSlide, news.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? news.length - 2 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => prev + 1);
    };

    if (loading) {
        return <p>뉴스 데이터를 불러오는 중입니다...</p>;
    }

    if (error) {
        return <p>오류: {error}</p>;
    }

    if (news.length === 0) {
        return <p>뉴스가 없습니다.</p>;
    }

    return (
        <div className={styles.newsSliderContainer}>
            <div className={styles.newsTitleFrame}>
                <div className={styles.newsTitle}>News</div>
            </div>
            <div className={styles.newsSlider}>
                <button className={`${styles.newsSliderControl} ${styles.prev}`} onClick={prevSlide}>
                    &#10094;
                </button>
                <div
                    ref={slideTrackRef}
                    className={styles.newsSlideTrack}
                    style={{
                        transform: `translateX(-${currentSlide * 100 / news.length}%)`,
                        width: `${news.length * 100}%`,
                    }}
                >
                    {news.map((item, index) => (
                        <div key={index} className={styles.newsSlide}>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <div className={styles.newsSlideContent}>
                                    <p className={styles.subTitle}>주요 소식</p>
                                    <strong className={styles.newsSlideTitle}>{item.title}</strong>
                                    <div className={styles.newsSlideInfo}>
                                        <div className={styles['invisible-space']}></div>
                                        <div className={styles.newsSlideLine}></div>
                                        <div className={styles['invisible-space']}></div>
                                        <span className={styles.newsSlideTime}>{item.time}</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
                <button className={`${styles.newsSliderControl} ${styles.next}`} onClick={nextSlide}>
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default MainEconomicNews;
