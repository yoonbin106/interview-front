import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import styles from '@/styles/resume/resumeForm.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css';
import proofreadStyles from '@/styles/resume/proofreadStyles.module.css';
import { closestIndexTo } from 'date-fns';
import { useLoadDaumPostcodeScript, openPostcodePopup } from "@/api/getPostCode";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useStores } from '@/contexts/storeContext';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ResumeForm() {
  const router = useRouter();
  const { userStore } = useStores();
  const [profileImage, setProfileImage] = useState(null);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [educationFields, setEducationFields] = useState([{ school_name: '', major: '', start_date: '', end_date: '', graduation_status: '' }]);
  const [educationErrors, setEducationErrors] = useState([{school_name: false, major: false, start_date: false, end_date: false, graduation_status: false}]);
  const [careerFields, setCareerFields] = useState([{ company_name: '', join_date: '', leave_date: '', position: '', job_description: '' }]);
  const [languageFields, setLanguageFields] = useState([{ language: '', language_level: '', language_score: '' }]);
  const [awardFields, setAwardFields] = useState([{ contest_name: '', contest_award: '', contest_date: '' }]);
  const [certificateFields, setCertificateFields] = useState([{ certificate_name: '', certificate_issuer: '', certificate_date: '' }]);
  const [isMilitaryExempt, setIsMilitaryExempt] = useState(false);
  const [isCareerExempt, setIsCareerExempt] = useState(false);
  const [isLanguageExempt, setIsLanguageExempt] = useState(false);
  const [isAwardExempt, setIsAwardExempt] = useState(false);
  const [isCertificateExempt, setIsCertificateExempt] = useState(false);
  const [isWorkConditionExempt, setIsWorkConditionExempt] = useState(false);
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');
  const [aiProofreadResult, setAiProofreadResult] = useState([]);
  const [proofreadResult, setProofreadResult] = useState([]);
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);
  const [isAiProofreadSidebarOpen, setIsAiProofreadSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [postcodeError,setPostcodeError] = useState(false);
  const [showSelfIntroError, setShowSelfIntroError] = useState(false);
  const [showMotivationError, setShowMotivationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    resume_title: '',
    military_service_type: '',
    military_start_date: '',
    military_end_date: '',
    military_rank: '',
    desired_company: '',
    desired_salary: '',
    desired_start_date: '',
    gender: '',
    name: userStore.username || '',
    email: userStore.email || '',
    phone: userStore.phone || '',
    gender: userStore.gender || '',
    birth: userStore.birth || '',
    address: userStore.address || ''
  });

  const toggleSidebarHeight = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  //텍스트 복붙 2000자 초과 금지용
  const handlePaste = (e) => {
    e.preventDefault();

    const pasteText = (e.clipboardData || window.clipboardData).getData('text');
    const currentText = e.target.innerText;
    const remainingLength = 2000 - currentText.length;
    const textToPaste = pasteText.substring(0, remainingLength);

    document.execCommand('insertText', false, textToPaste);
  `1`};

  //섹션 지정
  const sectionsRef = {
    personalInfo: useRef(null),
    education: useRef(null),
    career: useRef(null),
    languages: useRef(null),
    awards: useRef(null),
    certificates: useRef(null),
    military: useRef(null),
    workConditions: useRef(null),
    selfIntroduction: useRef(null),
    motivation: useRef(null)
  };

  //자동 해당없음 체크용
    const checkAndSetExemptions = () => {
    
    const isCareerEmpty = careerFields.every(field =>
      !field.company_name && !field.join_date && !field.leave_date && !field.position && !field.job_description
    );
    setIsCareerExempt(isCareerEmpty);

    const isLanguageEmpty = languageFields.every(field =>
      !field.language && !field.language_level && !field.language_score
    );
    setIsLanguageExempt(isLanguageEmpty);
  
    const isAwardEmpty = awardFields.every(field =>
      !field.contest_name && !field.contest_award && !field.contest_date
    );
    setIsAwardExempt(isAwardEmpty);
  
    const isCertificateEmpty = certificateFields.every(field =>
      !field.certificate_name && !field.certificate_issuer && !field.certificate_date
    );
    setIsCertificateExempt(isCertificateEmpty);
  
    const isMilitaryEmpty = !formData.military_service_type && !formData.military_start_date && !formData.military_end_date && !formData.military_rank;
    setIsMilitaryExempt(isMilitaryEmpty);
  
    const isWorkConditionEmpty =!formData.desired_company && !formData.desired_salary && !formData.desired_start_date;
    setIsWorkConditionExempt(isWorkConditionEmpty);
  };
  
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

  //프로필 사진 변경 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageError(false); // 에러 초기화
    } else {
      setProfileImageError(true); // 이미지가 없을 경우 에러 설정
    }
  };

 

  // 자기소개 2000자 이하 작성용
  const handleSelfIntroductionChange = (e) => {
    let text = e.target.innerText;

    if (text.length > 2000) {
        text = text.substring(0, 2000);
        e.target.innerText = text;
      
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(e.target);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    setSelfIntroduction(text);
};
  //지원동기 2000자 이하 작성용
  const handleMotivationChange = (e) => {
    let text = e.target.innerText;
    if (text.length > 2000) {
      text = text.substring(0, 2000);
      e.target.innerText = text;

      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(e.target);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
  }
    setMotivation(text);
  };

  //한스펠 맞춤법 검사
  const handleProofread = async (text) => {
    if (text.trim() === '') {
      setProofreadResult([]);
      setIsProofreadSidebarOpen(true);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/check-spelling', {sentence: text,});
      if (response.data.length === 0) {setProofreadResult([]);} else {setProofreadResult(response.data);}
      setIsProofreadSidebarOpen(true);
    } catch (error) {
      console.error('맞춤법 검사 중 오류 발생:', error);
      setProofreadResult([]);
      setIsProofreadSidebarOpen(true);
    }
  };
  
  const handleFieldChange = (index, e, fields, setFields, errors, setErrors) => {
    const { name, value } = e.target;

    //모든 필드 업데이트
    const updatedFields = [...fields];
    updatedFields[index][name] = value;
    setFields(updatedFields);

    // 학력 필드 에러 업데이트
  const updatedErrors = errors ? [...errors] : []; // errors 배열이 없으면 빈 배열로 초기화
  if (!updatedErrors[index]) {
    updatedErrors[index] = {}; // 현재 index가 없는 경우 빈 객체로 초기화
  }

  if (value.trim() !== '') {
    updatedErrors[index][name] = false;
  } else {
    updatedErrors[index][name] = true;
  }

  setErrors(updatedErrors);
};

  // 필드추가 +버튼용
  const addField = (fields, setFields, newField, errors, setErrors) => {
    setFields([...fields, newField]);
  
    // 학력 필드 추가 시 오류 상태 추가
    setErrors([
      ...errors,
      {
        school_name: false,
        major: false,
        start_date: false,
        end_date: false,
        graduation_status: false,
      },
    ]);
  };

  // 필드제거 x버튼용
  const removeField = (index, fields, setFields, errors, setErrors) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  
    const updatedErrors = errors.filter((_, i) => i !== index);
    setErrors(updatedErrors);
  };

  // 취소버튼용
  const handleCancel = () => {
    setModalContent('이력서 작성을 취소하시겠습니까?');
    setIsModalOpen(true);
  };

  //이력서 저장버튼용
  const handleSubmit = (e) => {
    e.preventDefault();
  
    let hasError = false;
    let firstErrorField = null;
  
    // 1. 이력서 제목 유효성 검사
    if (formData.resume_title.trim() === '') {
      setShowTitleError(true);
      if (!hasError) {
        firstErrorField = () => window.scrollTo(0, 0); // 이력서 제목으로 스크롤
      }
      hasError = true;
    }
  
    // 2. 인적사항 섹션 유효성 검사

    //프로필 이미지
    if (!profileImage) {
      setProfileImageError(true);
      if (!hasError) {
        firstErrorField = () => sectionsRef.personalInfo.current.scrollIntoView({ behavior: 'smooth' });
      }
      hasError = true;
    }
  
    //성별
    if (!formData.gender || !['male', 'female', 'other'].includes(formData.gender)) {
      setGenderError(true);
      if (!hasError) {
        firstErrorField = () => sectionsRef.personalInfo.current.scrollIntoView({ behavior: 'smooth' });
      }
      hasError = true;
    }
    //상세주소
    if (specificAddress.trim() === '') {
      setPostcodeError(true);
      if (!hasError) {
        firstErrorField = () => sectionsRef.address.current.scrollIntoView({ behavior: 'smooth' });
      }
      hasError = true;
    }
    
    //3.자기소개
    if (selfIntroduction.trim() === '') {
      setShowSelfIntroError(true);
      if (!hasError) {
        firstErrorField = () => sectionsRef.selfIntroduction.current.scrollIntoView({ behavior: 'smooth' });
      }
      hasError = true;
    }
  
    //4.지원동기
    if (motivation.trim() === '') {
      setShowMotivationError(true);
      if (!hasError) {
        firstErrorField = () => sectionsRef.motivation.current.scrollIntoView({ behavior: 'smooth' });
      }
      hasError = true;
    }

    
     //5.학력 섹션 유효성 검사
     const newEducationErrors = [...educationErrors];
     educationFields.forEach((field, index) => {
       let fieldHasError = false;
   
       //학교명
       if (field.school_name.trim() === '') {
         newEducationErrors[index].school_name = true;
         fieldHasError = true;
       }
       //전공
       if (field.major.trim() === '') {
         newEducationErrors[index].major = true;
         fieldHasError = true;
       }
       //입학
       if (field.start_date === '') {
         newEducationErrors[index].start_date = true;
         fieldHasError = true;
       }
       //졸업
       if (field.end_date === '') {
         newEducationErrors[index].end_date = true;
         fieldHasError = true;
       }
       //졸업구분
       if (field.graduation_status === '') {
         newEducationErrors[index].graduation_status = true;
         fieldHasError = true;
       }
       // 첫 번째 오류 필드로 스크롤 이동 설정
       if (fieldHasError && !hasError) {
         firstErrorField = () => sectionsRef.education.current.scrollIntoView({ behavior: 'smooth' });
         hasError = true;
       }
     });
   
     setEducationErrors(newEducationErrors);

    // 첫 번째 에러 필드로 스크롤
    if (firstErrorField) {
      firstErrorField();
    }
  
    // 에러가 있으면 종료
    if (hasError) return;
  
    checkAndSetExemptions();
    setModalContent('작성 내용은 PDF 파일로 저장됩니다<br/>이력서를 저장하시겠습니까?');
    setIsModalOpen(true);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
    


  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  const confirmAction = async () => {
    if (modalContent === '작성 내용은 PDF 파일로 저장됩니다<br/>이력서를 저장하시겠습니까?') {
        try {
            setLoadingSave(true); // 저장 시작 시 로딩 모달 표시
            const pdfData = await generatePDF();
            const formDataToSend = new FormData();
            formDataToSend.append('file', new Blob([pdfData], { type: 'application/pdf' }), `${formData.resume_title}.pdf`); // 제목을 파일 이름으로 설정
            formDataToSend.append('title', formData.resume_title);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('desired_company', formData.desired_company); 

            const uploadResponse = await axios.post('http://localhost:8080/api/resume/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const resumeId = uploadResponse.data.resumeId;

            await axios.post('http://localhost:8080/api/resume/proofread/save', {
                resumeId: resumeId,
                selfIntroduction: selfIntroduction,
                motivation: motivation
            });
            
            const keywordResponse = await axios.post('http://localhost:8080/api/resume/update-keywords', {
                resumeId: resumeId,
                selfIntroduction: selfIntroduction,
                motivation:motivation
            });

            console.log('키워드 업데이트 응답:', keywordResponse.data);

            setIsModalOpen(false);
            setIsConfirmationOpen(true);
        } catch (error) {
            console.error('에러 발생:', error);
        } finally {
            setLoadingSave(false);
        }
    } else {
        setIsModalOpen(false);
        router.push('/resume/resumeList');
    }
};

const generatePDF = async () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => button.style.display = 'none');
  const content = document.getElementById('resume-content');
  const canvas = await html2canvas(content, { 
    scale: 2,
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4', true);
  const imgWidth = 207;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  }
  const pdfBlob = pdf.output('blob');
  buttons.forEach(button => button.style.display = '');
  return pdfBlob;
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

  const handleMilitaryExemptChange = (e) => {
    setIsMilitaryExempt(e.target.checked);
  };

  const handleCareerExemptChange = (e) => {
    setIsCareerExempt(e.target.checked);
  };

  const handleLanguageExemptChange = (e) => {
    setIsLanguageExempt(e.target.checked);
  };

  const handleAwardExemptChange = (e) => {
    setIsAwardExempt(e.target.checked);
  };

  const handleCertificateExemptChange = (e) => {
    setIsCertificateExempt(e.target.checked);
  };

  const handleWorkConditionExemptChange = (e) => {
    setIsWorkConditionExempt(e.target.checked);
  };

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      name: userStore.username || '',
      email: userStore.email || ''
    }));
  }, [userStore.username, userStore.email]);

  //자기소개 AI첨삭
  const handleAiProofread = async (text) => {
    if (text.trim() === '') {
        setAiProofreadResult([{ message: "입력된 텍스트가 없습니다." }]);
        setIsAiProofreadSidebarOpen(true);
        return;
    }
    setLoading(true);
    try {
        const response = await axios.post('http://localhost:8080/api/chatgpt-self', {
            text,
        });

        if (response.data) {
            const formattedText = response.data.split('▶').map((item, index) => {
                if (index > 0) {
                    return (
                        <div key={index} style={{ marginTop: '16px' }}>
                            <span style={{ fontSize: '6px', position: 'relative', top: '-3.5px',color:'#5A8AF2'}}>●</span>&nbsp;&nbsp;&nbsp;&nbsp;
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

const handleAiProofreadMotivation = async (text) => {
  if (text.trim() === '') {
      setAiProofreadResult([{ message: "입력된 텍스트가 없습니다." }]);
      setIsAiProofreadSidebarOpen(true);
      return;
  }

  setLoading(true);

  try {
      const response = await axios.post('http://localhost:8080/api/chatgpt-motivation', { text });

      if (response.data) {
          const formattedText = response.data.split('▶').map((item, index) => {
              if (index > 0) {
                  return (
                      <div key={index} style={{ marginTop: '16px' }}>
                          <span style={{ fontSize: '6px', position: 'relative', top: '-3.5px'}}>●</span>&nbsp;&nbsp;&nbsp;&nbsp;
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
  let coloredText = text.replace(/##([^#]+)##/g, "<span style='color:#5A8AF2;'>$&</span>");

  coloredText = coloredText.replace(/첨삭 결과는 다음과 같습니다\./g, "<span style='color:#5A8AF2;'>첨삭 결과는 다음과 같습니다.</span><br>");
  coloredText = coloredText.replace(/첨삭 결과는 다음과 같습니다\:/g, "<span style='color:#5A8AF2;'>첨삭 결과는 다음과 같습니다.</span><br>");
  coloredText = coloredText.replace(/수정 부분은 다음과 같습니다\./g, "<span style='color:#5A8AF2;'>수정 부분은 다음과 같습니다.</span>");
  coloredText = coloredText.replace(/수정 부분은 다음과 같습니다\:/g, "<span style='color:#5A8AF2;'>수정 부분은 다음과 같습니다.</span>");
  coloredText = coloredText.replace(/(-)/g, "<br><br>$1");
  return { __html: coloredText };
};

  const closeAiProofreadSidebar = () => {
    setIsAiProofreadSidebarOpen(false);
  };

  useLoadDaumPostcodeScript();
  
  return (
  
    <div className={`${styles.body} ${styles.resumeForm}`}>
     {!loadingSave && (
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
        <span dangerouslySetInnerHTML={{ __html: modalContent }} />
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
)}

<Modal
    aria-labelledby="loading-save-modal-title"
    aria-describedby="loading-save-modal-description"
    open={loadingSave}
    onClose={() => {}}
    slots={{ backdrop: StyledBackdrop }}
    disableScrollLock
>
    <ModalContent sx={{ width: 300 }}>
        <div className={modalStyles.spinner}></div> 
        <h2 id="loading-save-modal-title" className={modalStyles.modalText}>
            저장중...
        </h2>
    </ModalContent>
  </Modal>

      {!loadingSave && (
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
            <div className={modalStyles.spinner}></div>
            <h2 id="loading-modal-title" className={modalStyles.modalText}>
              AI 첨삭 중...
            </h2>
          </ModalContent>
        </Modal>
      <div className={styles.sidebar}>
        <ul>
          <li onClick={() => handleSidebarClick('personalInfo')}>인적사항</li>
          <li onClick={() => handleSidebarClick('education')}>학력</li>
          <li onClick={() => handleSidebarClick('career')}>경력사항</li>
          <li onClick={() => handleSidebarClick('languages')}>외국어</li>
          <li onClick={() => handleSidebarClick('awards')}>입상경력</li>
          <li onClick={() => handleSidebarClick('certificates')}>자격증</li>
          <li onClick={() => handleSidebarClick('military')}>병역사항</li>
          <li onClick={() => handleSidebarClick('workConditions')}>희망근무조건</li>
          <li onClick={() => handleSidebarClick('selfIntroduction')}>자기소개</li>
          <li onClick={() => handleSidebarClick('motivation')}>지원동기</li>
        </ul>
      </div>
      
      <div id="resume-content">
        
      <div className={styles.formContainer} >
        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
              <input
                type="title"
                placeholder="이력서 제목을 입력하세요"
                name="resume_title"
                value={formData.resume_title}
                className={styles.input}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData({ ...formData, resume_title: newTitle });
                  if (newTitle.trim() === '') {
                    setShowTitleError(true);
                  } else {
                    setShowTitleError(false);
                  }
                }}
              />
      
            {showTitleError && (
              <div style={{ color: 'red', fontSize: '16px', marginTop: '10px', textAlign: 'left' }}>
                ※ 이력서 제목을 입력하세요
              </div>
            )}
          </div>

          <hr className={styles.hr} />

          <h2 className={`${styles.sectionHeader_personal}  ${styles.requiredTwo}`} ref={sectionsRef.personalInfo}>인적사항</h2>
              <div className={styles.profileSection}>
                <div className={`${styles.formGroup} ${styles.profileImageUpload}`}>
                  <label className={`${styles.label}`}>프로필 사진</label>
                  <div className={styles.profileImageBox} onClick={() => document.getElementById('file-input').click()}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" style={{ display: 'inline-block' }} />
                    ) : (
                      <label htmlFor="file-input" className={`${styles.plusButton} ${styles.plusButtonVisible}`}>+</label>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      onChange={(e) => {
                        handleImageChange(e);
                      }}
                      className={styles.hiddenFileInput}
                    />
                  </div>
                  {profileImageError && (
              <div style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>
                ※ 필수 첨부입니다
              </div>
            )}
                </div>
            <div className={styles.personalInfo}>
              <div className={styles.formInline}>
                <div className={styles.formGroup}>
                  <label className={`${styles.label}`}>이름</label>
                  <input type="text" placeholder="이름" value={formData.name} readOnly  />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px' }}>
                  <label className={`${styles.label}`}>생년월일</label>
                  <input type="text" placeholder="생년월일" value={formData.birth} />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px' }}>
                <div className={styles.formInlineValid}>
                  <label className={`${styles.label}`} >성별</label>
                  {genderError && (
                <div style={{ color: 'red', fontSize: '14px', textAlign: 'left', marginLeft:'5px' }}>
                  ※ 필수 선택입니다
                </div>
            )}
            </div>
                  <select name="gender"  onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, gender: value });
                      setGenderError(value.trim() === '' || !['male', 'female', 'other'].includes(value)); // 에러 상태 업데이트
                    }} className={`${styles.genderSelect}`} >
                    <option value="">선택하세요</option>
                    <option value="male">남자</option>
                    <option value="female">여자</option>
                    <option value="other">기타</option>
                  </select>
                  
                </div>
               
              </div>
              <div className={styles.formInline}>
                <div className={styles.formGroup}>
                  <div className={styles.formInlineValid}>                 
                  <label className={`${styles.label}`}>이메일</label>
                  </div>
                  <input type="email" className={styles.input} placeholder="이메일"  value={formData.email} />
                </div>
                <div className={styles.formGroup}>
  
                  <label className={`${styles.label}`}>휴대전화번호</label>

                  <input type="text" className={styles.phoneNumInput} placeholder="휴대전화번호" value={formData.phone} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '30px' }}>
          <div className={styles.formInlineValid}>
            <label className={`${styles.label}`}>주소</label>
                      {postcodeError && (
              <div style={{ color: 'red', fontSize: '14px', textAlign: 'left', marginLeft: '5px' }}>
                ※ 우편번호 및 상세주소를 입력하세요.
              </div>
            )}
          </div>  
            <div className="input-group mb-2">
                <input
                  type="text"
                  className={styles.formControl}
                  id="zipcode"
                  placeholder="우편번호"
                  value={postcode}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    openPostcodePopup(setPostcode, setAddress, setExtraAddress)
                  }
                >
                  우편번호 검색
                </button>
              </div>
              
          </div>
          <div className={styles.formGroup_address}>

              <div className="input-group mb-2">
                <input
                  type="text"
                  className={styles.formControl_address}
                  id="address"
                  placeholder="주소"
                  value={address}
                  readOnly
                />
              </div>
              <div className={styles.formGroupInline_address}>
                <input
                  type="text"
                  name="specificAddress"
                  className={styles.formControl_address}
                  id="specificAddress"
                  placeholder="상세주소"
                  value={specificAddress}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSpecificAddress(newValue);
              
                    // 입력값이 비어있으면 오류 상태 유지
                    if (newValue.trim() === '') {
                      setPostcodeError(true);
                    } else {
                      setPostcodeError(false); // 입력이 있으면 오류 해제
                    }
                  }}
                />
                <input
                  type="text"
                  className={styles.formControl_address}
                  id="extraAddress"
                  placeholder="참고항목"
                  value={extraAddress}
                  readOnly
                />
              </div>
            </div>

         




          <hr className={styles.hr} />

          <div className={styles.sectionHeaderContainer}>
  <h2 className={`${styles.sectionHeader_education} ${styles.requiredTwo}`} ref={sectionsRef.education}>학력</h2>
</div>

{educationFields.map((field, index) => (
  <div key={index} className={styles.formSection} style={{ position: 'relative' }}>
    {index > 0 && (
      
      <ClearIcon
    className={styles.clearIcon}
    onClick={() => removeField(index, educationFields, setEducationFields, educationErrors, setEducationErrors)}
    style={{
    position: 'absolute',
    right: '-15px',
    top: '10px',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '13px',
    boxSizing: 'content-box',
  }}
/>

    )}

    {index > 0 && <div className={styles.formGroupSeparator}></div>}

    <div className={styles.formGroupInlineVertical}>
      <div className={styles.formGroupInline}>
        <div className={styles.formGroup} style={{ flex: 1 }}>
          <div className={styles.formInlineValid}>
          <label className={styles.label}>학교</label>
          {educationErrors[index].school_name && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>
            ※ 필수 입력입니다.
          </div>
        )}
          </div>
          <input
            type="text"
            placeholder="학교 이름 입력"
            name="school_name"
            className={styles.input}
            value={field.school_name}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields, educationErrors, setEducationErrors)}
          />

        </div>
        <div className={styles.formGroup} style={{ marginLeft: '30px', flex: 1 }}>
        <div className={styles.formInlineValid}>
          <label className={styles.label}>전공</label>
          {educationErrors[index].major && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>
            ※ 필수 입력입니다.
          </div>
        )}
        </div>
          <input
            type="text"
            placeholder="전공 입력"
            name="major"
            className={styles.input}
            value={field.major}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields, educationErrors, setEducationErrors)}
          />
        </div>
      </div>
      <div className={styles.formGroupInline}>
        <div className={styles.formGroup}>
        <div className={styles.formInlineValid}>
          <label className={styles.label}>입학</label>
          {educationErrors[index].start_date && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>
            ※ 필수 입력입니다.
          </div>
        )}
        </div>
          <input
            type="month"
            placeholder="----년 --월"
            name="start_date"
            className={styles.input}
            value={field.start_date}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields, educationErrors, setEducationErrors)}
          />
        </div>
        <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
        <div className={styles.formInlineValid}>
          <label className={styles.label}>졸업</label>
          {educationErrors[index].end_date && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>
            ※ 필수 입력입니다.
          </div>
        )}  
        </div>  
          <input
            type="month"
            placeholder="----년 --월"
            name="end_date"
            className={styles.input}
            value={field.end_date}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields,educationErrors, setEducationErrors )}
          />
        </div>
        <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
        <div className={styles.formInlineValid}>
          <label className={styles.label}>졸업구분</label>
                {educationErrors[index].graduation_status && (
        <div style={{ color: 'red', fontSize: '14px', textAlign: 'left' }}>
          ※ 필수 선택입니다.
        </div>
      )}
      </div>
          <select
            name="graduation_status"
            value={field.graduation_status}
            className={styles.select}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields ,educationErrors, setEducationErrors)}
          >
            <option value="">---</option>
            <option value="graduated">졸업</option>
            <option value="enrolled">재학중</option>
            <option value="leaveOfAbsence">휴학</option>
          </select>
        </div>
      </div>
    </div>

    
  </div>
))}

