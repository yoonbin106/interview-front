import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/main.module.css';
import MainEconomicNews from '../components/mainEconomicNews.jsx';//추인철추가
import { useRouter } from 'next/router';
import ScrollButtons from 'components/layout/scrollButtons.jsx';



function Home() {
    const [currentImage, setCurrentImage] = useState(0);
    const [progressInterval, setProgressInterval] = useState(0);
    const [timer, setTimer] = useState(null);
    const slidesToShow = 4;  // 한 화면에 보여줄 슬라이드 개수
    const slideWidth = 100 / slidesToShow;  // 슬라이드 하나의 너비 (퍼센트)
    const systemInfoRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        setCurrentIndex(0);
    }, []);

    const imageClasses = [
        styles.image1,
        styles.image2,
        styles.image3,
        styles.image4,
        styles.image5
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) =>
                prevImage === imageClasses.length - 1 ? 0 : prevImage + 1
            );
        }, 5000); // 5초마다 이미지 변경

        return () => clearInterval(interval);
    }, [imageClasses.length]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const contentList = [
        {
            title: "언제든 물어보세요!",
            subtitle1: "AI 챗봇에게 서비스 사용 방법을 물어보세요.",
            subtitle2: "“모의면접”에 최적화된 해결방법을 알려드립니다.",
            buttonText: "사용하기",
            href: "/chatBot",
            bgClass: 'bgImage1'
        },
        {
            title: "이력서 첨삭",
            subtitle1: "맟춤법 검사 및 AI 첨삭 기능 제공.",
            subtitle2: "확실하고 편리하게 작성하세요!",
            buttonText: "사용하기",
            href: "/resume",
            bgClass: 'bgImage2'
        },
        {
            title: "비대면 면접",
            subtitle1: "최신 트렌드를 반영한 면접 질문 제공.",
            subtitle2: "지금 확인하세요!",
            buttonText: "사용하기",
            href: "/interview",
            bgClass: 'bgImage3'
        },
        {
            title: "AI 면접 평가",
            subtitle1: "사용자에 맞춘 맞춤형 면접 준비.",
            subtitle2: "이력서를 기반으로 면접을 보실 수 있습니다.",
            buttonText: "사용하기",
            href: "/interviewResult",
            bgClass: 'bgImage4'
        },
        {
            title: "사람들과 실시간 소통",
            subtitle1: "언제 어디서든 접근 가능.",
            subtitle2: "지금 바로 활용해보세요.",
            buttonText: "사용하기",
            href: "/chat",
            bgClass: 'bgImage5'
        },
    ];

    const totalDuration = 5 * contentList.length; // 전체 시간 (초 단위)
    const progressWidth = 500 / contentList.length; // 각 contentList에 해당하는 progress bar의 넓이

    const handleProgressClick = (index) => {
        // 현재 애니메이션을 중단하고 인덱스를 업데이트
        setCurrentIndex(index);  // 클릭된 인덱스로 상태 업데이트
    };

    


    const handleServiceIntroClick = () => {
        if (systemInfoRef.current){
            systemInfoRef.current.scrollIntoView({behavior:'smooth'});
        }
    }

    const handleButtonClick = () => {
        router.push('/interview');
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === contentList.length - 1 ? 0 : prevIndex + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [contentList.length]);

    useEffect(() => {
        const activeBars = document.querySelectorAll(`.${styles.mainIntroProgressBar}`);
        activeBars.forEach((bar, index) => {
            if (index === currentIndex) {
                bar.style.transition = 'none';  // 트랜지션 비활성화
                bar.style.width = '0px';  // 초기화
                setTimeout(() => {
                    bar.style.transition = 'width 5s linear';  // 트랜지션 활성화
                    bar.style.width = '280px';  // 애니메이션 시작
                }, 50);  // 짧은 지연
            }
        });
    }, [currentIndex]);


    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgressInterval((prev) => prev + progressWidth); // 초당 진행도 증가
        }, 1000); // 1초마다 업데이트

        return () => clearInterval(progressInterval);
    }, [currentIndex, progressWidth]);


    return (
        <div>
              <ScrollButtons />
            {/* 면접 보러가기 화면 */}
            <div className={`${styles.container} ${imageClasses[currentImage]}`}>
                <div className={styles.mainImages}>
                    <div className={styles.mainTitle}>

                    </div>
                    <div className={styles.mainSubtitle}>
                        AI 기반 이력서 등록 및 모의 면접 서비스 제공<br/>
                        포커스잡에 오신걸 환영합니다
                    </div>
                    <div className={styles.buttonContainer}>
                    <a className={styles.mainButtonOne} onClick={handleServiceIntroClick}>
                        서비스 소개
                    </a>
                    <a className={styles.mainButtonTwo} onClick={handleButtonClick}>
                        AI 면접 시작하기
                        {/* 로그인X=>로그인으로 */}
                        {/* 로그인O=>면접페이지으로 */}
                    </a>
                    </div>
                </div>
            </div>
            {/*두번째 화면  */}
            <div className={styles.container2} id="systemInfo" ref={systemInfoRef}>
                <div className={styles.mainIntroFrameW}>
                    <div className={styles.mainIntroFrameH}>

                        <div className={styles.mainIntroTitleFrame}>
                            <div className={styles.mainIntroTitle}>포커스잡</div>
                            <div className={styles.mainIntroTitle}>어떤 서비스가 있나요?</div>
                        </div>
                        {/* 내용바뀌는 부분 */}

                        <div className={`${styles.mainIntroBox} ${styles[contentList[currentIndex].bgClass]}`}>
                            <div className={styles.mainIntroBoxIn}>

                                <div className={styles.mainIntroBoxInTitle}>{contentList[currentIndex].title}</div>
                                <div className={styles.mainIntroBoxInSubtitleFrame}>
                                    <div className={styles.mainIntroBoxInSubtitle}>{contentList[currentIndex].subtitle1}</div>
                                    <div className={styles.mainIntroBoxInSubtitle}>{contentList[currentIndex].subtitle2}</div>
                                </div>
                    
                                {/* 진행 바를 여러 개 생성 */}
                                <div className={styles.mainIntroProgress}>
                                    {contentList.map((_, index) => (
                                        <div
                                            key={`${index}-${currentIndex}`}  // key 속성에 currentIndex 추가
                                            className={styles.mainIntroProgressWrapper}
                                            onClick={() => handleProgressClick(index)}
                                        >
                                            <div className={styles.mainIntroProgressBarBase}></div>
                                            <div
                                                className={`${styles.mainIntroProgressBar} ${currentIndex === index ? styles.active : ''}`}
                                                style={{ width: currentIndex === index ? '280px' : '0px' }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        {/*  */}


                    </div>
                </div>
            </div>
            {/* 키워드 */}
            <div className={styles.container3}>
                <div className={styles.keyWordFrame}>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxGrey_first}/>
                                            
                        <div className={styles.keyWordBoxWhiteImage}/>
                          
                        



                    </div>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxHeight}/>         
                    </div>
                    <div className={styles.keyWordFramesWide}>
                        
                            <div className={styles.keyWordBoxGroup}>
                                <div className={styles.keyWordBoxWhite}/>
                                <div className={styles.keyWordBoxWhite1}/>
                            </div>
                            <div className={styles.keyWordBoxWidth}/>
                        </div>
                    </div>
            </div>
          {/* 추인철 뉴스칸 */}
        <div className={styles.container5} id='news'>
            <div className={styles.newsFrameW}>
                <div className={styles.newsFrameH}>
                    <div className={styles.newsFrame}>
                        <div className={styles.newsTitleFrame}>
                            <div className={styles.newsTitle}></div>
                        </div>
                        <MainEconomicNews />  {/* 뉴스 데이터를 표시할 컴포넌트를 여기에 삽입 */}
                    </div>
                </div>
            </div>
        </div>
        {/* 추인철 뉴스칸 끝 */}
        </div>
    );
}

export default Home;