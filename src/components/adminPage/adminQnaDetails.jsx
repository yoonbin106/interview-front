//adminQnaDetails.jsx

import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/adminPage/adminQnaDetails.module.css';

const AdminQnaDetails = ({ qnaDetail, onSubmit }) => {
    const [response, setResponse] = useState(''); // 관리자가 작성할 답변을 위한 상태
    const [file, setFile] = useState(null); // 첨부할 파일 상태
    const [category, setCategory] = useState(qnaDetail.category); // 문의 카테고리 상태

    // 답변 입력 핸들러
    const handleResponseChange = (event) => {
        setResponse(event.target.value);
    };

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // 선택한 파일을 상태에 저장
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (event) => {
        setCategory(event.target.value); // 선택한 카테고리로 상태 업데이트
    };

    // 답변 제출 핸들러
    const handleSubmit = () => {
        onSubmit(response, file, category); // onSubmit 함수 호출, 답변 및 파일, 카테고리 전달
        alert(`답변을 등록하였습니다. 카테고리가 '${category}'(으)로 변경되었습니다.`); // 답변 등록 후 알림 표시
    };

    return (
        <div className={styles.qnaDetailsContainer}>
            <Paper elevation={3} className={styles.qnaDetailsPaper}>
                {/* QnA 세부 사항 출력 */}
                <Typography variant="h6" gutterBottom className={styles.qnaDetailsGrayText}>
                    [1:1 문의내역]
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {qnaDetail.title} {/* 문의 제목 */}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    작성자: {qnaDetail.author} | 날짜: {qnaDetail.date} | 카테고리: {category}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {qnaDetail.content} {/* 문의 내용 */}
                </Typography>
            </Paper>

            <Box mt={4}>
                <Paper elevation={3} className={styles.qnaDetailsPaper}>
                    {/* 관리자 답변 입력 섹션 */}
                    <Typography variant="h6" gutterBottom>
                        관리자 답변
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="답변을 입력하세요"
                        multiline
                        rows={4}
                        value={response}
                        onChange={handleResponseChange} // 답변 입력 핸들러
                    />
                    <Grid container spacing={2} alignItems="center" className={styles.qnaDetailsGrid}>
                        {/* 파일 첨부 버튼 및 파일 이름 표시 */}
                        <Grid item>
                            <Button variant="contained" component="label" className={styles.qnaDetailsSubmitButton}>
                                파일 첨부
                                <input type="file" hidden onChange={handleFileChange} /> {/* 파일 선택 핸들러 */}
                            </Button>
                        </Grid>
                        <Grid item>
                            {file && <Typography>{file.name}</Typography>} {/* 선택된 파일 이름 표시 */}
                        </Grid>
                    </Grid>
                    {/* 카테고리 변경 섹션 */}
                    <FormControl fullWidth variant="outlined" className={styles.qnaDetailsFormControl}>
                        <InputLabel id="category-label">카테고리 변경</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            onChange={handleCategoryChange} // 카테고리 변경 핸들러
                            label="카테고리 변경"
                        >
                            <MenuItem value="대기">대기</MenuItem>
                            <MenuItem value="진행중">진행중</MenuItem>
                            <MenuItem value="완료">완료</MenuItem>
                        </Select>
                    </FormControl>
                    {/* 답변 등록 버튼 */}
                    <Button
                        variant="contained"
                        onClick={handleSubmit} // 답변 제출 핸들러
                        className={styles.qnaDetailsSubmitButton}
                    >
                        답변 등록
                    </Button>
                </Paper>
            </Box>
        </div>
    );
};

export default AdminQnaDetails;