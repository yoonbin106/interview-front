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
import {
  openPostcodePopup,
} from "@/api/getPostCode";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useStores } from '@/contexts/storeContext';  // MobX 스토어 사용

function ResumeForm() {
  const router = useRouter();
  const { userStore } = useStores();

  const [profileImage, setProfileImage] = useState(null);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);
  const [educationFields, setEducationFields] = useState([{ school_name: '', major: '', start_date: '', end_date: '', graduation_status: '' }]);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showTitleError, setShowTitleError] = useState(false); // 유효성 검사 상태 추가

  const [formData, setFormData] = useState({
    resume_title: '',
    military_service_type: '',
    military_start_date: '',
    military_end_date: '',
    military_rank: '',
    desired_salary: '',
    desired_start_date: '',
    gender: '',
    name: userStore.username || '',
    email: userStore.email || ''
  });


  const sectionsRef = {
    personalInfo: useRef(null),
    education: useRef(null),
    career: useRef(null),
    languages: useRef(null),
    awards: useRef(null),
    certificates: useRef(null),
    military: useRef(null),
    workConditions: useRef(null),
  };

  useEffect(() => {
    // 사용자 정보를 userStore에서 가져와 formData를 초기화
    setFormData(prevFormData => ({
      ...prevFormData,
      name: userStore.username || '',
      email: userStore.email || ''
    }));
  }, [userStore.username, userStore.email]);  // userStore의 username과 email이 변경될 때마다 실행

  const scrollToSection = (section) => {
    sectionsRef[section].current.scrollIntoView({ behavior: 'smooth' });
  };


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    
    // 이력서 제목이 입력되지 않은 경우
    if (formData.resume_title.trim() === '') {
      setShowTitleError(true);  // 에러 메시지 표시
      window.scrollTo(0, 0); // 페이지 맨 위로 스크롤
      return;
    }
  
    setModalContent('정보를 저장하고<br/>다음으로 넘어가시겠습니까?');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmAction = async () => {
    if (modalContent === '정보를 저장하고<br/>다음으로 넘어가시겠습니까?') {
      try {
        const pdfData = await generatePDF();
        const formDataToSend = new FormData(); // 새로운 FormData 객체 생성
        formDataToSend.append('file', pdfData);
        formDataToSend.append('title', formData.resume_title);  // formData state에서 가져옴
        formDataToSend.append('email', formData.email);         // formData state에서 가져옴

        await axios.post('http://localhost:8080/api/resume/upload', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setIsModalOpen(false);
        setIsConfirmationOpen(true);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    } else {
      setIsModalOpen(false);
      router.push('/resume/resumeList');
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
          <li onClick={() => handleSidebarClick('personalInfo')}>인적사항</li>
          <li onClick={() => handleSidebarClick('education')}>학력</li>
          <li onClick={() => handleSidebarClick('career')}>경력사항</li>
          <li onClick={() => handleSidebarClick('languages')}>외국어</li>
          <li onClick={() => handleSidebarClick('awards')}>입상경력</li>
          <li onClick={() => handleSidebarClick('certificates')}>자격증</li>
          <li onClick={() => handleSidebarClick('military')}>병역사항</li>
          <li onClick={() => handleSidebarClick('workConditions')}>희망근무조건</li>
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
                onChange={(e) => {
                  setFormData({ ...formData, resume_title: e.target.value });
                  if (e.target.value.trim() !== '') {
                    setShowTitleError(false);  // 제목 입력 시 에러 메시지 숨기기
                  }
                }}
              />
            </div>
            {showTitleError && (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '10px', textAlign: 'left' }}>
                ※ 이력서 제목을 입력하세요
              </div>
            )}
          </div>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader_personal} ref={sectionsRef.personalInfo}>인적사항</h2>
          <div className={styles.profileSection}>
            <div className={`${styles.formGroup} ${styles.profileImageUpload}`}>
              <label className={styles.label}>프로필 사진</label>
              <div className={styles.profileImageBox}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile"  style={{ display: 'inline-block' }} />
                ) : (
                  <label htmlFor="file-input" className={styles.plusButton}>+</label>
                )}
                <input
                  id="file-input"
                  type="file"
                  onChange={handleImageChange}
                  className={styles.hiddenFileInput}
                />
              </div>
            </div>
            <div className={styles.personalInfo}>
              <div className={styles.formInline}>
                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${styles.required}`}>이름</label>
                  <input type="text" placeholder="이름" value={formData.name} readOnly />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px' }}>
                  <label className={`${styles.label} ${styles.required}`}>생년월일</label>
                  <input type="text" placeholder="생년월일" />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px' }}>
                  <label className={`${styles.label} ${styles.required}`}>성별</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={`${styles.genderSelect} ${styles.select}`}>
                    <option value="">선택하세요</option>
                    <option value="male">남자</option>
                    <option value="female">여자</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
              <div className={styles.formInline}>
                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${styles.required}`}>이메일</label>
                  <input type="email" className={styles.input} placeholder="이메일"  value={formData.email} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${styles.required}`}>휴대전화번호</label>
                  <input type="text" className={styles.phoneNumInput} placeholder="휴대전화번호" />
                </div>
              </div>
            </div>
          </div>

                
          <div className={styles.formGroup} style={{ marginTop: '30px' }}>
            <label className={`${styles.label} ${styles.required}`}>우편번호</label>
            <div className="input-group mb-2">
                <input
                  type="text"
                  className={styles.formControl}
                  id="zipcode"
                  placeholder="우편번호"
                  value={postcode}
                  readOnly
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
                  className={styles.formControl_address}
                  id="specificAddress"
                  placeholder="상세주소"
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
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
        onClick={() => removeField(index, educationFields, setEducationFields)} 
        style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }} // X 버튼 위치 조정
      />
    )}

    {index > 0 && <div className={styles.formGroupSeparator}></div>}

    <div className={styles.formGroupInlineVertical}>
      <div className={styles.formGroupInline}>
        <div className={styles.formGroup} style={{ flex: 1 }}>
          <label className={styles.label}>학교</label>
          <input
            type="text"
            placeholder="학교 이름 입력"
            name="school_name"
            className={styles.input}
            value={field.school_name}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields)}
          />
        </div>
        <div className={styles.formGroup} style={{ marginLeft: '30px', flex: 1 }}>
          <label className={styles.label}>전공</label>
          <input
            type="text"
            placeholder="전공 입력"
            name="major"
            className={styles.input}
            value={field.major}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields)}
          />
        </div>
      </div>
      <div className={styles.formGroupInline}>
        <div className={styles.formGroup}>
          <label className={styles.label}>입학</label>
          <input
            type="month"
            placeholder="----년 --월"
            name="start_date"
            className={styles.input}
            value={field.start_date}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields)}
          />
        </div>
        <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
          <label className={styles.label}>졸업</label>
          <input
            type="month"
            placeholder="----년 --월"
            name="end_date"
            className={styles.input}
            value={field.end_date}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields)}
          />
        </div>
        <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
          <label className={styles.label}>졸업구분</label>
          <select
            name="graduation_status"
            value={field.graduation_status}
            className={styles.select}
            onChange={(e) => handleFieldChange(index, e, educationFields, setEducationFields)}
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
  onClick={() => addField(educationFields, setEducationFields, { school_name: '', major: '', start_date: '', end_date: '', graduation_status: '' })}
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
                  style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }} // X 버튼 위치 조정
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
                  style={{ position: 'absolute', right: '8px', top: '27px', cursor: 'pointer', color: '#6c757d' }} // X 버튼 위치 조정
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
                <label className={styles.label}>희망 입사날짜</label>
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
            
          <div className={styles.centerButtons} style={{ marginTop: '30px' }}>
            <div className={styles.formGroup}>
              <button type="button" className={`${styles.cancelBtn} ${styles.sameWidthBtn} ${styles.button}`} onClick={handleCancel}>취소</button>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className={`${styles.submitBtn} ${styles.sameWidthBtn} ${styles.button}`}>저장 후 다음</button>
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

export default ResumeForm;
