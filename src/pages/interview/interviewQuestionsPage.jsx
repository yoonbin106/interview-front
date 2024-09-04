import React from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Fade,
} from '@mui/material';
import TabButtons from '@/components/interview/tabButton';
import QuestionList from '@/components/interview/questionList';
import SelectedQuestions from '@/components/interview/selectedQuestions';
import styles from '@/styles/interview/interviewQuestionsPage.module.css';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';

const InterviewQuestionsPage = observer(() => {
  const { interviewStore } = useStores();
  const router = useRouter();
  const activeTab = interviewStore.activeTab;

  // 인터뷰 스토어에서 선택된 질문과 질문 데이터를 가져옴
  const selectedQuestions = interviewStore.selectedQuestions;
  const questions = {
    common: interviewStore.commonQuestions,
    resume: interviewStore.resumeQuestions,
  };

  const handleTabChange = (tab) => {
    interviewStore.setActiveTab(tab);
  };

  const handleSelectQuestion = () => {
    router.push({
      pathname: '/interview/interviewRecordPage',
      query: { 
        interviewType: 'mock', 
        selectedQuestions: JSON.stringify(selectedQuestions)
      }
    });
  };

  const handleCancel = () => {
    interviewStore.clearSelectedQuestions();
    router.back(); // 뒤로 이동
  };

  const handleRemoveQuestion = (id) => {
    interviewStore.toggleSelectedQuestion(id);
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
});

export default InterviewQuestionsPage;