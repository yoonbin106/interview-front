import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/bbs/bbsQnaRegister.module.css';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';

const BbsQnaRegister = observer(() => {
  const { userStore } = useStores();
  const [category, setCategory] = useState('계정 및 로그인');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 입력 필드 추가

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async() => {
    if (!title || !content || !password) {
      alert('제목, 내용, 비밀번호를 모두 입력해주세요.');
      return;
    }

    const qnaData = {
      category: category, // 선택된 카테고리
      qnaTitle: title,
      qnaQuestion: content,
      qnaPassword: password, // 비밀번호 필드 추가
      email: userStore.email // 이메일 추가
    };

    try {
      await axios.post('http://localhost:8080/api/qna', qnaData);
      alert('문의가 성공적으로 등록되었습니다.');
      window.location.href = 'http://localhost:3000/bbs/bbsQnaListPage';
    } catch (error) {
      console.error('문의 등록 중 오류 발생:', error);
      alert('문의 등록에 실패했습니다.');
    }
  };
  
  return (
    <div className={styles.bbsQnaRegisterFormContainer}>
      <FormControl variant="outlined" fullWidth className={styles.bbsQnaRegisterFormControl}>
        <InputLabel id="category-label">문의 카테고리</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          onChange={handleCategoryChange}
          label="카테고리"
        >
          <MenuItem value="계정 및 로그인">계정 및 로그인</MenuItem>
          <MenuItem value="AI 면접 준비">AI 면접 준비</MenuItem>
          <MenuItem value="기술 문제 해결">기술 문제 해결</MenuItem>
          <MenuItem value="결제 관련">결제 관련</MenuItem>
          <MenuItem value="환불 처리">환불 처리</MenuItem>
          <MenuItem value="기타">기타</MenuItem>
        </Select>
      </FormControl>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="문의 제목을 입력해주세요."
        value={title}
        onChange={handleTitleChange}
        className={styles.bbsQnaRegisterTextField}
      />

      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={10}
        placeholder="문의사항을 입력해주세요."
        value={content}
        onChange={handleContentChange}
        className={styles.bbsQnaRegisterTextField}
      />

      <TextField
        variant="outlined"
        fullWidth
        placeholder="비밀번호를 입력해주세요." // 비밀번호 입력 필드 추가
        type="password"
        value={password}
        onChange={handlePasswordChange}
        className={styles.bbsQnaRegisterTextField}
      />

      <div className={styles.bbsQnaRegisterCharacterCount}>{content.length} / 1000자</div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={styles.bbsQnaRegisterSubmitButton}
      >
        문의 등록
      </Button>
    </div>
  );
});

export default BbsQnaRegister;