<button
  type="button"
  className={`${styles.add} ${styles.button}`}
  onClick={() =>
    addField(
      educationFields,
      setEducationFields,
      { school_name: '', major: '', start_date: '', end_date: '', graduation_status: '' },
      educationErrors, // 추가된 에러 상태 인자
      setEducationErrors // 에러 상태 업데이트 함수
    )
  }
>
  + 학력 추가
</button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.career}>경력사항</h2>
            <div className={styles.militaryCheckboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isCareerExempt}
                onChange={handleCareerExemptChange}
              />
              <label className={styles.checklabel}>해당 없음</label>
            </div>

            {careerFields.map((field, index) => (
              <div key={index} className={styles.formSection} style={{ position: 'relative' }}>
                {index > 0 && (
      
                <ClearIcon
                  className={styles.clearIcon} 
                  onClick={() => removeField(index, careerFields, setCareerFields)} 
                  style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }}
                />
              )}
                {index > 0 && <div className={styles.formGroupSeparator}></div>}

                <div className={styles.formGroupInlineVertical}>
                  <div className={styles.formGroupInline}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>회사명</label>
                      <input
                        type="text"
                        placeholder="회사 이름 입력"
                        name="company_name"
                        className={`${styles.input} ${isCareerExempt ? styles.disabledInput : ''}`}
                        value={field.company_name}
                        onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                        disabled={isCareerExempt}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ width: '200px', marginLeft: '30px' }}>
                      <label className={styles.label}>입사날짜</label>
                      <input
                        type="month"
                        name="join_date"
                        className={`${styles.input} ${isCareerExempt ? styles.disabledInput : ''}`}
                        value={field.join_date}
                        onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                        disabled={isCareerExempt}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ width: '200px', marginLeft: '47px' }}>
                      <label className={styles.label}>퇴사날짜</label>
                      <input
                        type="month"
                        name="leave_date"
                        className={`${styles.input} ${isCareerExempt ? styles.disabledInput : ''}`}
                        value={field.leave_date}
                        onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                        disabled={isCareerExempt}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroupInline}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>직위/직책</label>
                      <input
                        type="text"
                        placeholder="직위/직책 입력"
                        name="position"
                        className={`${styles.input} ${isCareerExempt ? styles.disabledInput : ''}`}
                        value={field.position}
                        onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                        disabled={isCareerExempt}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                      <label className={styles.label}>업무내용</label>
                      <input
                        type="text"
                        placeholder="업무내용 입력"
                        name="job_description"
                        className={`${styles.input} ${isCareerExempt ? styles.disabledInput : ''}`}
                        value={field.job_description}
                        onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                        disabled={isCareerExempt}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.add} ${styles.button}`}
              onClick={() => addField(careerFields, setCareerFields, { company_name: '', join_date: '', leave_date: '', position: '', job_description: '' })}
              disabled={isCareerExempt}
            >
              + 경력 추가
            </button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.languages}>외국어</h2>
            <div className={styles.militaryCheckboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isLanguageExempt}
                onChange={handleLanguageExemptChange}
              />
              <label className={styles.checklabel}>해당 없음</label>
            </div>

            {languageFields.map((field, index) => (
              <div key={index} className={styles.formSection} style={{ position: 'relative' }}>
                {index > 0 && (
                <ClearIcon
                  className={styles.clearIcon} 
                  onClick={() => removeField(index, languageFields, setLanguageFields)} 
                  style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }}
                />
                )}
                {index > 0 && <div className={styles.formGroupSeparator}></div>}

                <div className={styles.formGroupInlineVertical}>
                  <div className={styles.formGroupInline}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>외국어</label>
                      <input
                        type="text"
                        placeholder="외국어 입력"
                        name="language"
                        className={`${styles.input} ${isLanguageExempt ? styles.disabledInput : ''}`}
                        value={field.language}
                        onChange={(e) => handleFieldChange(index, e, languageFields, setLanguageFields)}
                        disabled={isLanguageExempt}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                      <label className={styles.label}>평가등급</label>
                      <input
                        type="text"
                        placeholder="평가등급 입력"
                        name="language_level"
                        className={`${styles.input} ${isLanguageExempt ? styles.disabledInput : ''}`}
                        value={field.language_level}
                        onChange={(e) => handleFieldChange(index, e, languageFields, setLanguageFields)}
                        disabled={isLanguageExempt}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                      <label className={styles.label}>시험점수</label>
                      <input
                        type="text"
                        placeholder="시험점수 입력"
                        name="language_score"
                        className={`${styles.input} ${isLanguageExempt ? styles.disabledInput : ''}`}
                        value={field.language_score}
                        onChange={(e) => handleFieldChange(index, e, languageFields, setLanguageFields)}
                        disabled={isLanguageExempt}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.add} ${styles.button}`}
              onClick={() => addField(languageFields, setLanguageFields, { language: '', language_level: '', language_score: '' })}
              disabled={isLanguageExempt}
            >
              + 외국어 추가
            </button>


          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.awards}>입상경력</h2>
            <div className={styles.militaryCheckboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAwardExempt}
                onChange={handleAwardExemptChange}
              />
              <label className={styles.checklabel}>해당 없음</label>
            </div>

            {awardFields.map((field, index) => (
              <div key={index} className={styles.formSection} style={{ position: 'relative' }}>
              {index > 0 && (
    
              <ClearIcon
                className={styles.clearIcon} 
                onClick={() => removeField(index, awardFields, setAwardFields)} 
                style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }} // X 버튼 위치 조정
              />
            )}
                {index > 0 && <div className={styles.formGroupSeparator}></div>}
                <div className={styles.formGroupInline}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>대회명</label>
                    <input
                      type="text"
                      placeholder="대회명 입력"
                      name="contest_name"
                      className={`${styles.input} ${isAwardExempt ? styles.disabledInput : ''}`}
                      value={field.contest_name}
                      onChange={(e) => handleFieldChange(index, e, awardFields, setAwardFields)}
                      disabled={isAwardExempt}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>입상내역</label>
                    <input
                      type="text"
                      placeholder="입상내역 입력"
                      name="contest_award"
                      className={`${styles.input} ${isAwardExempt ? styles.disabledInput : ''}`}
                      value={field.contest_award}
                      onChange={(e) => handleFieldChange(index, e, awardFields, setAwardFields)}
                      disabled={isAwardExempt}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>수상날짜</label>
                    <input
                      type="month"
                      name="contest_date"
                      className={`${styles.input} ${isAwardExempt ? styles.disabledInput : ''}`}
                      value={field.contest_date}
                      onChange={(e) => handleFieldChange(index, e, awardFields, setAwardFields)}
                      disabled={isAwardExempt}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.add} ${styles.button}`}
              onClick={() => addField(awardFields, setAwardFields, { contest_name: '', contest_award: '', contest_date: '' })}
              disabled={isAwardExempt}
            >
              + 입상경력 추가
            </button>


          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.certificates}>자격증</h2>
            <div className={styles.militaryCheckboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isCertificateExempt}
                onChange={handleCertificateExemptChange}
              />
              <label className={styles.checklabel}>해당 없음</label>
            </div>

            {certificateFields.map((field, index) => (
              <div key={index} className={styles.formSection} style={{ position: 'relative' }}>
              {index > 0 && (
    
              <ClearIcon
                className={styles.clearIcon} 
                onClick={() => removeField(index, certificateFields, setCertificateFields)} 
                style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }} // X 버튼 위치 조정
              />
            )}
                {index > 0 && <div className={styles.formGroupSeparator}></div>}
                <div className={styles.formGroupInline}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>자격증명</label>
                    <input
                      type="text"
                      placeholder="자격증명 입력"
                      name="certificate_name"
                      className={`${styles.input} ${isCertificateExempt ? styles.disabledInput : ''}`}
                      value={field.certificate_name}
                      onChange={(e) => handleFieldChange(index, e, certificateFields, setCertificateFields)}
                      disabled={isCertificateExempt}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>발급기관</label>
                    <input
                      type="text"
                      placeholder="발급기관 입력"
                      name="certificate_issuer"
                      className={`${styles.input} ${isCertificateExempt ? styles.disabledInput : ''}`}
                      value={field.certificate_issuer}
                      onChange={(e) => handleFieldChange(index, e, certificateFields, setCertificateFields)}
                      disabled={isCertificateExempt}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>취득날짜</label>
                    <input
                      type="month"
                      name="certificate_date"
                      className={`${styles.input} ${isCertificateExempt ? styles.disabledInput : ''}`}
                      value={field.certificate_date}
                      onChange={(e) => handleFieldChange(index, e, certificateFields, setCertificateFields)}
                      disabled={isCertificateExempt}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.add} ${styles.button}`}
              onClick={() => addField(certificateFields, setCertificateFields, { certificate_name: '', certificate_issuer: '', certificate_date: '' })}
              disabled={isCertificateExempt}
            >
              + 자격증 추가
            </button>

          <hr className={styles.hr} />

          <div className={styles.militaryHeader}>
            <h2 className={styles.sectionHeader} ref={sectionsRef.military}>병역사항</h2>
            <div className={styles.militaryCheckboxContainer}>
          <input
              type="checkbox"
              className={styles.checkbox}
              checked={isMilitaryExempt}
              onChange={handleMilitaryExemptChange}
            />
            <label className={styles.checklabel}>해당 없음</label>
    
  </div>
