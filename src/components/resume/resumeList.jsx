import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/resume/resumeList.module.css';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search'; // SearchIcon 가져오기
import { blue, grey } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import modalStyles from '@/styles/resume/modalStyles.module.css';
import { closestIndexTo } from 'date-fns';

const ResumeList = () => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resumesPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchText, setSearchText] = useState(''); // 검색 버튼을 위한 상태

  const resumes = [
    {
      id: 1,
      title: '이력서 첫번째 입니다1',
      date: '2024.07.23',
      proofreadDate: '2024.07.23',
    },
    {
      id: 2,
      title: '이력서 두번째 입니다2',
      date: '2024.07.23',
    },
    // Add more resumes here
  ];

  const handleButtonClick = (url) => {
    router.push(url);
  };

  const handleDeleteClick = () => {
    setModalContent('삭제하시겠습니까?');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    setModalContent('삭제가 완료되었습니다.');
    setIsConfirmModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  const closeConfirmationModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchTerm(searchText);
  };

  // Filter resumes based on the search term
  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayResumes = filteredResumes.length > 0 ? filteredResumes : resumes;

  // Pagination logic
  const totalResumes = displayResumes.length;  // 총 이력서 개수 계산
  const indexOfLastResume = currentPage * resumesPerPage;
  const indexOfFirstResume = indexOfLastResume - resumesPerPage;
  const currentResumes = displayResumes.slice(indexOfFirstResume, indexOfLastResume);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalResumes / resumesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.resumecontainer}>
      <h2 className={styles.h2}>이력서 관리</h2>
      <div className={styles.filteroptions}>
        <span className={styles.filteroption}>
          <DescriptionIcon sx={{ color: grey[400] }} />첨삭결과가 없는 이력서
        </span>
        <span className={styles.filteroption}>
          <DescriptionIcon sx={{ color: blue[500] }} />첨삭결과가 있는 이력서
        </span>
      </div>
      <div className={styles.newresumebutton}>
        <button onClick={() => handleButtonClick('/resume')}>
          <ControlPointIcon sx={{ color: blue[500] }} className={styles.controlpointicon} />&nbsp; 새로운 이력서 등록
        </button>
      </div>

      <hr />

      <div className={styles.accordioncontainer}>
        {currentResumes.map((resume) => (
          <Accordion key={resume.id} className={styles.customaccordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${resume.id}-content`}
              id={`panel${resume.id}-header`}
            >
              <DescriptionIcon sx={{ color: resume.proofreadDate ? blue[500] : grey[400] }} className={styles.resumeicon} /> &nbsp;
              <span className={styles.resumetext}>{resume.title}</span>
              <span className={styles.resumeright}>
                <span className={styles.resumedate} style={{ marginRight: '10px' }}>{resume.date}</span>
                <span className={styles.resumeactions}>
                  <Button onClick={() => handleButtonClick('/resume/resumeEdit')}>수정</Button>
                  <Button onClick={handleDeleteClick}>삭제</Button>
                </span>
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Button className={styles.subbutton} onClick={() => handleButtonClick('/resume/proofReadResult1')}>첨삭하기</Button>
                {resume.proofreadDate && (
                  <Button className={`${styles.subbutton} ${styles.resultbutton}`} onClick={() => handleButtonClick('/resume/proofReadResult2')}>첨삭결과</Button>
                )}
                {resume.proofreadDate && (
                  <span className={styles.proofreaddate}>최근 첨삭일 {resume.proofreadDate}</span>
                )}
              </div>
              <div className={styles.newbox}>
                <span>2024.07.25 모의면접(면접이름)</span>
                <div>등록완료</div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* Pagination controls */}
      <div className={styles.pagination}>
        {pageNumbers.length > 0 && pageNumbers.map((number) => (
          <span
            key={number}
            className={`${styles.pageNumber} ${currentPage === number ? styles.activePage : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </span>
        ))}
      </div>

      <div className={styles.formContainer}>
          <div className={styles.mb5}>
            <div className={styles.inputContainer}>
              <div className={styles.inputWithIcon}>
                <SearchIcon className={styles.icon} />
                <input 
                  type="text" 
                  placeholder='이력서 제목으로 검색' 
                  value={searchText}
                  onChange={handleSearchChange}
                  className={styles.resumeTitleInput}
                />
              </div>
              <button onClick={handleSearchClick} className={styles.searchButton}>검색</button>
            </div>
          </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isDeleteModalOpen}
        onClose={closeModal}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="unstyled-modal-title" className={`${styles.modalTitle} ${styles.h2}`}>
            {modalContent}
          </h2>
          <div className={modalStyles.modalButtons}>
            <button onClick={closeModal} className={modalStyles.modalCancelButton}>
              취소
            </button>
            <button onClick={handleConfirmDelete} className={modalStyles.modalConfirmButton}>
              확인
            </button>
          </div>
        </ModalContent>
      </Modal>

      {/* 삭제 완료 모달 */}
      <Modal
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        open={isConfirmModalOpen}
        onClose={closeConfirmationModal}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 450 }}>
          <h2 id="confirmation-modal-title" className={`${styles.modalTitle} ${styles.h2}`}>
            삭제가 완료되었습니다.
          </h2>
          <div className={modalStyles.modalButtons}>
            <button onClick={closeConfirmationModal} className={modalStyles.modalConfirmButton}>
              확인
            </button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

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

export default ResumeList;
