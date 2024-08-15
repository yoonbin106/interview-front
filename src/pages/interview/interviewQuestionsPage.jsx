import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Fade,
} from '@mui/material';
import { setActiveTab, toggleSelectedQuestion, clearSelectedQuestions } from '../../redux/slices/questionSlice';
import TabButtons from '@/components/interview/tabButton';
import QuestionList from '@/components/interview/questionList';
import SelectedQuestions from '@/components/interview/selectedQuestions';
import styles from '@/styles/interview/InterviewQuestionsPage.module.css';

const InterviewQuestionsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { activeTab, selectedQuestions, questions } = useSelector(state => state.questions);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleSelectQuestion = () => {
    router.push('/interview/interviewRecordPage', { 
      state: { 
        interviewType: 'mock', 
        selectedQuestions 
      } 
    });
  };

  const handleCancel = () => {
    dispatch(clearSelectedQuestions());
    navigate(-1);
  };

  const handleRemoveQuestion = (id) => {
    dispatch(toggleSelectedQuestion(id));
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Fade in={true} timeout={1000}>
        <Box>
          <Typography variant="h4" gutterBottom className={styles.mainTitle}>
            면접 질문 리스트
          </Typography>
          <Typography variant="subtitle1" gutterBottom className={styles.subtitle}>
            면접에서 자주 나오는 질문들을 준비해보세요.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <TabButtons activeTab={activeTab} handleTabChange={handleTabChange} />
            </Grid>
            <Grid item xs={12} md={5.5}>
              <QuestionList activeTab={activeTab} />
            </Grid>
            <Grid item xs={12} md={4.5}>
              <SelectedQuestions 
                selectedQuestions={selectedQuestions}
                questions={questions}
                onCancel={handleCancel}
                onSelectQuestion={handleSelectQuestion}
                onRemoveQuestion={handleRemoveQuestion}
                maxSelections={3}
              />
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default InterviewQuestionsPage;