</div>
<div className={`${styles.formGroupInline} ${styles.alignItemsCenter}`}>
  <div className={styles.formGroup}>
    <label className={`${styles.label} ${isMilitaryExempt ? styles.disabledLabel : ''}`}>복무구분</label>
    <select
      name="military_service_type"
      className={`${styles.militarySelect} ${isMilitaryExempt ? styles.disabledSelect : ''}`}
      value={formData.military_service_type}
      onChange={handleChange}
      disabled={isMilitaryExempt} 
    >
      <option value="">선택하세요</option>
      <option value="activeDuty">현역</option>
      <option value="publicService">공익</option>
      <option value="exempted">면제</option>
      <option value="other">기타</option>
    </select>
  </div>
  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
    <label className={`${styles.label} ${isMilitaryExempt ? styles.disabledLabel : ''}`}>복무 시작</label>
    <input
      type="month"
      name="military_start_date"
      className={styles.input}
      value={formData.military_start_date}
      onChange={handleChange}
      disabled={isMilitaryExempt} 
    />
  </div>
  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
    <label className={`${styles.label} ${isMilitaryExempt ? styles.disabledLabel : ''}`}>복무 종료</label>
    <input
      type="month"
      name="military_end_date"
      className={styles.input}
      value={formData.military_end_date}
      onChange={handleChange}
      disabled={isMilitaryExempt} 
    />
  </div>
  <div className={styles.formGroup} style={{ marginLeft: '30px', width: '130px' }}>
    <label className={`${styles.label} ${isMilitaryExempt ? styles.disabledLabel : ''}`}>계급(직급)</label>
    <input
      type="text"
      placeholder="계급 입력"
      name="military_rank"
      className={styles.input}
      value={formData.military_rank}
      onChange={handleChange}
      disabled={isMilitaryExempt} 
    />
  </div>
