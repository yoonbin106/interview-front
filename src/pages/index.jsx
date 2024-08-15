import React, { useEffect, useState } from 'react';
import styles from '@/styles/main.module.css';

function Home() {
    const [currentImage, setCurrentImage] = useState(0);
    const [progressInterval, setProgressInterval] = useState(0);
    const [timer, setTimer] = useState(null);

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
                        모의면접
                    </div>
                    <div className={styles.mainSubtitle}>
                        모의면접에 오신걸 환영합니다
                    </div>
                    <a className={styles.mainButton} href="#">
                        모의면접 보러가기
                        {/* 로그인X=>로그인으로 */}
                        {/* 로그인O=>면접페이지으로 */}
                    </a>
                </div>
            </div>
            {/*  */}
            <div className={styles.container2}>
                <div className={styles.mainIntroFrameW}>
                    <div className={styles.mainIntroFrameH}>

                        <div className={styles.mainIntroTitleFrame}>
                            <div className={styles.mainIntroTitle}>모의면접</div>
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
            {/*  */}
            <div className={styles.containe3}>
                <div className={styles.keyWordFrame}>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxGrey}>
                            <div className={styles.keyWordTextWh}>모의면접 키워드</div>
                        </div>
                        <div className={styles.keyWordBoxWhite}>
                            <div className={styles.keyWordTextBl}>그림이나 임티</div>
                        </div>
                    </div>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxHeight}>
                            <div className={styles.keyWordTextHeightBl}>힘내는말들</div>
                        </div>
                    </div>
                    <div className={styles.keyWordFrames}>
                        <div className={styles.keyWordBoxWhite}>
                            <div className={styles.keyWordTextBl}>모의면접 키워드</div>
                        </div>
                        <div className={styles.keyWordBoxWhite}>
                            <div className={styles.keyWordTextBl}>아니면 쓰는 기술키워드들</div>
                        </div>
                    </div>
                    <div className={styles.keyWordFramesWide}>
                        <div className={styles.keyWordBoxWidth}>
                            <div className={styles.keyWordTextWidthWh}>포인트가될 말들</div>
                        </div>
                        <div className={styles.keyWordBoxGroup}>
                            <div className={styles.keyWordBoxWhite}>
                                <div className={styles.keyWordTextBl}>모의면접 키워드</div>
                            </div>
                            <div className={styles.keyWordBoxGrey}>
                                <div className={styles.keyWordTextWh}>모의면접 키워드</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 기타 섹션들 */}
            <div className={styles.container4}>
                <div className={styles.ticketheader}>요금제</div>
                <div className={styles.ticketSubheader}>“ 합리적인 가격에 확실한 결과를 볼 수 있는 기회 ”</div>

                {/*  */}
                <div className={styles.ticketplansFrame}>

                    <div className={styles.ticketplansFrameIn}>
                        <div className={styles.ticketplansFrames}>
                            <div className={styles.tickettitle}>무료 혜택</div>
                            <div className={styles.ticketInfo}>
                                <div className={styles.ticketInfoIn}>
                                    <div>무료 혜택</div>
                                </div>
                            </div>
                            <div className={styles.ticketButtonFrame}>
                                <a href='#' className={styles.ticketbutton}>가입하기</a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.ticketplansFrameIn}>
                        <div className={styles.ticketplansFrames}>
                            <div className={styles.tickettitle}>1회 요금제</div>
                            <div className={styles.ticketInfo}>
                                <div className={styles.ticketInfoIn}>
                                    <div>1회 요금제</div>
                                </div>
                            </div>
                            <div className={styles.ticketButtonFrame}>
                                <div>1,000 원</div>
                                <a href='#' className={styles.ticketbutton}>결제하기</a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.ticketplansFrameIn}>
                        <div className={styles.ticketplansFrames}>
                            <div className={styles.tickettitle}>10회+1회 요금제</div>
                            <div className={styles.ticketInfo}>
                                <div className={styles.ticketInfoIn}>
                                    <div>10회+1회 요금제</div>
                                </div>
                            </div>
                            <div className={styles.ticketButtonFrame}>
                                <div>10,000 원</div>
                                <a href='#' className={styles.ticketbutton}>결제하기</a>
                            </div>

                        </div>
                    </div>

                </div>

                {/*  */}
            </div>
            {/*  */}
        </div>
    );
}

export default Home;