import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/resume/resumeForm.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css';
import proofreadStyles from '@/styles/resume/proofreadStyles.module.css';
import CloseIcon from '@mui/icons-material/Close';

function ResumeForm2() {
  const router = useRouter();
  const { resumeId } = router.query;  // Query param으로 받은 resumeId
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);
  const [proofreadResult, setProofreadResult] = useState([]); // 맞춤법 검사 결과 상태 추가

  useEffect(() => {
    if (resumeId) {
      fetchProofreadData();  // DB에서 자기소개 및 지원동기 데이터 가져오기
    }
  }, [resumeId]);

  const fetchProofreadData = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/resume/proofread/${resumeId}`);
        console.log('API 응답 데이터:', response.data); // 응답 데이터를 확인하는 로그 추가

        if (response.data) {
            setSelfIntroduction(response.data.selfIntroduction || '');
            setMotivation(response.data.motivation || '');
            console.log('자기소개:', response.data.selfIntroduction); // 자기소개 로그
            console.log('지원동기:', response.data.motivation); // 지원동기 로그
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

  const closeProofreadSidebar = () => {
    setIsProofreadSidebarOpen(false);
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
                <h2 className={styles.sectionHeader}>자기소개</h2>
                <button
                  type="button"
                  className={proofreadStyles.proofreadButton}
                  onClick={() => handleProofread(selfIntroduction)}
                >
                  맞춤법 검사
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
          <div className={proofreadStyles.sidebarHeader}>
            <h3>맞춤법 검사 결과</h3>
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
    </div>
  );
}

export default ResumeForm2;
