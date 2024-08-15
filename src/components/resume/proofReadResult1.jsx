import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 임포트
import { Tooltip, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import styles from '@/styles/resume/proofreadResult1.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css'; // 새 CSS 파일 임포트
import { Modal as BaseModal } from '@mui/base/Modal';
import { styled, css } from '@mui/system';
import { closestIndexTo } from 'date-fns';
import { grey, blue } from '@mui/material/colors'; // 추가
import { useRouter } from 'next/router';

function ProofreadResult1() {
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [proofreadResult, setProofreadResult] = useState(''); // 첨삭 결과 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const router = useRouter(); // 페이지 이동을 위한 hook
  useEffect(() => {
    // 데이터 가져오기
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/resume/81'); // API 요청 (예: /api/resume/81)
        setSelfIntroduction(response.data.selfIntroduction); // 응답 데이터에서 selfIntroduction 가져오기
      } catch (error) {
        console.error('데이터 가져오기 에러:', error);
      }
    };

    fetchData();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const handleSelfIntroductionChange = (e) => {
    setSelfIntroduction(e.target.value);
  };

  const handleCancel = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const confirmAction = () => {
    setIsModalOpen(false); // 모달 닫기
    router.push('/resume/resumeList'); // 예시로 메인 페이지로 이동
  };

  const handleNext = () => {
    router.push('/resume/proofReadResult2'); // 다음 페이지로 이동
  };

  const handleProofread = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/proofread', { text: selfIntroduction });
      setProofreadResult(JSON.stringify(response.data.results, null, 2)); // JSON 형식으로 저장
    } catch (error) {
      console.error('맞춤법 검사 에러:', error);
    }
  };


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sectionWrapper}>
          <h2 className={`${styles.sectionheader} ${styles.h2}`}>
            자기소개 맞춤법 검사
            <Tooltip title="AI가 맞춤법 검사 및 작성 내용 판단을 도와줍니다">
              <InfoIcon style={{ marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }} />
            </Tooltip>
          </h2>
        </div>

        <div className={styles.navigationButtons}>
          <button className={styles.prevBtn} onClick={handleCancel}>취소</button>
          <button className={styles.nextBtn} onClick={handleNext}>다음</button>
        </div>

        <div className={styles.row}>
          <div className={`${styles.leftbox} ${styles.flexbox}`} style={{ marginBottom: '12px' }}>
            <h2 className={`${styles.h2}`}>자기소개</h2>
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
              <button className={styles.submitbtn} onClick={handleProofread} style={{marginTop:'30px'}}>첨삭하기</button>
            </div>
          </div>

          <div className={`${styles.rightbox} ${styles.flexbox}`} style={{ marginBottom: '12px' }}>
            <h2 className={`${styles.h2}`}>첨삭 결과</h2>
            <div className={styles.feedback}>
            </div>
            <div className={styles.resulttextareacontainer} style={{marginBottom:'30px'}} >
              <textarea value={proofreadResult} readOnly />
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
    justify-content: center; 
    align-items: center; 
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

export default ProofreadResult1;
