import React, { useState } from 'react';
import {useRouter} from 'next/router';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/bbs/bbsQnaRegister.module.css';

const BbsQnaRegister = () => {
  const [category, setCategory] = useState('계정 및 로그인');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = () => {
    // 하드코딩된 데이터를 사용하여 제출 처리
    alert('문의가 등록되었습니다.');
    router.push('/bbs/bbsQnaListPage');
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
          <MenuItem value="결제 및 환불">결제 및 환불</MenuItem>
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

      <div className={styles.bbsQnaRegisterCharacterCount}>{content.length} / 1000자</div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={styles.bbsQnaRegisterSubmitButton}
      >
        문의 등록
      </Button>

      <div className={styles.bbsQnaRegisterInfoText}>
        - 고객님의 문의는 1:1 문의를 통해 신속하고 정확하게 답변드리겠습니다.<br />
        - 아이디/비밀번호 관련 문의는 개인정보 보호를 위해 일부 안내에 제한이 있을 수 있습니다. 먼저 사이트 내에서 아이디 및 비밀번호 찾기를 시도해 보세요.<br/>
        - 결제 관련 문의 시에는 결제 내역, 이용권 이름, 결제 일자, 결제자명 등의 정보를 제공해 주시면 보다 정확한 답변을 드릴 수 있습니다.<br/>
        - 기타 사항 문의하실 때는 서비스와 관련된 구체적인 상황과 함께 문의 내용을 상세히 적어 주시면 더 신속하고 정확한 지원이 가능합니다."<br/>
        - 자주 묻는 질문(FAQ)을 통해 궁금하신 내용을 빠르게 확인하실 수 있습니다.<br />
        <br/>
        - 접수된 문의는 운영시간 내에 확인 후 답변드리며, 주말 및 공휴일에는 답변이 지연될 수 있습니다.<br />
        - 최대한 빠른 답변을 드리기 위해 노력하겠으며, 문의가 밀릴 경우 답변 시간이 다소 늦어질 수 있음을 양해 부탁드립니다.
      </div>
    </div>
  );
};

export default BbsQnaRegister;