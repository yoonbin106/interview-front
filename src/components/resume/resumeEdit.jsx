import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import CreateIcon from '@mui/icons-material/Create';
import MonthPickerInput from '@/components/resume/monthPicker';
import DatePickerInput from '@/components/resume/datePicker';
import GenderButtons from '@/components/resume/genderButtons';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import styles from '@/styles/resume/resumeForm.module.css';
import modalStyles from '@/styles/resume/modalStyles.module.css'; // 새 CSS 파일 임포트
import { closestIndexTo } from 'date-fns';

function ResumeEdit({ userId }) {
  const router = useRouter();

  useEffect(() => {
    console.log('ResumeForm component mounted');
  }, []);

  const [selectedGender, setSelectedGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [motivation, setMotivation] = useState('');
  const [formData, setFormData] = useState({
    school_name: '',
    major: '',
    start_date: '',
    end_date: '',
    graduation_status: '',
    company_name: '',
    join_date: '',
    leave_date: '',
    position: '',
    job_description: '',
    language: '',
    language_level: '',
    language_score: '',
    contest_name: '',
    contest_award: '',
    contest_date: '',
    certificate_name: '',
    certificate_issuer: '',
    certificate_date: '',
    portfolio_description: '',
    military_service_type: '',
    military_start_date: '',
    military_end_date: '',
    military_rank: '',
    desired_salary: '',
    desired_start_date: '',
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

  const handleCancel = () => {
    setModalContent('이력서 수정을 취소하시겠습니까?');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalContent('이력서를 수정하시겠습니까?');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmAction = () => {
    if (modalContent === '이력서를 수정하시겠습니까?') {
      // 이력서 등록을 완료한 후 다음 모달로 전환
      setIsModalOpen(false);
      setIsConfirmationOpen(true);
    } else {
      // 첫 번째 모달에서 확인을 누른 경우
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
    <div className={styles.resumeForm}>
      {/* 첫 번째 모달: 이력서 등록 확인 */}
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isModalOpen}
        onClose={closeModal}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="unstyled-modal-title" className={`${styles.h2} ${styles.modalTitle}`}>
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

      {/* 두 번째 모달: 등록 완료 후 메시지 */}
      <Modal
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        open={isConfirmationOpen}
        onClose={closeConfirmationModal}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="confirmation-modal-title" className={`${styles.h2} ${styles.modalTitle}`}>
            이력서 수정이 완료되었습니다
          </h2>
          <div className={modalStyles.modalButtons}>
            <button onClick={navigateToResumeList} className={modalStyles.modalConfirmButton}>
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
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.mb5}>
            <div className={styles.inputWithIcon}>
              <CreateIcon className={styles.icon} />
              <input 
                type="text" 
                placeholder='이력서 제목을 입력하세요' 
                className={styles.resumeTitleInput}
              />
            </div>
          </div>

          <hr/>
          
          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.personalInfo}>인적사항</h2>
          <div className={styles.profileSection}>
            <div className={`${styles.formGroup} ${styles.profileImageUpload}`}>
              <label>프로필 사진</label>
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
                <div className={styles.formGroup} >
                  <label className={styles.required}>이름</label>
                  <input type="text" placeholder="이름" readOnly />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px' }}>
                  <label className={styles.required}>생년월일</label>
                  <input type="text" placeholder="생년월일" readOnly />
                </div>
                <div className={styles.formGroup} style={{ marginLeft: '15px'}}>
                  <label className={styles.required}>성별</label>
                  <GenderButtons selectedGender={selectedGender} setSelectedGender={setSelectedGender} readOnly />
                </div>
              </div>
              <div className={styles.formInline}>
                <div className={styles.formGroup} >
                  <label className={styles.required}>이메일</label>
                  <input type="email" className={styles.emailInput} placeholder="이메일" readOnly />
                </div>
                <div className={styles.formGroup} >
                  <label className={styles.required} >휴대전화번호</label>
                  <input type="text" className={styles.phoneNumInput} placeholder="휴대전화번호" readOnly />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formGroup} style={{marginTop:'30px'}}>
            <label className={styles.required}>우편번호</label>
            <input type="text" className={styles.zipCodeInput} placeholder="우편번호" readOnly />
          </div>
          <div className={styles.formInline}>
            <div className={styles.formGroup}>
              <label>주소</label>
              <input type="text" placeholder="주소" readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>상세주소</label>
              <input type="text" placeholder="상세주소" readOnly />
            </div>
          </div>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.education}>학력</h2>
          <div className={styles.formGroupInlineVertical}>
            <div className={styles.formGroupInline}>
              <div className={styles.formGroup}>
                <label>학교</label>
                <input type="text" placeholder="학교 이름 입력" name="school_name" value={formData.school_name} onChange={handleChange} />
              </div>
              <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                <label>전공</label>
                <input type="text" placeholder="전공 입력" name="major" value={formData.major} onChange={handleChange} />
              </div>
            </div>
            <div className={styles.formGroupInline}>
              <div className={styles.formGroup}  >
                <label>입학</label>
                <MonthPickerInput placeholder="----년 --월" name="start_date" value={formData.start_date} onChange={handleChange} />
              </div>
              <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                <label>졸업</label>
                <MonthPickerInput placeholder="----년 --월" name="end_date" value={formData.end_date} onChange={handleChange} />
              </div>
              <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
                <label>졸업구분</label>
                <select name="graduation_status" value={formData.graduation_status} onChange={handleChange}>
                  <option value="">---</option>
                  <option value="graduated">졸업</option>
                  <option value="enrolled">재학중</option>
                  <option value="leaveOfAbsence">휴학</option>
                </select>
              </div>
            </div>
          </div>
          <button type="button" className={styles.add}>+ 학력 추가</button>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.career}>경력사항</h2>
          <div className={styles.formGroupInlineVertical}>
            <div className={styles.formGroupInline}>
              <div className={styles.formGroup}>
                <label>회사명</label>
                <input type="text" placeholder="회사 이름 입력" name="company_name" value={formData.company_name} onChange={handleChange} />
              </div>
              <div className={styles.formGroup} style={{ width: '200px' , marginLeft:'30px' }}>
                <label>입사</label>
                <div className={styles.datePickerContainer}>
                  <DatePickerInput placeholder="----년 --월 --일" name="join_date" value={formData.join_date} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.formGroup} style={{ width: '200px' , marginLeft:'30px' }}>
                <label>퇴사</label>
                <div className={styles.datePickerContainer}>
                  <DatePickerInput placeholder="----년 --월 --일" name="leave_date" value={formData.leave_date} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className={styles.formGroupInline}>
              <div className={styles.formGroup}>
                <label>직위/직책</label>
                <input type="text" placeholder="직위/직책 입력" name="position" value={formData.position} onChange={handleChange} />
              </div>
              <div className={styles.formGroup} style={{marginLeft:'30px'}}>
                <label>업무내용</label>
                <input type="text" placeholder="업무내용 입력" name="job_description" value={formData.job_description} onChange={handleChange} />
              </div>
            </div>
          </div>
          <button type="button" className={styles.add}>+ 경력 추가</button>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.languages}>외국어</h2>
          <div className={styles.formGroupInline}>
            <div className={styles.formGroup} >
              <label>외국어</label>
              <input type="text" placeholder="외국어 입력" name="language" value={formData.language} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>평가등급</label>
              <input type="text" placeholder="평가등급 입력" name="language_level" value={formData.language_level} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>시험점수</label>
              <input type="text" placeholder="시험점수 입력" name="language_score" value={formData.language_score} onChange={handleChange} />
            </div>
          </div>
          <button type="button" className={styles.add}>+ 외국어 추가</button>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.awards}>입상경력</h2>
          <div className={styles.formGroupInline}>
            <div className={styles.formGroup}>
              <label>대회명</label>
              <input type="text" placeholder="대회명 입력" name="contest_name" value={formData.contest_name} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>입상내역</label>
              <input type="text" placeholder="입상내역 입력" name="contest_award" value={formData.contest_award} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>수상일</label>
              <DatePickerInput placeholder="----년 --월 --일" name="contest_date" value={formData.contest_date} onChange={handleChange} />
            </div>
          </div>
          <button type="button" className={styles.add}>+ 입상경력 추가</button>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.certificates}>자격증</h2>
          <div className={styles.formGroupInline}>
            <div className={styles.formGroup} >
              <label>자격증명</label>
              <input type="text" placeholder="자격증명 입력" name="certificate_name" value={formData.certificate_name} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>발급기관</label>
              <input type="text" placeholder="발급기관 입력" name="certificate_issuer" value={formData.certificate_issuer} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>취득일</label>
              <DatePickerInput placeholder="----년 --월 --일" name="certificate_date" value={formData.certificate_date} onChange={handleChange} />
            </div>
          </div>
          <button type="button" className={styles.add}>+ 자격증 추가</button>

          <hr />
          
          <div className={styles.formGroup} ref={sectionsRef.selfIntroduction}>
            <div className={styles.sectionHeaderContainer}>
              <h2 className={`${styles.h2} ${styles.sectionHeader} ${styles.requiredTwo}`}>자기소개</h2>
              <span className={styles.subText}>AI 첨삭 기능</span>
            </div>
            <div className={styles.textareaContainer}>
              <textarea 
                placeholder="본인을 소개하는 글을 작성해주세요." 
                value={selfIntroduction} 
                onChange={handleSelfIntroductionChange} 
                maxLength="2000">
              </textarea>
              <div className={styles.charCounter}>{selfIntroduction.length}/2000</div>
            </div>
          </div>

          <hr />

          <div className={styles.formGroup} ref={sectionsRef.motivation}>
            <div className={styles.sectionHeaderContainer}>
              <h2 className={`${styles.h2} ${styles.sectionHeader} ${styles.requiredTwo}`}>지원동기</h2>
              <span className={styles.subText}>AI 첨삭 기능</span>
            </div>
            <div className={styles.textareaContainer}>
              <textarea 
                placeholder="회사 지원하게된 동기를 작성해주세요." 
                value={motivation} 
                onChange={handleMotivationChange} 
                maxLength="2000">
              </textarea>
              <div className={styles.charCounter}>{motivation.length}/2000</div>
            </div>
          </div>
          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.portfolio}>포트폴리오</h2>
          <div className={styles.formGroupInline}>
            <div className={styles.formGroup}>
              <label>파일 업로드</label>
              <input type="file" />
            </div>
            <div className={styles.formGroup}>
              <label>포트폴리오 설명</label>
              <input type="text" placeholder="포트폴리오 설명 입력" name="portfolio_description" value={formData.portfolio_description} onChange={handleChange} />
            </div>
          </div>
          <button type="button" className={styles.add}>+ 포트폴리오 추가</button>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.military}>병역사항</h2>
          <div className={`${styles.formGroupInline} ${styles.alignItemsCenter}`}>
            <div className={styles.formGroup}>
              <label>복무구분</label>
              <select name="military_service_type" value={formData.military_service_type} onChange={handleChange}>
                <option value="">선택하세요</option>
                <option value="activeDuty">현역</option>
                <option value="publicService">공익</option>
                <option value="exempted">면제</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>복무 시작일</label>
              <DatePickerInput placeholder="----년 --월 --일" name="military_start_date" value={formData.military_start_date} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>복무 종료일</label>
              <DatePickerInput placeholder="----년 --월 --일" name="military_end_date" value={formData.military_end_date} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' , width:'130px' }}>
              <label>계급(직급)</label>
              <input type="text" placeholder="계급 입력" name="military_rank" value={formData.military_rank} onChange={handleChange} />
            </div>
          </div>

          <hr />

          <h2 className={`${styles.h2} ${styles.sectionHeader}`} ref={sectionsRef.workConditions}>희망 근무조건</h2>
          <div className={styles.formGroupInline}>
            <div className={styles.formGroup}>
              <label>희망 연봉</label>
              <input type="text" placeholder="희망 연봉 입력 (원)" name="desired_salary" value={formData.desired_salary} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ marginLeft: '30px' }}>
              <label>희망 입사일</label>
              <DatePickerInput placeholder="----년 --월 --일" name="desired_start_date" value={formData.desired_start_date} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.centerButtons} style={{marginTop:'30px'}}>
            <div className={styles.formGroup} >
              <button type="button" className={`${styles.cancelBtn} ${styles.sameWidthBtn}`} onClick={handleCancel}>취소</button>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className={`${styles.submitBtn} ${styles.sameWidthBtn}`}>이력서 수정</button>
            </div>
          </div>
        </form>
      </div>
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

export default ResumeEdit;