</div>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.workConditions}>희망 근무조건</h2>
            <div className={styles.militaryCheckboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isWorkConditionExempt}
                onChange={handleWorkConditionExemptChange}
              />
              <label className={styles.checklabel}>해당 없음</label>
            </div>
            <div className={styles.formGroupInline}>
            <div className={styles.formGroup}>
                <label className={styles.label}>입사 희망 기업명</label>
                <input
                  type="text"
                  placeholder="기업명"
                  name="desired_company"
                  className={`${styles.input} ${isWorkConditionExempt ? styles.disabledInput : ''}`}
                  value={formData.desired_company}
                  onChange={handleChange}
                  disabled={isWorkConditionExempt}
                />
              </div>


              <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                <label className={styles.label}>희망 연봉</label>
                <input
                  type="text"
                  placeholder="희망 연봉 입력 (원)"
                  name="desired_salary"
                  className={`${styles.input} ${isWorkConditionExempt ? styles.disabledInput : ''}`}
                  value={formData.desired_salary}
                  onChange={handleChange}
                  disabled={isWorkConditionExempt}
                />
              </div>
              <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                <label className={styles.label}>희망 입사 날짜</label>
                <input
                  type="month"
                  name="desired_start_date"
                  className={`${styles.input} ${isWorkConditionExempt ? styles.disabledInput : ''}`}
                  value={formData.desired_start_date}
                  onChange={handleChange}
                  disabled={isWorkConditionExempt}
                />
              </div>
            </div>
            
            <hr className={styles.hr} />

             <div className={styles.formGroup} ref={sectionsRef.selfIntroduction}>
        <div className={styles.sectionHeaderContainer}>
          <h2 className={`${styles.sectionHeader} ${styles.requiredTwo}`}>자기소개</h2>
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
            onClick={() => handleAiProofread(selfIntroduction)}
            style={{ marginLeft: '10px' }}
          >
            AI 첨삭 실행
          </button>
        </div>
        <div className={styles.textareaContainer}>
      {selfIntroduction.length === 0 && (
        <div className={styles.placeholder}>본인을 소개하는 글을 작성해주세요</div>
      )}
          <pre
            contenteditable="true"
            value={selfIntroduction}
            onInput={(e) => {
              handleSelfIntroductionChange(e);
              if (e.target.innerText.trim() === '') {
                setShowSelfIntroError(true); // 입력이 없으면 오류 상태 유지
              } else {
                setShowSelfIntroError(false); // 입력이 있으면 오류 해제
              }
            }}
            onPaste={handlePaste} 
            maxLength="2000"
          />

          <div className={styles.charCounter}>{selfIntroduction.length}/2000</div>
          {showSelfIntroError && (
              <div style={{ color: 'red', fontSize: '16px', marginTop: '10px', textAlign: 'left' }}>
                ※ 자기소개를 입력해주세요
              </div>
            )}
        </div>
      </div>

          <hr className={styles.hr} />

          <div className={styles.formGroup} ref={sectionsRef.motivation}>
        <div className={styles.sectionHeaderContainer}>
          <h2 className={`${styles.sectionHeader} ${styles.requiredTwo}`}>지원동기</h2>
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
            onClick={() => handleAiProofreadMotivation(motivation)}
            style={{ marginLeft: '10px' }}
          >
            AI 첨삭 실행
          </button>
        </div>
        <div className={styles.textareaContainer}>
          {motivation.length === 0 && (
            <div className={styles.placeholder}>회사에 지원하게 된 동기를 작성해주세요</div>
          )}
          <pre
            contentEditable="true"
            onInput={(e) => {
              handleMotivationChange(e);
              if (e.target.innerText.trim() === '') {
                setShowMotivationError(true); // 입력이 없으면 오류 상태 유지
              } else {
                setShowMotivationError(false); // 입력이 있으면 오류 해제
              }
            }}
            maxLength="2000"
            onPaste={handlePaste}
            value={motivation}
          >
          </pre>
          <div className={styles.charCounter}>{motivation.length}/2000</div>
          {showMotivationError && (
              <div style={{ color: 'red', fontSize: '16px', marginTop: '10px', textAlign: 'left' }}>
                ※ 지원동기를 입력해주세요
              </div>
            )}
        </div>
      </div>
            
    


            <div className={styles.centerButtons} style={{ marginTop: '30px' }}>
            <div className={styles.formGroup}>
              <button type="button" className={`${styles.cancelBtn} ${styles.sameWidthBtn} ${styles.button}`} onClick={handleCancel}>취소</button>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className={`${styles.submitBtn} ${styles.sameWidthBtn} ${styles.button}`}>이력서 저장</button>
            </div>
          </div>
          
        </form>
      </div>
      </div>

            {isProofreadSidebarOpen && (
         <div className={`${proofreadStyles.proofreadSidebar} ${isProofreadSidebarOpen ? proofreadStyles.open : ''} ${isSidebarCollapsed ? proofreadStyles.collapsed : ''}`}>
          <div className={proofreadStyles.sidebarHeader}>
          <h3 style={{ borderBottom: '2px solid black', paddingBottom: '5px' }}>맞춤법 검사 결과</h3>
              <div className={proofreadStyles.sidebarIcons}>
      {isSidebarCollapsed ? (
        <KeyboardArrowDownIcon onClick={toggleSidebarHeight} style={{ cursor: 'pointer' ,marginRight:'65px',marginTop:'10px' }} />
      ) : (
        <KeyboardArrowUpIcon onClick={toggleSidebarHeight} style={{ cursor: 'pointer' ,marginRight:'65px',marginTop:'10px' }} />
      )}
      <button className={proofreadStyles.closeButton} onClick={closeProofreadSidebar}>
        <CloseIcon style={{marginTop:'5px' }} />
      </button>
    </div>
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
         <div className={`${proofreadStyles.aiproofreadSidebar} aiProofreadSidebar ${isAiProofreadSidebarOpen ? proofreadStyles.open : ''} ${isSidebarCollapsed ? proofreadStyles.collapsed : ''}`}>
          <div className={proofreadStyles.sidebarHeader}>
            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '5px' }}>AI 첨삭 결과</h3>
            <div className={proofreadStyles.sidebarIcons}>
              {isSidebarCollapsed ? (
                <KeyboardArrowDownIcon onClick={toggleSidebarHeight} style={{ cursor: 'pointer' ,marginRight:'300px',marginTop:'10px' }} />
              ) : (
                <KeyboardArrowUpIcon onClick={toggleSidebarHeight} style={{ cursor: 'pointer' ,marginRight:'300px',marginTop:'10px' }} />
              )}
              <button className={proofreadStyles.closeButton} onClick={closeAiProofreadSidebar}>
                <CloseIcon style={{marginTop:'5px' }} />
              </button>
            </div>
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


    </div>
  );
}



export default ResumeForm;
