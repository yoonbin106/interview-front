//bbsQnaDetailsPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/bbs/bbsQnaDetails.module.css';
import sidebar from '@/styles/bbs/bbsPage.module.css';
import NestedList from '@/components/bbs/bbsSidebar';
const BbsQnaDetails = () => {
    const router = useRouter();

    // 하드코딩된 문의사항 상세 정보
    const qnaDetail = {
        id: 12,
        title: '결제하려는데 계속 오류가 떠요 ㅠㅠ 어떻게 해야 되나요?',
        author: 'user123',
        date: '2024-08-12',
        content: '결제하려고 여러 번 시도했는데 계속 오류 메시지가 떠요. 이 문제를 어떻게 해결할 수 있을까요? 결제가 필요한데 너무 불편합니다.',
        category: '대기', // 초기 카테고리 상태
    };

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
        alert(`답변을 등록하였습니다. 카테고리가 '${category}'(으)로 변경되었습니다.`);
    };

    // 목록 버튼 클릭 핸들러
    const handleBackToList = () => {
        router.push('/adminPage/adminQnaPage');
    };

    return (
        <div className={sidebar.container}>
        <div className={sidebar.sidebar}>
            <NestedList/>
        </div>
        <div className={sidebar.content}>
        <div className={styles.qnaDetailsContainer}>
            <Paper elevation={3} className={styles.qnaDetailsPaper}>
                <Typography variant="h6" gutterBottom className={styles.qnaDetailsGrayText}>
                    [1:1 문의내역]
                </Typography>
                <Typography variant ="h5" gutterBottom>
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
                            <Button variant="contained" component="label">
                                파일 첨부
                                <input type="file" hidden onChange={handleFileChange} />
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
                        color="primary"
                        onClick={handleSubmit}
                        className={styles.qnaDetailsSubmitButton}
                    >
                        답변 등록
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleBackToList}
                        className={styles.qnaDetailsBackButton}
                    >
                        목록
                    </Button>
                </Paper>
            </Box>
        </div>
        </div>
        </div>
    );
};

export default BbsQnaDetails;