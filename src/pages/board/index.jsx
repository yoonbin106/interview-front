import React from 'react';
import styles from '@/styles/board/board.module.css';

const Board = () => {
    return (
        <div className={styles.boardFrame}>
            <div className={styles.boardCenterFrameWidth}>
                {/* 사이드 메뉴 부분 */}
                <div className={styles.boardSideFrameHeight}>
                    <div className={styles.boardSideFrame}>
                        <div className={styles.boardSideFrameIn}>
                            <div className={styles.boardSideTitleFrame}>커뮤니티</div>
                            <div className={styles.boardSideLine}></div>
                            <div className={styles.boardSideSubtitleFrame}>자유게시판</div>
                            <div className={styles.boardSideSubtitleFrame}>공지사항</div>
                        </div>
                    </div>
                </div>

                {/* 메인 리스트부분 */}
                <div className={styles.boardCenterFrameHeight}>
                    <div className={styles.boardMainFrame}>
                        <div className={styles.boardMainFrameIn}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>





            </div>
        </div>
    );
};

export default Board;