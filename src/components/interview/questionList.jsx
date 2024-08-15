import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Paper, Box } from '@mui/material';
import QuestionItem from '@/components/interview/questionItem';
import styles from '@/styles/interview/QuestionList.module.css';

const QuestionList = ({ activeTab }) => {
  const { questions, openQuestion } = useSelector(state => state.questions);

  return (
    <Paper elevation={3} className={styles.questionsSection}>
      <Typography variant="h5" gutterBottom className={styles.sectionTitle}>
        {activeTab === 'common' ? '공통 면접 질문' : '이력서 기반 질문'}
      </Typography>
      <Box className={styles.questionsList}>
        {questions[activeTab].map((item) => (
          <QuestionItem key={item.id} item={item} isOpen={openQuestion === item.id} />
        ))}
      </Box>
    </Paper>
  );
};

export default QuestionList;