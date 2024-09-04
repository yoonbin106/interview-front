import React, { useState } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import QuestionItem from '@/components/interview/questionItem';
import styles from '@/styles/interview/questionList.module.css';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';

const QuestionList = observer(({ activeTab }) => {
  const { interviewStore } = useStores();
  
  // Store에서 필요한 데이터를 불러옴
  const { commonQuestions, resumeQuestions } = interviewStore;

  // activeTab에 따라 사용할 질문 데이터를 선택
  const questions = {
    common: commonQuestions,
    resume: resumeQuestions
  };
  // 열려 있는 질문을 관리할 상태
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <Paper elevation={3} className={styles.questionsSection}>
      <Typography variant="h5" gutterBottom className={styles.sectionTitle}>
        {activeTab === 'common' ? '공통 면접 질문' : '이력서 기반 질문'}
      </Typography>
      <Box className={styles.questionsList}>
        {questions[activeTab]?.map((item) => (
          <QuestionItem 
            key={item.id} 
            item={item.questionText} 
            isOpen={openQuestion === item.id} 
            onClick={() => setOpenQuestion(openQuestion === item.id ? null : item.id)} // 질문을 클릭 시 열고 닫는 기능 추가
          />
        ))}
      </Box>
    </Paper>
  );
});

export default QuestionList;