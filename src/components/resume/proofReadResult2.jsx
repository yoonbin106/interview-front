import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Modal as BaseModal } from '@mui/base/Modal';
import { styled, css } from '@mui/system';
import { Tooltip, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {red } from '@mui/material/colors';
import styles from '@/styles/resume/proofreadResult1.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css'; // 새 CSS 파일 임포트
import { closestIndexTo } from 'date-fns';

function ProofreadResult2() {
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const router = useRouter(); // 페이지 이동을 위한 hook

  const handleSelfIntroductionChange = (e) => {
    setSelfIntroduction(e.target.value);
  };

  const handleCancel = () => {
    setIsModalOpen(true); // 모달 열기
    router.push('/resume/proofReadResult1'); // 예시로 메인 페이지로 이동
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const confirmAction = () => {
    setIsModalOpen(false); // 모달 닫기
    router.push('/resume'); // 예시로 메인 페이지로 이동
  };

  const handleNext = () => {
    router.push('/resume/resumeList'); // 다음 페이지로 이동
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sectionWrapper}>
          <h2 className={`${styles.h2} ${styles.sectionheader}`}>
            지원동기 AI 첨삭
            <Tooltip title="AI가 맞춤법 검사 및 작성 내용 판단을 도와줍니다">
              <InfoIcon style={{ marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }} />
            </Tooltip>
          </h2>
        </div>

        <div className={styles.navigationButtons}>
          <button className={styles.prevBtn} onClick={handleCancel}>이전</button>
          <button className={styles.nextBtn} onClick={handleNext}>완료</button>
        </div>

        <div className={styles.row}>
          <div className={`${styles.leftbox} ${styles.flexbox}`} style={{ marginBottom: '12px' }}>
            <h2 className={`${styles.h2}`}>지원동기</h2>
            <div className={styles.textareacontainer}>
              <textarea 
                placeholder="유저에게 받아온 자기소개 글이 들어갑니다"
                value={selfIntroduction}
                onChange={handleSelfIntroductionChange}
                maxLength="2000"
              ></textarea>
              <div className={styles.charcounter}>{selfIntroduction.length}/2000</div>
            </div>
            <div className={styles.buttons} style={{ marginTop: '12px' }}>
              <button className={styles.submitbtn} style={{marginTop:'30px'}}>첨삭하기</button>
            </div>
          </div>

          <div className={`${styles.rightbox} ${styles.flexbox}`} style={{ marginBottom: '12px' }}>
            <h2 className={`${styles.h2}`}>첨삭 결과</h2>
            <div className={styles.feedback}>
              <ThumbUpIcon sx={{ color: blue[500] }}/> &nbsp;
              <label className={styles.label}>이런 점이 좋아요</label>
            </div>
            <div className={styles.resulttextareacontainer} style={{marginBottom:'30px'}} >
              <textarea />
            </div>
            <div className={styles.feedback}>
              <ThumbDownIcon sx={{ color: red[500] }}/> &nbsp;
              <label className={styles.label}>이런 점이 아쉬워요</label>
            </div>
            <div className={styles.resulttextareacontainer} style={{marginBottom:'30px'}}>
              <textarea />
            </div>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isModalOpen}
        onClose={closeModal}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="unstyled-modal-title" className={`${styles.h2} ${styles.modalTitle}`}>
            첨삭을 취소하시겠습니까?
          </h2>
          <div className={modalStyles.modalButtons}>
            <button onClick={closeModal} className={modalStyles.modalCancelButton}>
              취소
            </button>
            <button onClick={confirmAction} className={modalStyles.modalConfirmButton}>
              확인
            </button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

// MUI styled components for Modal
const Backdrop = React.forwardRef(
  ({ open, className, ...other }, ref) => {
    return (
      <div
        className={closestIndexTo({ 'base-Backdrop-open': open }, className)}
        ref={ref}
        {...other}
      />
    );
  }
);

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    justify-content: center; /* 컨텐츠를 수직 방향으로 중앙 정렬 */
    align-items: center; /* 컨텐츠를 수평 방향으로 중앙 정렬 */
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `,
);

export default ProofreadResult2;
