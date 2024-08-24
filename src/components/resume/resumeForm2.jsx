import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';  // ClearIcon 추가
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import styles from '@/styles/resume/resumeForm.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css';
import proofreadStyles from '@/styles/resume/proofreadStyles.module.css';

function ResumeForm2() {
  const router = useRouter();
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);
  const [proofreadResult, setProofreadResult] = useState([]); // 맞춤법 검사 결과 상태 추가

  const sectionsRef = {
    selfIntroduction: useRef(null),
    motivation: useRef(null)
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
            <div className={styles.formGroup} ref={sectionsRef.selfIntroduction}>
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
                  placeholder="본인을 소개하는 글을 작성해주세요."
                  value={selfIntroduction}
                  onChange={handleSelfIntroductionChange}
                  maxLength="2000"
                />
                <div className={styles.charCounter}>{selfIntroduction.length}/2000</div>
              </div>
            </div>

            <hr className={styles.hr} />

            <div className={styles.formGroup} ref={sectionsRef.motivation}>
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
                  placeholder="회사 지원하게된 동기를 작성해주세요."
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
