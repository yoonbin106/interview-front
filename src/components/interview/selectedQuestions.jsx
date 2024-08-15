import React, { useState } from 'react';
import { Paper, Typography, Button, List, ListItem, ListItemText, Box, IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';
import styles from '@/styles/interview/selectedQuestions.module.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SelectedQuestions = ({ selectedQuestions, questions, onCancel, onSelectQuestion, onRemoveQuestion, maxSelections }) => {
  const [showWarning, setShowWarning] = useState(false);

  const getSelectedQuestionDetails = () => {
    return selectedQuestions.map(id => {
      const allQuestions = [...questions.common, ...questions.resume];
      return allQuestions.find(q => q.id === id);
    }).filter(q => q !== undefined);
  };

  const selectedQuestionDetails = getSelectedQuestionDetails();

  const handleSelectQuestion = () => {
    if (selectedQuestionDetails.length === maxSelections) {
      onSelectQuestion();
    } else {
      setShowWarning(true);
    }
  };

  return (
    <Paper elevation={3} className={styles.selectedQuestions}>
      <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
        선택된 질문 ({selectedQuestionDetails.length}/{maxSelections})
      </Typography>
      <List className={styles.questionList}>
        {selectedQuestionDetails.map((question, index) => (
          <ListItem key={question.id} className={styles.questionItem}>
            <ListItemText 
              primary={`${index + 1}. ${question.question}`} 
              primaryTypographyProps={{ className: styles.questionText }}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoveQuestion(question.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box className={styles.buttonContainer}>
        <Button variant="outlined" onClick={onCancel} className={styles.cancelButton}>
          취소
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSelectQuestion}
          disabled={selectedQuestionDetails.length < maxSelections}
          className={styles.selectButton}
        >
          {selectedQuestionDetails.length === maxSelections ? "선택 완료" : "질문 선택중..."}
        </Button>
      </Box>
      <Snackbar open={showWarning} autoHideDuration={6000} onClose={() => setShowWarning(false)}>
        <Alert onClose={() => setShowWarning(false)} severity="warning" sx={{ width: '100%', fontSize: '1.1rem' }}>
          {maxSelections}개의 질문만 선택해주세요.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SelectedQuestions;