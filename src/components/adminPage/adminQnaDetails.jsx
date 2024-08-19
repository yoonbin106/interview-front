import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/adminPage/adminQnaDetails.module.css';

const AdminQnaDetails = ({ qnaDetail, onSubmit }) => {
    const [response, setResponse] = useState(''); // 관리자가 작성할 답변
    const [file, setFile] = useState(null); // 첨부할 파일 상태
    const [category, setCategory] = useState(qnaDetail.category); // 카테고리 상태

    // 답변 입력 핸들러
    const handleResponseChange = (event) => {
        setResponse(event.target.value);
    };

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    // 답변 제출 핸들러
    const handleSubmit = () => {
        onSubmit(response, file, category);
        alert(`답변을 등록하였습니다. 카테고리가 '${category}'(으)로 변경되었습니다.`);
    };

    return (
        <div className={styles.qnaDetailsContainer}>
            <Paper elevation={3} className={styles.qnaDetailsPaper}>
                <Typography variant="h6" gutterBottom className={styles.qnaDetailsGrayText}>
                    [1:1 문의내역]
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {qnaDetail.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    작성자: {qnaDetail.author} | 날짜: {qnaDetail.date} | 카테고리: {category}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {qnaDetail.content}
                </Typography>
            </Paper>

            <Box mt={4}>
                <Paper elevation={3} className={styles.qnaDetailsPaper}>
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
                        onChange={handleResponseChange}
                    />
                    <Grid container spacing={2} alignItems="center" className={styles.qnaDetailsGrid}>
                        <Grid item>
                            <Button variant="contained" onChange={handleFileChange}
                            className={styles.qnaDetailsSubmitButton}>
                                파일 첨부
                                
                            </Button>
                        </Grid>
                        <Grid item>
                            {file && <Typography>{file.name}</Typography>}
                        </Grid>
                    </Grid>
                    <FormControl fullWidth variant="outlined" className={styles.qnaDetailsFormControl}>
                        <InputLabel id="category-label">카테고리 변경</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            onChange={handleCategoryChange}
                            label="카테고리 변경"
                        >
                            <MenuItem value="대기">대기</MenuItem>
                            <MenuItem value="진행중">진행중</MenuItem>
                            <MenuItem value="완료">완료</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
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