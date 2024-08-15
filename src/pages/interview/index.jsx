import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setInterviewType } from '@/redux/slices/interviewSlice';
import { 
  Typography, 
  Container,
  Grid,
  Paper,
  Fade
} from '@mui/material';
import InterviewOption from '@/components/interview/interviewOption';
import styles from '@/styles/interview/InterviewSelectPage.module.css';

const InterviewSelectPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const realInterviewFeatures = [
    '실제 면접과 유사한 환경에서의 면접 연습',
    '다양한 면접 유형에 대한 연습 기회 제공',
    '맞춤형 질문으로 실전 감각 향상'
  ];

  const mockInterviewFeatures = [
    '다양한 일반 면접 질문으로 기본기 다지기',
    '스크립트와 키워드 제공으로 답변 구조화',
    'AI 분석을 통한 상세한 피드백 제공'
  ];

  const handleInterviewStart = (type) => {
    dispatch(setInterviewType(type));
    router.push({
      pathname: '/interview/interviewPreparation',
      query: { interviewType: type },
    });
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
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
            onStart={() => handleInterviewStart('real')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InterviewOption
            title="모의 면접"
            imageSrc="/images/Mock-Interview.png"
            features={mockInterviewFeatures}
            buttonText="모의 면접 시작하기"
            onStart={() => handleInterviewStart('mock')}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default InterviewSelectPage;