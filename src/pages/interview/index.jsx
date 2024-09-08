//src\pages\interview\index.jsx
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
  Box
} from '@mui/material';
import { getAllPayInfo } from 'api/user'; // 결제 정보 불러오기
import axios from 'axios'; // 이력서 데이터 가져오기용
import InterviewOption from '@/components/interview/interviewOption'; // 기존 InterviewOption 컴포넌트
import styles from '@/styles/interview/interviewSelectPage.module.css';

const InterviewSelectPage = observer(() => {
  const router = useRouter();
  const { interviewStore, userStore } = useStores();
  const [openModal, setOpenModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [error, setError] = useState('');
  const [paymentList, setPaymentList] = useState([]);
  const [resumeList, setResumeList] = useState([]);
  const [interviewType, setInterviewType] = useState('');

  // 모달 열기 및 닫기
  const handleOpenModal = (type) => {
    setInterviewType(type); // 면접 유형 설정
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError(''); // 에러 메시지 초기화
  };

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleResumeChange = (resumeId) => {
    setSelectedResume(resumeId);
  };

  const handleStartInterview = () => {
    if (!selectedPayment || !selectedResume) {
      setError('결제 옵션과 이력서를 반드시 선택해야 합니다.');
      return;
    }

    // 선택한 결제와 이력서 정보를 store에 저장
    interviewStore.setChoosedPayment(selectedPayment);
    interviewStore.setChoosedResume(selectedResume);
    interviewStore.setType(interviewType); // 면접 유형 설정
    interviewStore.setStream('');
    interviewStore.setCameraReady(false);
    interviewStore.setMicReady(false);
    interviewStore.setCountdown(5);
    interviewStore.setCurrentStep(1);
    interviewStore.setAudioLevel(0);
    interviewStore.setAllReady(false);
    interviewStore.setButtonActive(false);

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

  const fetchPaymentInfo = async () => {
    try {
      const paymentData = await getAllPayInfo();
      setPaymentList(paymentData.data);
    } catch (error) {
      console.error('결제 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  // 컴포넌트가 마운트될 때 이력서 및 결제 정보 불러오기
  useEffect(() => {
    fetchResumes();
    fetchPaymentInfo();
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

  const paymentOptions = [
    { id: '0', label: '무료', price: 0 }, // 무료 옵션
    ...paymentList.map((payment) => ({
      id: payment.id,
      label: payment.orderName,
      price: payment.price,
    })),
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      {/* 기존 면접 선택 UI */}
      <Fade in={true} timeout={1000}>
        <Paper elevation={3} className={styles.headerPaper}>
          <Typography variant="h3" component="h2" gutterBottom align="center" className={styles.mainTitle}>
            면접 유형 선택
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" className={styles.subtitle}>
            자신감 있는 면접을 위한 첫 걸음, 지금 시작하세요.
          </Typography>
        </Paper>
      </Fade>
      <Grid container spacing={6} justifyContent="center" className={styles.optionsContainer}>
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

      {/* 모달 */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableBackdropClick
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              border: '2px solid #2196f3',
            }}
          >
            <Typography variant="h6" gutterBottom>
              결제 옵션을 선택하세요
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">결제 옵션</FormLabel>
              <RadioGroup
                value={selectedPayment}
                onChange={handlePaymentChange}
              >
                {paymentOptions.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio color="primary" />}
                    label={`${option.label} (${option.price ? `${option.price}원` : '무료'})`}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              이력서를 선택하세요
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