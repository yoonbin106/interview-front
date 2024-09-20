import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/resume/resumeList.module.css';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import { Modal, Box, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';
import { fetchInterviewResult, getInterviewResults } from 'api/interview';

const InterviewResultList = observer(() => {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(5); // 페이지당 5개의 비디오를 표시하도록 설정
  const accordionRefs = useRef([]);
  const { interviewStore, userStore, authStore } = useStores();

  useEffect(() => {
    if (!authStore) {
      console.error('authStore is undefined');
      return;
    }
    // 로그인 상태를 확인
    authStore.checkLoggedIn();

    if (!authStore.loggedIn) {
      // 로그아웃 상태라면 메인 페이지로 이동
      alert('로그인해야 접속이 가능합니다.');
      router.push('/');
    }
  }, [authStore, router]);


  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const userId = userStore.id;
    try {
      const response = await getInterviewResults(userId);
      // uploadDate를 기준으로 내림차순 정렬
      const sortedVideos = response.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      setVideos(sortedVideos);
    } catch (error) {
      console.error('면접 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const handleAIProofreadClick = async (videoId, event) => {
    event.stopPropagation();
    const data = await fetchInterviewResult(videoId);
    if (data.claudeAnalyses && data.claudeAnalyses.length > 0) {
      const parsedAnalysisData = JSON.parse(data.claudeAnalyses[0].analysisData);
      data.claudeAnalyses[0].analysisData = parsedAnalysisData;
    }
    console.log(data);
    interviewStore.setFetchedInterview(data);
    // router.push(`/interview/interviewResult?videoId=${videoId}`);
    router.push(`/interview/interviewResult`);
  };

  const handleDeleteClick = (videoId, event) => {
    event.stopPropagation();
    setVideoToDelete(videoId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/video/${videoToDelete}`);
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
      fetchVideos(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVideoToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  };

  const totalVideos = videos.length;
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalVideos / videosPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.resumecontainer}>
      <div className={styles.h2}>내 면접 관리</div>

      <div className={styles.accordioncontainer}>
        {currentVideos.length > 0 ? (
          currentVideos.map((video, index) => (
            <Accordion
              key={video.id}
              className={styles.customaccordion}
              elevation={0}
              ref={(el) => (accordionRefs.current[index] = el)}
              sx={{ '&::before': { backgroundColor: 'transparent' } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${video.id}-content`}
                id={`panel${video.id}-header`}
                className={styles.accordionsummary}
              >
                <div className={styles.resumeHeader}>
                  <div className={styles.resumeTitleContainer}>
                    <DescriptionIcon sx={{ color: '#5A8AF2' }} className={styles.resumeicon} />
                    <span className={styles.resumetext}>면접 결과</span>
                  </div>
                  <div className={styles.resumeDateContainer}>
                    <span className={styles.resumedate}>
                      {formatDate(video.uploadDate)}
                    </span>
                  </div>
                </div>
              </AccordionSummary>

              <AccordionDetails className={styles.accordiondetails}>
                <div className={styles.actionContainer}>
                  <button
                    onClick={(event) => handleAIProofreadClick(video.id, event)}
                    className={styles.aiProofreadButton}
                  >
                    면접결과 확인
                  </button>
                  <button
                    onClick={(event) => handleDeleteClick(video.id, event)}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div className={styles.noResumesMessage}>저장된 면접이 없습니다</div>
        )}
      </div>

      {totalVideos > 0 && (
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

      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal} // 모달 외부 클릭으로 닫히지 않도록
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 흐리게 처리
          },
        }}
      >
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={closeDeleteModal}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <h2 id="modal-title" style={{ color: 'red', textAlign: 'center' }}>
            복구가 불가능합니다. 정말 삭제하시겠습니까?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
            <Button variant="contained" color="primary" onClick={closeDeleteModal} style={{ backgroundColor: grey[500] }}>
              취소
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              삭제
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none', // 모달 외부 클릭 방지
  borderRadius: 2,
};

export default InterviewResultList;