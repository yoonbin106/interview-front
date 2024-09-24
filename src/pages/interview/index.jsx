import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Modal,
  Backdrop,
  Fade,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from '@mui/material';
import { getAllPayInfo } from 'api/user';
import axios from 'axios';
import InterviewOption from '@/components/interview/interviewOption';
import styles from '@/styles/interview/interviewSelectPage.module.css';

const InterviewSelectPage = observer(() => {
  const router = useRouter();
  const { interviewStore, userStore, authStore } = useStores();
  const [openModal, setOpenModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [error, setError] = useState('');
  const [resumeList, setResumeList] = useState([]);
  const [interviewType, setInterviewType] = useState('');

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

  const handleOpenModal = (type) => {
    setInterviewType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError('');
  };

  const handleResumeChange = (resumeId) => {
    setSelectedResume(resumeId);
  };

  const handleStartInterview = () => {
    if (!selectedResume) {
      setError('이력서를 반드시 선택해야 합니다.');
      return;
    }

    interviewStore.setChoosedResume(selectedResume);
    interviewStore.setType(interviewType);

    router.push({
      pathname: '/interview/interviewPreparation',
    });
  };

  const fetchResumes = async () => {
    const email = userStore.email;
    try {
      const response = await axios.get(`http://localhost:8080/api/resume/user-resumes?email=${email}`);
      const sortedResumes = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setResumeList(sortedResumes);
    } catch (error) {
      console.error('이력서 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const realInterviewFeatures = [
    '실제 면접과 유사한 환경에서의 면접 연습',
    '다양한 면접 유형에 대한 연습 기회 제공',
    '맞춤형 질문으로 실전 감각 향상',
  ];

  const mockInterviewFeatures = [
    '다양한 일반 면접 질문으로 기본기 다지기',
    '스크립트와 키워드 제공으로 답변 구조화',
    'AI 분석을 통한 상세한 피드백 제공',
  ];


  return (
    <Container maxWidth="lg" className={styles.container}>
      <Fade in={true} timeout={1000}>
        <Paper elevation={3} className={styles.headerPaper}>
          <Typography variant="h3" align="center" className={styles.mainTitle}>
            면접 유형 선택
          </Typography>
          <Typography variant="h6" align="center" className={styles.subtitle}>
            자신감 있는 면접을 위한 첫 걸음, 지금 시작하세요.
          </Typography>
        </Paper>
      </Fade>
      
      <Grid container spacing={4} justifyContent="center" className={styles.optionsContainer}>
        <Grid item xs={12} md={6}>
          <InterviewOption
            title="실전 면접"
            imageSrc="/images/Real-Interview.png"
            features={realInterviewFeatures}
            buttonText="실전 면접 시작하기"
            onStart={() => handleOpenModal('real')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InterviewOption
            title="모의 면접"
            imageSrc="/images/Mock-Interview.png"
            features={mockInterviewFeatures}
            buttonText="모의 면접 시작하기"
            onStart={() => handleOpenModal('mock')}
          />
        </Grid>
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box className={styles.modalContent}>
            <Typography variant="h6" gutterBottom>
              면접 준비
            </Typography>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              이력서 선택
            </Typography>
            <Grid container spacing={2}>
              {resumeList.map((resume) => (
                <Grid item xs={12} key={resume.resumeId}>
                  <Button
                    variant={selectedResume === resume.resumeId ? 'contained' : 'outlined'}
                    color="primary"
                    fullWidth
                    onClick={() => handleResumeChange(resume.resumeId)}
                  >
                    {resume.title}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {error && (
              <Typography color="error" style={{ marginTop: '10px' }}>
                {error}
              </Typography>
            )}

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleStartInterview}
                >
                  시작하기
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={handleCloseModal}>
                  취소
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
});

export default InterviewSelectPage;