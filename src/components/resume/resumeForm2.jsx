import React, { useState, useRef, useEffect } from 'react';
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
import { closestIndexTo } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ResumeForm2() {
  const router = useRouter();
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');
  const [proofreadResult, setProofreadResult] = useState([]);
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);
  const [portfolioFields, setPortfolioFields] = useState([{ portfolio_description: '' }]);


  const [isPortfolioExempt, setIsPortfolioExempt] = useState(false);


  const [formData, setFormData] = useState({
    resume_title: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const sectionsRef = {
    portfolio: useRef(null),
    selfIntroduction: useRef(null),
    motivation: useRef(null)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelfIntroductionChange = (e) => {
    setSelfIntroduction(e.target.value);
  };

  const handleMotivationChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleProofread = async (text) => {
    try {
      const response = await axios.post('http://localhost:3001/check-spelling', {
        sentence: text,
      });
      setProofreadResult(response.data);
      setIsProofreadSidebarOpen(true); // 맞춤법 검사 결과가 있으면 사이드바 열기
    } catch (error) {
      console.error('맞춤법 검사 중 오류 발생:', error);
      setProofreadResult([]);
    }
  };

  const handleFieldChange = (index, e, fields, setFields) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index][name] = value;
    setFields(updatedFields);
  };

  const addField = (fields, setFields, newField) => {
    setFields([...fields, newField]);
  };

  const removeField = (index, fields, setFields) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };


  const handleCancel = () => {
    setModalContent('이력서 작성을 취소하시겠습니까?');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalContent('작성한 이력서를 등록하시겠습니까?');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmAction = async () => {
    if (modalContent === '작성한 이력서를 등록하시겠습니까?') {
      try {
        console.log('PDF 생성 중...');
        const pdfData = await generatePDF();
        await uploadPDF(pdfData);
        console.log('PDF 생성 완료 및 DB 저장');

        setIsModalOpen(false);
        setIsConfirmationOpen(true);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    } else {
      setIsModalOpen(false);
      router.push('/resume/resumeForm2');
    }
  };

  const generatePDF = async () => {
    const content = document.getElementById('resume-content');
    
    // scale 값을 크게 하여 고해상도로 캔버스를 생성
    const canvas = await html2canvas(content, { scale: 1.5 });
    
    // 캔버스에서 생성된 이미지 데이터를 가져옵니다.
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    
    const imgWidth = 210; // PDF의 너비 (A4)
    const pageHeight = 295; // PDF의 높이 (A4)
    
    // PDF의 전체 너비를 채우도록 이미지 높이 계산
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // 첫 페이지에 이미지 추가
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // 남은 컨텐츠를 추가 페이지로 나누기
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
};




  const uploadPDF = async (pdfBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', pdfBlob, 'resume.pdf');

      const response = await axios.post('http://localhost:8080/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('PDF 업로드 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('PDF 업로드 중 오류 발생:', error);
      throw error;
    }
  };


  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
  };

  const navigateToResumeList = () => {
    setIsConfirmationOpen(false);
    router.push('/resume/resumeList');
  };

  const closeProofreadSidebar = () => {
    setIsProofreadSidebarOpen(false);
  };

  

  const handleSidebarClick = (section) => {
    sectionsRef[section].current.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePortfolioExemptChange = (e) => {
    setIsPortfolioExempt(e.target.checked);
  };


  return (
  
    <div className={`${styles.body} ${styles.resumeForm}`}>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isModalOpen}
        onClose={closeModal}
        slots={{ backdrop: StyledBackdrop }}
        disableScrollLock
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="unstyled-modal-title" className={modalStyles.modalText}>
            {modalContent}
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

      <Modal
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        open={isConfirmationOpen}
        onClose={closeConfirmationModal}
        slots={{ backdrop: StyledBackdrop }}
        disableScrollLock
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="confirmation-modal-title" className={modalStyles.modalText}>
            이력서 등록이 완료되었습니다
          </h2>
          <div className={modalStyles.modalButtons}>
            <button onClick={navigateToResumeList} className={modalStyles.modalListButton}>
              이력서 관리
            </button>
          </div>
        </ModalContent>
      </Modal>


      <div className={styles.sidebar}>
        <ul>
          <li onClick={() => handleSidebarClick('selfIntroduction')}>자기소개</li>
          <li onClick={() => handleSidebarClick('motivation')}>지원동기</li>
          <li onClick={() => handleSidebarClick('portfolio')}>포트폴리오</li>
        </ul>
      </div>
      
      <div id="resume-content">
      <div className={styles.formContainer} >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.mb5}>
            <div className={styles.inputWithIcon}>
              <CreateIcon className={styles.icon} />
              <input
                type="title"
                placeholder="이력서 제목을 입력하세요"
                className={styles.input}
                name="resume_title"
                value={formData.resume_title}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className={styles.hr} />

          <div className={styles.formGroup} ref={sectionsRef.selfIntroduction}>
            <div className={styles.sectionHeaderContainer}>
              <h2 className={`${styles.sectionHeader} ${styles.requiredTwo}`}>자기소개</h2>
              <span className={styles.subText}>AI 첨삭 기능</span>
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
              <h2 className={`${styles.sectionHeader} ${styles.requiredTwo}`}>지원동기</h2>
              <span className={styles.subText}>AI 첨삭 기능</span>
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

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.portfolio}>포트폴리오</h2>
            <div className={styles.militaryCheckboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isPortfolioExempt}
                onChange={handlePortfolioExemptChange}
              />
              <label className={styles.checklabel}>해당 없음</label>
            </div>

            {portfolioFields.map((field, index) => (
              <div key={index} className={styles.formSection} style={{ position: 'relative' }}>
              {index > 0 && (
    
              <ClearIcon
                className={styles.clearIcon} 
                onClick={() => removeField(index, portfolioFields, setPortfolioFields)} 
                style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }} // X 버튼 위치 조정
              />
            )}
                {index > 0 && <div className={styles.formGroupSeparator}></div>}
                <div className={styles.formGroupInline}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>파일 업로드</label>
                    <input
                      type="file"
                      name={`portfolio_file_${index}`}
                      className={`${styles.input} ${isPortfolioExempt ? styles.disabledInput : ''}`}
                      disabled={isPortfolioExempt}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>포트폴리오 설명</label>
                    <input
                      type="text"
                      placeholder="포트폴리오 설명 입력"
                      name="portfolio_description"
                      className={`${styles.input} ${isPortfolioExempt ? styles.disabledInput : ''}`}
                      value={field.portfolio_description}
                      onChange={(e) => handleFieldChange(index, e, portfolioFields, setPortfolioFields)}
                      disabled={isPortfolioExempt}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.add} ${styles.button}`}
              onClick={() => addField(portfolioFields, setPortfolioFields, { portfolio_description: '' })}
              disabled={isPortfolioExempt}
            >
              + 포트폴리오 추가
            </button>


          <hr className={styles.hr} />

            
          <div className={styles.centerButtons} style={{ marginTop: '30px' }}>
            <div className={styles.formGroup}>
              <button type="button" className={`${styles.cancelBtn} ${styles.sameWidthBtn} ${styles.button}`} onClick={handleCancel}>취소</button>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className={`${styles.submitBtn} ${styles.sameWidthBtn} ${styles.button}`}>이력서 등록</button>
            </div>
          </div>
        </form>
      </div>
      </div>

      {/* 맞춤법 검사 사이드바 */}
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

export default ResumeForm2;
