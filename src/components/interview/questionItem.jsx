import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Typography, TextField, Chip, Button } from '@mui/material';
import { Add, Remove, ExpandMore, Edit } from '@mui/icons-material';
import {
  toggleSelectedQuestion,
  setOpenQuestion,
  setEditMode,
  setTempEdit,
  saveQuestion,
  deleteKeyword,
} from '@/redux/slices/questionSlice';
import styles from '@/styles/interview/questionItem.module.css';

const QuestionItem = ({ item, isOpen }) => {
  const dispatch = useDispatch();
  const { selectedQuestions, editMode, tempEdit } = useSelector(state => state.questions);
  
  // 스크립트 또는 키워드 수정 모드로 전환하는 함수
  const handleEdit = (type) => {
    dispatch(setTempEdit({ 
      script: item.script, 
      keywords: [...item.keywords] 
    }));
    dispatch(setEditMode({ id: item.id, type }));
  };

  // 수정 사항 저장
  const handleSave = () => {
    dispatch(saveQuestion({ id: item.id, ...tempEdit }));
    dispatch(setEditMode({ id: null, type: null }));
  };

  // 수정 취소
  const handleCancel = () => {
    dispatch(setEditMode({ id: null, type: null }));
    dispatch(setTempEdit({ script: '', keywords: [] }));
  };
  // 키워드 삭제
  const handleKeywordDelete = (keyword) => {
    const updatedKeywords = tempEdit.keywords.filter(k => k !== keyword);
    dispatch(setTempEdit({ ...tempEdit, keywords: updatedKeywords }));
  };
  // 키워드 변경
  const handleKeywordChange = (index, newKeyword) => {
    const updatedKeywords = [...tempEdit.keywords];
    updatedKeywords[index] = newKeyword;
    dispatch(setTempEdit({ ...tempEdit, keywords: updatedKeywords }));
  };
  // 키워드 추가
  const handleKeywordAdd = () => {
    dispatch(setTempEdit({ ...tempEdit, keywords: [...tempEdit.keywords, ''] }));
  };

  return (
    <motion.div 
      className={styles.questionItem}
      initial={{ backgroundColor: "#f8f9fa" }}
      animate={{ backgroundColor: isOpen ? "#e9ecef" : "#f8f9fa" }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={styles.questionText}
        onClick={() => dispatch(setOpenQuestion(isOpen ? null : item.id))}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleSelectedQuestion(item.id));
          }}
        >
          {selectedQuestions.includes(item.id) ? <Remove /> : <Add />}
        </IconButton>
        <Typography>{item.question}</Typography>
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
                    onChange={(e) => dispatch(setTempEdit({ ...tempEdit, script: e.target.value }))}
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
                <Edit fontSize="small" /> {/* 아이콘 크기 축소 */}
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
                        size="small" // 입력 필드 크기 축소
                      />
                      <IconButton size="small" onClick={() => handleKeywordDelete(keyword)}>
                        <Remove fontSize="small" /> {/* 아이콘 크기 축소 */}
                      </IconButton>
                    </div>
                  ))}
                  <IconButton size="small" onClick={handleKeywordAdd}>
                    <Add fontSize="small" /> {/* 아이콘 크기 축소 */}
                  </IconButton>
                  <div className={styles.editButtons}>
                    <Button onClick={handleSave} color="primary" size="small">저장</Button>
                    <Button onClick={handleCancel} color="secondary" size="small">취소</Button>
                  </div>
                </>
              ) : (
                item.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    className={styles.keyword}
                    size="small" // 칩 크기 축소
                  />
                ))
              )}
            </div>
          </div>
    </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionItem;
