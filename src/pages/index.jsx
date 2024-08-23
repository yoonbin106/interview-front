import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/main.module.css';
import MainEconomicNews from '../components/mainEconomicNews.jsx';//추인철추가



function Home() {
    const [currentImage, setCurrentImage] = useState(0);
    const [progressInterval, setProgressInterval] = useState(0);
    const [timer, setTimer] = useState(null);
    const slidesToShow = 4;  // 한 화면에 보여줄 슬라이드 개수
    const slideWidth = 100 / slidesToShow;  // 슬라이드 하나의 너비 (퍼센트)

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
            subtitle1: "모의면접에 관련된 모든 질문에 즉각 응답합니다.",
            subtitle2: "확실한 정보를 제공합니다.",
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
            subtitle2: "효율적인 학습을 제공합니다.",
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
            {/* 면접 보러가기 화면 */}
            <div className={`${styles.container} ${imageClasses[currentImage]}`}>
                <div className={styles.mainImages}>
                    <div className={styles.mainTitle}>

                    </div>
                    <div className={styles.mainSubtitle}>
                        포커스잡에 오신걸 환영합니다
                    </div>
                    <a className={styles.mainButton} href="#">
                        AI 서비스 체험하기
                        {/* 로그인X=>로그인으로 */}
                        {/* 로그인O=>면접페이지으로 */}
                    </a>
                </div>
            </div>
            {/*두번째 화면  */}
            <div className={styles.container2} id="systemInfo">
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
                                <div className={styles.mainIntroBoxInButtonFrame}>
                                    <a href={contentList[currentIndex].href} className={styles.mainIntroBoxInButton}>
                                        {contentList[currentIndex].buttonText}
                                    </a>
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
                        <div className={styles.keyWordBoxGrey}>
                            <div className={styles.keyWordTextWh}>면접 준비는 "FocusJob"</div>
                            <div className={styles.mainText}>{"포커스잡. 언제 \n어디서나"}</div>
                                    
                        </div>
                        <div className={styles.keyWordBoxWhiteImage}>
                            <div className={styles.aiText}>
                                <div className={styles.line1}>다양한 <span className={styles.boldText}>AI</span> 면접</div>
                                <div className={styles.line2}>편안한 환경에서</div>
                                <div className={styles.line3}>실전처럼 준비하세요</div>
                            </div>
                        </div>



                    </div>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxHeight}>
                        <div className={styles.keyWordTextHeightBl}>
  <p><i className="fas fa-clock"></i> 시간과 장소에 구애받지 않는 면접 연습 지원</p>
  <p><i className="fas fa-brain"></i> 상황별 연습과 답변 내용의 심층 분석을 제공하는 AI 면접 서비스</p>
  <p><i className="fas fa-comments"></i> 면접과 취업 전반에 대한 조언을 제공하는 파인튜닝 챗봇 서비스</p>
  <p><i className="fas fa-eye"></i> 보완점을 한눈에 파악할 수 있는 면접 결과 보고서</p>
</div>
                        </div>
                    </div>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxWhite1}>
                        <div className={styles.keyWordTextBl}>
                        <span className={styles.highlightedText}>포커스잡</span>
                        {" \n실전 대비 연습 "} 
                        {"\n즉시 시작 가능 "} 
                        {"\n실시간 피드백 "} 
                        {"\n개인 맞춤형 연습"}
                        </div>
                        </div>
                        <div className={styles.keyWordBoxWhite}>
                            <div className={styles.keyWordTextBl}>장점2</div>
                        </div>
                    </div>
                    <div className={styles.keyWordFramesWide}>
                    <div className={styles.keyWordBoxWidth}>
                        <div className={styles.keyWordTextWidthWh}>
                            포커스잡은 합격을 위한 AI <span className={styles.highlight}>면접</span> 연습을 지원합니다.
                        </div>
                        <div className={styles.keyWordTextWidthWh}>
                            AI 파트너와 함께, 실전보다 더 철저한 연습을 경험하세요.
                        </div>
                        <div className={styles.keyWordTextWidthWh}>
                            채용 트렌드에 맞춘 완벽한 <span className={styles.highlight}>면접</span> 준비를
                        </div>
                        <div className={styles.keyWordTextWidthWh}>
                            지금 시작하세요!
                        </div>
                    </div>




                        <div className={styles.keyWordBoxGroup}>
                            <div className={styles.keyWordBoxWhite}>
                                <div className={styles.keyWordTextB2}>{"지금 가입하고\n 첫 번째\n 면접\n 연습을\n 무료로\n 체험하세요!"}</div>
                            </div>
                            <div className={styles.keyWordBoxGrey}>
                                <div className={styles.keyWordTextWh1}>{"단계별로 완성하는\n면접 준비의\n모든 것,\n나만의\n방식으로\n따라오세요!"}</div>
                            </div>
                        </div>
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