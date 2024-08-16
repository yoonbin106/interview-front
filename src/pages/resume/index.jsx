import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import styles from '@/styles/resume/resumeForm.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css';
import proofreadStyles from '@/styles/resume/proofreadStyles.module.css';
import { closestIndexTo } from 'date-fns';

function ResumeForm() {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(null);
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');

  // 맞춤법 검사 결과를 저장할 상태 및 사이드바 열림 상태
  const [proofreadResult, setProofreadResult] = useState([]);
  const [isProofreadSidebarOpen, setIsProofreadSidebarOpen] = useState(false);

  const [educationFields, setEducationFields] = useState([{ school_name: '', major: '', start_date: '', end_date: '', graduation_status: '' }]);
  const [careerFields, setCareerFields] = useState([{ company_name: '', join_date: '', leave_date: '', position: '', job_description: '' }]);
  const [languageFields, setLanguageFields] = useState([{ language: '', language_level: '', language_score: '' }]);
  const [awardFields, setAwardFields] = useState([{ contest_name: '', contest_award: '', contest_date: '' }]);
  const [certificateFields, setCertificateFields] = useState([{ certificate_name: '', certificate_issuer: '', certificate_date: '' }]);
  const [portfolioFields, setPortfolioFields] = useState([{ portfolio_description: '' }]);


  const [formData, setFormData] = useState({
    resume_title: '',
    military_service_type: '',
    military_start_date: '',
    military_end_date: '',
    military_rank: '',
    desired_salary: '',
    desired_start_date: '',
    gender: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

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

  const confirmAction = () => {
    if (modalContent === '작성한 이력서를 등록하시겠습니까?') {
      const dataToSend = {
        ...formData,
        educationFields,
        careerFields,
        languageFields,
        awardFields,
        certificateFields,
        portfolioFields,
        selfIntroduction,
        motivation,
      };

      axios.post('http://localhost:8080/api/resume', dataToSend)
        .then(response => {
          console.log('성공:', response.data);
          setIsModalOpen(false);
          setIsConfirmationOpen(true);
        })
        .catch(error => {
          console.error('에러:', error);
        });
    } else {
      setIsModalOpen(false);
      router.push('/resume/resumeList');
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

  const sectionsRef = {
    personalInfo: useRef(null),
    education: useRef(null),
    career: useRef(null),
    languages: useRef(null),
    awards: useRef(null),
    certificates: useRef(null),
    portfolio: useRef(null),
    military: useRef(null),
    workConditions: useRef(null),
    selfIntroduction: useRef(null),
    motivation: useRef(null)
  };

  const handleSidebarClick = (section) => {
    sectionsRef[section].current.scrollIntoView({ behavior: 'smooth' });
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
          <li onClick={() => handleSidebarClick('personalInfo')}>인적사항</li>
          <li onClick={() => handleSidebarClick('education')}>학력</li>
          <li onClick={() => handleSidebarClick('career')}>경력사항</li>
          <li onClick={() => handleSidebarClick('languages')}>외국어</li>
          <li onClick={() => handleSidebarClick('awards')}>입상경력</li>
          <li onClick={() => handleSidebarClick('certificates')}>자격증</li>
          <li onClick={() => handleSidebarClick('selfIntroduction')}>자기소개</li>
          <li onClick={() => handleSidebarClick('motivation')}>지원동기</li>
          <li onClick={() => handleSidebarClick('portfolio')}>포트폴리오</li>
          <li onClick={() => handleSidebarClick('military')}>병역사항</li>
          <li onClick={() => handleSidebarClick('workConditions')}>희망근무조건</li>
        </ul>
      </div>
      <div className={styles.formContainer} >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.mb5}>
            <div className={styles.inputWithIcon}>
              <CreateIcon className={styles.icon} />
              <input
                type="title"
                placeholder="이력서 제목을 입력하세요"
                className={`${styles.resumeTitleInput} ${styles.input}`}
                name="resume_title"
                value={formData.resume_title}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.personalInfo}>인적사항</h2>
          <div className={styles.profileSection}>
            <div className={`${styles.formGroup} ${styles.profileImageUpload}`}>
              <label className={styles.label}>프로필 사진</label>
              <div className={styles.profileImageBox}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className={styles.profileImage} />
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
                  <input type="text" placeholder="이름" readOnly />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px' }}>
                  <label className={`${styles.label} ${styles.required}`}>생년월일</label>
                  <input type="text" placeholder="생년월일" readOnly />
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
                  <input type="email" className={styles.input} placeholder="이메일" readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${styles.required}`}>휴대전화번호</label>
                  <input type="text" className={styles.phoneNumInput} placeholder="휴대전화번호" readOnly />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formGroup} style={{ marginTop: '30px' }}>
            <label className={`${styles.label} ${styles.required}`}>우편번호</label>
            <input type="text" className={`${styles.zipCodeInput} ${styles.input}`} placeholder="우편번호" readOnly />
          </div>
          <div className={styles.formInline}>
            <div className={styles.formGroup}>
              <label className={styles.label}>주소</label>
              <input type="text" placeholder="주소" readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>상세주소</label>
              <input type="text" placeholder="상세주소" readOnly />
            </div>
          </div>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.education}>학력</h2>
          {educationFields.map((field, index) => (
            <div key={index}>

              {index > 0 && <div className={styles.formGroupSeparator}></div>}

              <div className={styles.formGroupInlineVertical}>
                <div className={styles.formGroupInline}>
                  <div className={styles.formGroup}>

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
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
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
          <button type="button" className={`${styles.add} ${styles.button}`} onClick={() => addField(educationFields, setEducationFields, { school_name: '', major: '', start_date: '', end_date: '', graduation_status: '' })}>+ 학력 추가</button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.career}>경력사항</h2>
          {careerFields.map((field, index) => (
            <div key={index}>

              {index > 0 && <div className={styles.formGroupSeparator}></div>}

              <div className={styles.formGroupInlineVertical}>
                <div className={styles.formGroupInline}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>회사명</label>
                    <input
                      type="text"
                      placeholder="회사 이름 입력"
                      name="company_name"
                      className={styles.input}
                      value={field.company_name}
                      onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ width: '200px', marginLeft: '30px' }}>
                    <label className={styles.label}>입사날짜</label>
                    <input
                      type="month"
                      name="join_date"
                      className={styles.input}
                      value={field.join_date}
                      onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ width: '200px', marginLeft: '30px' }}>
                    <label className={styles.label}>퇴사날짜</label>
                    <input
                      type="month"
                      name="leave_date"
                      className={styles.input}
                      value={field.leave_date}
                      onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
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
                      className={styles.input}
                      value={field.position}
                      onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>업무내용</label>
                    <input
                      type="text"
                      placeholder="업무내용 입력"
                      name="job_description"
                      className={styles.input}
                      value={field.job_description}
                      onChange={(e) => handleFieldChange(index, e, careerFields, setCareerFields)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={`${styles.add} ${styles.button}`} onClick={() => addField(careerFields, setCareerFields, { company_name: '', join_date: '', leave_date: '', position: '', job_description: '' })}>+ 경력 추가</button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.languages}>외국어</h2>
          {languageFields.map((field, index) => (
            <div key={index}>

              {index > 0 && <div className={styles.formGroupSeparator}></div>}

              <div className={styles.formGroupInlineVertical}>
                <div className={styles.formGroupInline}>
                  <div className={styles.formGroup}>

                    <label className={styles.label}>외국어</label>
                    <input
                      type="text"
                      placeholder="외국어 입력"
                      name="language"
                      className={styles.input}
                      value={field.language}
                      onChange={(e) => handleFieldChange(index, e, languageFields, setLanguageFields)}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>평가등급</label>
                    <input
                      type="text"
                      placeholder="평가등급 입력"
                      name="language_level"
                      className={styles.input}
                      value={field.language_level}
                      onChange={(e) => handleFieldChange(index, e, languageFields, setLanguageFields)}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                    <label className={styles.label}>시험점수</label>
                    <input
                      type="text"
                      placeholder="시험점수 입력"
                      name="language_score"
                      className={styles.input}
                      value={field.language_score}
                      onChange={(e) => handleFieldChange(index, e, languageFields, setLanguageFields)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={`${styles.add} ${styles.button}`} onClick={() => addField(languageFields, setLanguageFields, { language: '', language_level: '', language_score: '' })}>+ 외국어 추가</button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.awards}>입상경력</h2>
          {awardFields.map((field, index) => (
            <div key={index}>

              {index > 0 && <div className={styles.formGroupSeparator}></div>}
              <div className={styles.formGroupInline}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>대회명</label>
                  <input
                    type="text"
                    placeholder="대회명 입력"
                    name="contest_name"
                    className={styles.input}
                    value={field.contest_name}
                    onChange={(e) => handleFieldChange(index, e, awardFields, setAwardFields)}
                  />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                  <label className={styles.label}>입상내역</label>
                  <input
                    type="text"
                    placeholder="입상내역 입력"
                    name="contest_award"
                    className={styles.input}
                    value={field.contest_award}
                    onChange={(e) => handleFieldChange(index, e, awardFields, setAwardFields)}
                  />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                  <label className={styles.label}>수상날짜</label>
                  <input
                    type="month"
                    name="contest_date"
                    className={styles.input}
                    value={field.contest_date}
                    onChange={(e) => handleFieldChange(index, e, awardFields, setAwardFields)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={`${styles.add} ${styles.button}`} onClick={() => addField(awardFields, setAwardFields, { contest_name: '', contest_award: '', contest_date: '' })}>+ 입상경력 추가</button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.certificates}>자격증</h2>
          {certificateFields.map((field, index) => (
            <div key={index} >
              {index > 0 && <div className={styles.formGroupSeparator}></div>}
              <div className={styles.formGroupInline}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>자격증명</label>
                  <input
                    type="text"
                    placeholder="자격증명 입력"
                    name="certificate_name"
                    className={styles.input}
                    value={field.certificate_name}
                    onChange={(e) => handleFieldChange(index, e, certificateFields, setCertificateFields)}
                  />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                  <label className={styles.label}>발급기관</label>
                  <input
                    type="text"
                    placeholder="발급기관 입력"
                    name="certificate_issuer"
                    className={styles.input}
                    value={field.certificate_issuer}
                    onChange={(e) => handleFieldChange(index, e, certificateFields, setCertificateFields)}
                  />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                  <label className={styles.label}>취득날짜</label>
                  <input
                    type="month"
                    name="certificate_date"
                    className={styles.input}
                    value={field.certificate_date}
                    onChange={(e) => handleFieldChange(index, e, certificateFields, setCertificateFields)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={`${styles.add} ${styles.button}`} onClick={() => addField(certificateFields, setCertificateFields, { certificate_name: '', certificate_issuer: '', certificate_date: '' })}>+ 자격증 추가</button>

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
          {portfolioFields.map((field, index) => (
            <div key={index} >
              {index > 0 && <div className={styles.formGroupSeparator}></div>}
              <div className={styles.formGroupInline}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>파일 업로드</label>
                  <input
                    type="file"
                    name={`portfolio_file_${index}`}
                    className={styles.input} // 각 파일 입력 필드에 고유한 name 부여
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>포트폴리오 설명</label>
                  <input
                    type="text"
                    placeholder="포트폴리오 설명 입력"
                    name="portfolio_description"
                    className={styles.input}
                    value={field.portfolio_description}
                    onChange={(e) => handleFieldChange(index, e, portfolioFields, setPortfolioFields)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={`${styles.add} ${styles.button}`} onClick={() => addField(portfolioFields, setPortfolioFields, { portfolio_description: '' })}>+ 포트폴리오 추가</button>

          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.military}>병역사항</h2>
          <div className={`${styles.formGroupInline} ${styles.alignItemsCenter}`}>
            <div className={styles.formGroup}>
              <label className={styles.label}>복무구분</label>
              <select
                name="military_service_type"
                className={styles.select}
                value={formData.military_service_type}
                onChange={handleChange}
              >
                <option value="">선택하세요</option>
                <option value="activeDuty">현역</option>
                <option value="publicService">공익</option>
                <option value="exempted">면제</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label className={styles.label}>복무 시작</label>
              <input
                type="month"
                name="military_start_date"
                className={styles.input}
                value={formData.military_start_date}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label className={styles.label}>복무 종료</label>
              <input
                type="month"
                name="military_end_date"
                className={styles.input}
                value={formData.military_end_date}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px', width: '130px' }}>
              <label className={styles.label}>계급(직급)</label>
              <input
                type="text"
                placeholder="계급 입력"
                name="military_rank"
                className={styles.input}
                value={formData.military_rank}
                onChange={handleChange}
              />
            </div>
          </div>


          <hr className={styles.hr} />

          <h2 className={styles.sectionHeader} ref={sectionsRef.workConditions}>희망 근무조건</h2>
          <div className={styles.formGroupInline}>
            <div className={styles.formGroup}>
              <label className={styles.label}>희망 연봉</label>
              <input
                type="text"
                placeholder="희망 연봉 입력 (원)"
                name="desired_salary"
                className={styles.input}
                value={formData.desired_salary}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label className={styles.label}>희망 입사날짜</label>
              <input
                type="month"
                name="desired_start_date"
                className={styles.input}
                value={formData.desired_start_date}
                onChange={handleChange}
              />
            </div>
          </div>
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