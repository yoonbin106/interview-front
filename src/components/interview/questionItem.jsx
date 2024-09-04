import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Typography, TextField, Chip, Button } from '@mui/material';
import { Add, Remove, ExpandMore, Edit } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';
import styles from '@/styles/interview/questionItem.module.css';

const QuestionItem = observer(({ item, isOpen }) => {
  const { interviewStore } = useStores();

  // selectedQuestions가 undefined일 때 기본값으로 빈 배열 설정
  const selectedQuestions = interviewStore.selectedQuestions || [];
  const editMode = interviewStore.editMode;
  const tempEdit = interviewStore.tempEdit;

  // 스크립트 또는 키워드 수정 모드로 전환하는 함수
  const handleEdit = (type) => {
    interviewStore.setTempEdit({
      script: item.script,
      keywords: [...item.keywords],
    });
    interviewStore.setEditMode({ id: item.id, type });
  };

  // 수정 사항 저장
  const handleSave = () => {
    interviewStore.saveQuestion({ id: item.id, ...tempEdit });
    interviewStore.setEditMode({ id: null, type: null });
  };

  // 수정 취소
  const handleCancel = () => {
    interviewStore.setEditMode({ id: null, type: null });
    interviewStore.setTempEdit({ script: '', keywords: [] });
  };

  // 키워드 삭제
  const handleKeywordDelete = (keyword) => {
    const updatedKeywords = tempEdit.keywords.filter((k) => k !== keyword);
    interviewStore.setTempEdit({ ...tempEdit, keywords: updatedKeywords });
  };

  // 키워드 변경
  const handleKeywordChange = (index, newKeyword) => {
    const updatedKeywords = [...tempEdit.keywords];
    updatedKeywords[index] = newKeyword;
    interviewStore.setTempEdit({ ...tempEdit, keywords: updatedKeywords });
  };

  // 키워드 추가
  const handleKeywordAdd = () => {
    interviewStore.setTempEdit({ ...tempEdit, keywords: [...tempEdit.keywords, ''] });
  };

  return (
    <motion.div
      className={styles.questionItem}
      initial={{ backgroundColor: '#f8f9fa' }}
      animate={{ backgroundColor: isOpen ? '#e9ecef' : '#f8f9fa' }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={styles.questionText}
        onClick={() => interviewStore.setOpenQuestion(isOpen ? null : item.id)}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            interviewStore.toggleSelectedQuestion(item.id);
          }}
        >
          {selectedQuestions.includes(item.id) ? <Remove /> : <Add />}
        </IconButton>
        <Typography>{item.questionText}</Typography>
        <ExpandMore className={`${styles.chevronIcon} ${isOpen ? styles.rotate : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.questionDetails}
          >
            {/* Script section */}
            <div className={styles.scriptSection}>
              <div className={styles.sectionHeader}>
                <Typography variant="h6">스크립트: </Typography>
                <IconButton size="small" onClick={() => handleEdit('script')}>
                  <Edit />
                </IconButton>
              </div>
              {editMode.id === item.id && editMode.type === 'script' ? (
                <>
                  <TextField
                    multiline
                    fullWidth
                    rows={4}
                    value={tempEdit.script}
                    onChange={(e) => interviewStore.setTempEdit({ ...tempEdit, script: e.target.value })}
                    className={styles.editTextarea}
                  />
                  <div className={styles.editButtons}>
                    <Button onClick={handleSave} color="primary">
                      저장
                    </Button>
                    <Button onClick={handleCancel} color="secondary">
                      취소
                    </Button>
                  </div>
                </>
              ) : (
                <Typography>{item.script}</Typography>
              )}
            </div>
            {/* Keywords section */}
            <div className={styles.keywordsSection}>
              <div className={styles.sectionHeader}>
                <Typography variant="subtitle2">핵심 키워드: </Typography>
                <IconButton size="small" onClick={() => handleEdit('keywords')}>
                  <Edit fontSize="small" />
                </IconButton>
              </div>
              <div className={styles.keywordsList}>
                {editMode.id === item.id && editMode.type === 'keywords' ? (
                  <>
                    {tempEdit.keywords.map((keyword, index) => (
                      <div key={index} className={styles.keywordEdit}>
                        <TextField
                          value={keyword}
                          onChange={(e) => handleKeywordChange(index, e.target.value)}
                          className={styles.keywordInput}
                          size="small"
                        />
                        <IconButton size="small" onClick={() => handleKeywordDelete(keyword)}>
                          <Remove fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                    <IconButton size="small" onClick={handleKeywordAdd}>
                      <Add fontSize="small" />
                    </IconButton>
                    <div className={styles.editButtons}>
                      <Button onClick={handleSave} color="primary" size="small">
                        저장
                      </Button>
                      <Button onClick={handleCancel} color="secondary" size="small">
                        취소
                      </Button>
                    </div>
                  </>
                ) : (
                  item.keywords.map((keyword, index) => (
                    <Chip key={index} label={keyword} className={styles.keyword} size="small" />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default QuestionItem;