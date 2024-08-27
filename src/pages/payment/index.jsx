import React from 'react';
import styles from '@/styles/main.module.css';
import { Icon } from '@mui/material';
import BasicPaymentCheckoutPage from '@/components/payment/tossPayBasic';
import PremiumPaymentCheckoutPage from '@/components/payment/tossPayPremium';
import { cancelPayment } from 'api/user';
import FaceIcon from '@mui/icons-material/Face'; // 표정 분석
import VolumeUpIcon from '@mui/icons-material/VolumeUp'; // 음성 분석
import SearchIcon from '@mui/icons-material/Search'; // 키워드 분석
import TimerIcon from '@mui/icons-material/Timer'; // 답변시간 분석
import VisibilityIcon from '@mui/icons-material/Visibility'; // 시선 처리
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'; // 성격 특성
import AssessmentIcon from '@mui/icons-material/Assessment'; // 성격 분석
import ThreeDPentagonIcon from '@/pages/payment/ThreeDPentagonIcon'; // 새로 만든 3D 오각형 아이콘

const Payment = () => {

    // const cancelPayment2 = () => {
    //     const paymentKey = "tviva20240826084742TRaw4"; // 실제 paymentKey 값을 사용
    //     cancelPayment(paymentKey);
    // };

    return (
        <>
            <div>

                {/* 요금제 섹션들 */}
                <div className={styles.container4} id="tickets">
                    <div className={styles.ticketheader}>플랜 안내</div>
                    <div className={styles.ticketSubheader}>“ 합리적인 가격에 확실한 결과를 볼 수 있는 기회 ”</div>

                    {/* 요금제 플랜 */}
                    <div className={styles.ticketplansFrame}>

                        {/* 무료 플랜 */}
                        <div className={`${styles.ticketplansFrameIn}`}>
                            <div className={styles.ticketplansFrames}>
                                <div className={styles.tickettitle}>
                                    <ThreeDPentagonIcon sx={{ fontSize: 24, marginRight: '8px' }} mainColor="#CD7F32" shadowColor="#8B4513" />
                                    무료
                                </div>
                                <div className={styles.ticketInfo}>
                                    <div className={styles.ticketInfoIn}>
                                        <div className={styles.ticketInfoTitle}>평가 항목</div>
                                        <div>전체 등급</div>
                                        <div>총합 평가</div>
                                        <div>추천 지수</div>
                                        <div>평가 항목별 점수</div>
                                    </div>
                                </div>
                                <div className={styles.ticketButtonFrame}>
                                    <a href='#' className={styles.ticketbutton}>가입하기</a>
                                </div>
                            </div>
                        </div>

                        {/* 베이직 10회 플랜 */}
                        <div className={`${styles.ticketplansFrameIn}`}>
                            <div className={styles.ticketplansFrames}>
                                <div className={styles.tickettitle}>
                                    <ThreeDPentagonIcon sx={{ fontSize: 24, marginRight: '8px' }} mainColor="#C0C0C0" shadowColor="#A9A9A9" />  
                                    베이직 10회
                                </div>
                                <div className={styles.ticketInfo}>
                                    <div className={styles.ticketInfoIn}>
                                        <div className={styles.ticketInfoTitle}>무료 플랜 평가에 추가로 아래 기능들을 더 제공합니다</div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <EmojiPeopleIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            성격 특성
                                        </div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <AssessmentIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            성격 분석
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.ticketButtonFrame}>
                                    <div className={styles.price}>1,000 원</div>
                                    <BasicPaymentCheckoutPage />
                                </div>
                            </div>
                        </div>

                        {/* 프리미엄 20회 + 1회 플랜 */}
                        <div className={`${styles.ticketplansFrameIn} ${styles.recommendedPlan}`}>
                            <div className={styles.ribbon}><span>추천</span></div>
                            <div className={styles.ticketplansFrames}>
                                <div className={styles.tickettitle}>
                                    <ThreeDPentagonIcon sx={{ fontSize: 24, marginRight: '8px' }} mainColor="#FFD700" shadowColor="#B8860B" />
                                    프리미엄 20회
                                </div>
                                <div className={styles.ticketInfo}>
                                    <div className={styles.ticketInfoIn}>
                                        <div className={styles.ticketInfoTitle}>베이직 플랜 평가에 추가로 아래 기능들을 더 제공합니다</div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <VisibilityIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            시선 처리
                                        </div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <FaceIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            표정 분석
                                        </div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <VolumeUpIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            음성 분석
                                        </div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <SearchIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            키워드 분석
                                        </div>
                                        <div className={styles.ticketInfoTitleSub}>
                                            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ color: '#2C3E50', fontSize: 16, marginRight: '8px' }} />
                                            <TimerIcon sx={{ color: '#5A8AF2', fontSize: 20, marginLeft: '8px' }} />
                                            답변시간 분석
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.ticketButtonFrame}>
                                    <div className={styles.price}>9,500 원</div>
                                    <PremiumPaymentCheckoutPage />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </>
    );
};

export default Payment;
