import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/resume/resumeList.module.css';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import { grey } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import modalStyles from '@/styles/resume/modalStyles.module.css';


const ResumeList = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resumesPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchText, setSearchText] = useState('');
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const accordionRefs = useRef([]); // 아코디언을 참조하기 위한 배열

  useEffect(() => {
    document.body.style.overflowY = 'scroll';
    return () => {
      document.body.style.overflowY = '';
    };
  }, []);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const email = localStorage.getItem('email');
    try {
      const response = await axios.get(`http://localhost:8080/api/resume/user-resumes?email=${email}`);
      const sortedResumes = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setResumes(sortedResumes);
    } catch (error) {
      console.error('이력서 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const handleButtonClick = (url) => {
    router.push(url);
  };

  const handleDeleteClick = (resumeId, event) => {
    event.stopPropagation();
    setResumeToDelete(resumeId);
    setModalContent('삭제하시겠습니까?');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/resume/delete/${resumeToDelete}`);
      setIsDeleteModalOpen(false);
      setModalContent('삭제가 완료되었습니다.');
      setIsConfirmModalOpen(true);
  
      // 이력서를 삭제한 후 목록을 다시 불러옴
      await fetchResumes();
  
      // 현재 페이지에 이력서가 없으면 이전 페이지로 이동
      const totalResumesAfterDeletion = resumes.length - 1; // 이력서를 하나 삭제했으므로 전체 개수에서 1을 뺌
      const lastPage = Math.ceil(totalResumesAfterDeletion / resumesPerPage);
  
      // 현재 페이지가 마지막 페이지보다 크면 마지막 페이지로 이동
      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }
    } catch (error) {
      console.error('이력서 삭제 중 오류 발생:', error);
    }
  };
  const handleDownloadClick = async (resumeId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.get(`http://localhost:8080/api/resume/download/${resumeId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('이력서 다운로드 중 오류 발생:', error);
    }
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

  const handleResetClick = () => {
    setSearchText('');
    setSearchTerm('');
  };

  const handleAIProofreadClick = (resumeId, event) => {
    event.stopPropagation();
    router.push(`/resume/resumeForm2?resumeId=${resumeId}`);
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayResumes = filteredResumes.length > 0 ? filteredResumes : resumes;

  const totalResumes = displayResumes.length;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleAccordionChange = (index) => (event, isExpanded) => {
    if (isExpanded) {
      accordionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.resumecontainer}>
      <div className={styles.h2}>내 이력서 관리</div>

      <div className={styles.newresumebutton}>
        <button onClick={() => handleButtonClick('/resume')}>
          <ControlPointIcon sx={{ color: '#5A8AF2', marginLeft: '6px' }} className={styles.controlpointicon} style={{ marginTop: '2.5px' }} />&nbsp; 새로운 이력서 등록
        </button>
      </div>

      <hr className={styles.hrStyles} />

      <div className={styles.accordioncontainer}>
        {currentResumes.length > 0 ? (
          currentResumes.map((resume, index) => (
            <Accordion
              key={resume.resumeId}
              className={styles.customaccordion}
              elevation={0}
              ref={(el) => (accordionRefs.current[index] = el)}
              onChange={handleAccordionChange(index)}
              sx={{
                '&::before': {
                  backgroundColor: 'transparent',
                },
                '&:first-of-type': {
                  borderRadius: '8px',
                },
                '&:last-of-type': {
                  borderRadius: '8px',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${resume.resumeId}-content`}
                id={`panel${resume.resumeId}-header`}
                className={styles.accordionsummary}
              >
                <div className={styles.resumeHeader}>
                  <div className={styles.resumeTitleContainer}>
                    <DescriptionIcon sx={{ color: '#5A8AF2' }} className={styles.resumeicon} />
                    <span className={styles.resumetext}>{resume.title || 'Untitled'}</span>
                  </div>
                  <div className={styles.resumeDateContainer}>
                    <span className={styles.resumedate}>
                      {formatDate(resume.createdDate)}
                    </span>
                  </div>
                </div>
              </AccordionSummary>

              <AccordionDetails className={styles.accordiondetails}>
                <div className={styles.actionContainer}>
                  <button
                    onClick={(event) => handleAIProofreadClick(resume.resumeId, event)}
                    className={styles.aiProofreadButton}
                  >
                    AI첨삭 테스트
                  </button>
                  <div className={styles.rightActions}>
                    <button
                      onClick={(event) => handleDownloadClick(resume.resumeId, event)}
                      className={styles.downButton}
                    >
                      이력서(PDF)
                      <FileDownloadIcon sx={{ marginLeft: '8px',paddingTop:'3px', marginRight:'-8px' }} />
                    </button>
                    <button
                      onClick={(event) => handleDeleteClick(resume.resumeId, event)}
                      className={styles.deleteButton}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div className={styles.noResumesMessage}>
            저장된 이력서가 없습니다
          </div>
        )}
      </div>

      {totalResumes > 0 && (
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
      )}

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
            <button onClick={handleResetClick} className={styles.resetButton}>초기화</button>
          </div>
        </div>
      </div>

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

const Backdrop = React.forwardRef(
  ({ open, className, ...other }, ref) => {
    return (
      <div
        className={className}
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
