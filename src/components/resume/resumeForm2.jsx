import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/resume/resumeForm2.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css';
import proofreadStyles from '@/styles/resume/proofreadStyles.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled('div')`
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
    background-color: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434D5B' : '#E5EAF2'};
    box-shadow: 0 4px 12px ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? '#F3F6F9' : '#1C2025'};
  `,
);

function ResumeForm2() {
  const router = useRouter();
  const { resumeId } = router.query;
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);
  const [proofreadResult, setProofreadResult] = useState([]);
  const [isAiProofreadSidebarOpen, setIsAiProofreadSidebarOpen] = useState(false);
  const [aiProofreadResult, setAiProofreadResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      fetchProofreadData();
    }
  }, [resumeId]);

  const fetchProofreadData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/resume/proofread/${resumeId}`);
      if (response.data) {
        setSelfIntroduction(response.data.selfIntroduction || '');
        setMotivation(response.data.motivation || '');
      }
    } catch (error) {
      console.error('첨삭 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const handleSelfIntroductionChange = (e) => {
    setSelfIntroduction(e.target.value);
  };

  const handleMotivationChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleProofread = async (text) => {
    if (text.trim() === '') {
      setProofreadResult([]);
      setIsProofreadSidebarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/check-spelling', {
        sentence: text,
      });

      if (response.data.length === 0) {
        setProofreadResult([]);
      } else {
        setProofreadResult(response.data);
      }

      setIsProofreadSidebarOpen(true);
    } catch (error) {
      console.error('맞춤법 검사 중 오류 발생:', error);
      setProofreadResult([]);
      setIsProofreadSidebarOpen(true);
    }
  };

  const handleAiProofread = async (text, type) => {
    if (text.trim() === '') {
      setAiProofreadResult([{ message: "입력된 텍스트가 없습니다." }]);
      setIsAiProofreadSidebarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const endpoint = type === 'selfIntroduction' ? 'chatgpt-self' : 'chatgpt-motivation';
      const response = await axios.post(`http://localhost:8080/api/${endpoint}`, {
        text,
      });

      if (response.data) {
        const formattedText = response.data.split('▶').map((item, index) => {
          if (index > 0) {
            return (
              <div key={index} style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '6px', position: 'relative', top: '-3.5px' }}>●</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span dangerouslySetInnerHTML={applyColorToQuotes(item)} />
              </div>
            );
          }
          return <span key={index} dangerouslySetInnerHTML={applyColorToQuotes(item)} />;
        });

        setAiProofreadResult([{ message: formattedText }]);
      } else {
        setAiProofreadResult([{ message: "AI 첨삭 결과를 불러오지 못했습니다." }]);
      }

      setIsAiProofreadSidebarOpen(true);
    } catch (error) {
      console.error('AI 첨삭 중 오류 발생:', error);
      setAiProofreadResult([{ message: "AI 첨삭 중 오류가 발생했습니다." }]);
      setIsAiProofreadSidebarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const applyColorToQuotes = (text) => {
    if (typeof text !== 'string') {
      return text;
    }

    const coloredText = text.replace(/##([^#]+)##/g, "<span style='color:#5A8AF2;'>$1</span>");
    return { __html: coloredText };
  };

  const closeProofreadSidebar = () => {
    setIsProofreadSidebarOpen(false);
  };

  const closeAiProofreadSidebar = () => {
    setIsAiProofreadSidebarOpen(false);
  };

  const navigateToResumeList = () => {
    router.push('/resume/resumeList');
  };

  return (
    <div className={`${styles.body} ${styles.resumeForm}`}>
      <div id="resume-content">
        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <div className={styles.sectionHeaderContainer}>
                <h2 className={styles.sectionHeader} >자기소개</h2>
                <button
                  type="button"
                  className={proofreadStyles.proofreadButton}
                  onClick={() => handleProofread(selfIntroduction)}
                >
                  맞춤법 검사
                </button>
                <button
                  type="button"
                  className={proofreadStyles.aiproofreadButton}
                  onClick={() => handleAiProofread(selfIntroduction, 'selfIntroduction')}
                  style={{ marginLeft: '10px' }}
                >
                  AI 첨삭 실행
                </button>
              </div>
              <div className={styles.textareaContainer}>
                <textarea
                  value={selfIntroduction}
                  onChange={handleSelfIntroductionChange}
                  maxLength="2000"
                />
                <div className={styles.charCounter}>{selfIntroduction.length}/2000</div>
              </div>
            </div>

            <hr className={styles.hr} />

            <div className={styles.formGroup}>
              <div className={styles.sectionHeaderContainer}>
                <h2 className={styles.sectionHeader}>지원동기</h2>
                <button
                  type="button"
                  className={proofreadStyles.proofreadButton}
                  onClick={() => handleProofread(motivation)}
                >
                  맞춤법 검사
                </button>
                <button
                  type="button"
                  className={proofreadStyles.aiproofreadButton}
                  onClick={() => handleAiProofread(motivation, 'motivation')}
                  style={{ marginLeft: '10px' }}
                >
                  AI 첨삭 실행
                </button>
              </div>
              <div className={styles.textareaContainer}>
                <textarea
                  value={motivation}
                  onChange={handleMotivationChange}
                  maxLength="2000"
                />
                <div className={styles.charCounter}>{motivation.length}/2000</div>
              </div>
            </div>

            <div className={styles.centerButtons} style={{ marginTop: '30px' }}>
              <div className={styles.formGroup}>
                <button
                  type="button"
                  className={`${styles.submitBtn} ${styles.sameWidthBtn} ${styles.button}`}
                  onClick={navigateToResumeList}
                >
                  목록으로
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isProofreadSidebarOpen && (
        <div className={`${proofreadStyles.proofreadSidebar} ${isProofreadSidebarOpen ? proofreadStyles.open : ''}`}>
          <div className={proofreadStyles.sidebarHeader} >
          <h3 style={{ borderBottom: '2px solid black', paddingBottom: '5px' }}>맞춤법 검사 결과</h3>
            <button className={proofreadStyles.closeButton} onClick={closeProofreadSidebar}>
              <CloseIcon />
            </button>
          </div>
          <div className={proofreadStyles.sidebarContent}>
            {proofreadResult.length > 0 ? (
              <ul>
                {proofreadResult.map((item, index) => (
                  <li key={index} className={proofreadStyles.resultItem}>
                    <p><strong>잘못된 표현 :</strong> {item.token}</p>
                    <p><strong>수정 제안 :</strong> {item.suggestions.join(', ')}</p>
                    <p><strong>수정 이유 :</strong> {item.info}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>맞춤법 검사 결과가 없습니다.</p>
            )}
          </div>
        </div>
      )}

      {isAiProofreadSidebarOpen && (
        <div className={`${proofreadStyles.aiproofreadSidebar} ${isAiProofreadSidebarOpen ? proofreadStyles.open : ''}`}>
          <div className={proofreadStyles.sidebarHeader}>
          <h3 style={{ borderBottom: '2px solid black', paddingBottom: '5px' }}>AI 첨삭 결과</h3>
            <button className={proofreadStyles.closeButton} onClick={closeAiProofreadSidebar}>
              <CloseIcon />
            </button>
          </div>
          <div className={proofreadStyles.sidebarContent}>
            {aiProofreadResult.length > 0 ? (
              <ul>
                {aiProofreadResult.map((item, index) => (
                  <li key={index} className={proofreadStyles.resultItem}>
                    <p>{applyColorToQuotes(item.message)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>AI 첨삭 결과가 없습니다.</p>
            )}
          </div>
        </div>
      )}

      <Modal
        aria-labelledby="loading-modal-title"
        aria-describedby="loading-modal-description"
        open={loading}
        onClose={() => {}}
        slots={{ backdrop: StyledBackdrop }}
        disableScrollLock
      >
        <ModalContent sx={{ width: 300 }}>
          <div className={modalStyles.spinner}></div> {/* 스피너 추가 */}
          <h2 id="loading-modal-title" className={modalStyles.modalText}>
            AI 첨삭 중...
          </h2>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ResumeForm2;
