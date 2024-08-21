import styles from '@/styles/main.module.css';
const Payment = () => {
    return (
        <>
            <div>

                {/* 요금제 섹션들 */}
                <div className={styles.container4} id="tickets">
                    <div className={styles.ticketheader}>요금제</div>
                    <div className={styles.ticketSubheader}>“ 합리적인 가격에 확실한 결과를 볼 수 있는 기회 ”</div>

                    {/*  */}
                    <div className={styles.ticketplansFrame}>

                        <div className={styles.ticketplansFrameIn}>
                            <div className={styles.ticketplansFrames}>
                                <div className={styles.tickettitle}>무료</div>
                                <div className={styles.ticketInfo}>
                                    <div className={styles.ticketInfoIn}>
                                        <div>전체 등급<br />
                                            총합 평가<br />
                                            추천지수<br />
                                            평가 항목별 점수<br /></div>
                                    </div>
                                </div>
                                <div className={styles.ticketButtonFrame}>
                                    <a href='#' className={styles.ticketbutton}>가입하기</a>
                                </div>
                            </div>
                        </div>

                        <div className={styles.ticketplansFrameIn}>
                            <div className={styles.ticketplansFrames}>
                                <div className={styles.tickettitle}>베이직 요금제</div>
                                <div className={styles.ticketInfo}>
                                    <div className={styles.ticketInfoIn}>
                                        <div>전체 등급<br />
                                            총합 평가<br />
                                            추천지수<br />
                                            평가 항목별 점수<br />
                                            +<br />
                                            성격특성<br />
                                            성격분석<br /></div>
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
                                <div className={styles.tickettitle}>프리미엄 요금제</div>
                                <div className={styles.ticketInfo}>
                                    <div className={styles.ticketInfoIn}>
                                        <div>전체 등급<br />
                                            총합 평가<br />
                                            추천지수<br />
                                            평가 항목별 점수<br />
                                            성격특성<br />
                                            성격분석<br />
                                            +<br />
                                            시선처리<br />
                                            표정분석<br />
                                            음성분석<br />
                                            키워드분석<br />
                                            답변시간 분석<br /></div>
                                    </div>
                                </div>
                                <div className={styles.ticketButtonFrame}>
                                    <div>10,000 원</div>
                                    <a href='#' className={styles.ticketbutton}>결제하기</a>
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