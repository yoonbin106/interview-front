import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/adminPage/adminQnaDetails.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminQnaDetails = ({ onSubmit }) => {
    const router = useRouter();
    const { qnaId } = router.query; // URL에서 qnaId를 가장 먼저 가져옴

    const [qnaDetail, setQnaDetail] = useState(null); // QnA 상세 정보를 저장할 상태
    const [response, setResponse] = useState(''); // 관리자가 작성할 답변을 위한 상태
    const [category, setCategory] = useState(''); // 문의 카테고리 상태
    const [qnaStatus, setQnaStatus] = useState('');// 상태 카테고리

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                // qnaId가 존재하는지 확인
                if (qnaId) {
                    const response = await axios.get(`http://localhost:8080/api/qna/details/${qnaId}`);
                    setQnaDetail(response.data);
                    setResponse(response.data.qnaAnswer || '');
                    setCategory(response.data.qnaCategory);
                    setQnaStatus(response.data.qnaStatus || '');
                }
            } catch (error) {
                console.error('Error fetching QnA details:', error);
            }
        };
        fetchQnaDetail(); // 컴포넌트가 마운트될 때 QnA 세부사항을 가져옴
    }, [qnaId]);

      // 상태를 한글로 변환하는 함수
      const getStatusText = (status) => {
        switch (status) {
            case 'N':
                return '대기';
            case 'T':
                return '진행중';
            case 'P':
                return '완료';
            default:
                return '알 수 없음';
        }
    };

    // 답변 입력 핸들러
    const handleResponseChange = (event) => {
        setResponse(event.target.value);
    };
    // 상태 카테고리 업데이트
    const handleStatusChange = (event) => {
        setQnaStatus(event.target.value); 
    }

    // 답변 제출 핸들러
    const handleSubmit = () => {
        const updateQna = {
            qnaAnswer: response,
            qnaStatus: qnaStatus,
        };

        axios.put(`http://localhost:8080/api/qna/answer/${qnaId}`, updateQna)
            .then(() => {
                alert(`답변을 등록하였습니다. 문의상태가 '${getStatusText(qnaStatus)}'(으)로 변경되었습니다.`);
                router.push('http://localhost:3000/adminPage/adminQnaPage');
            })
            .catch(error => {
                console.error('Error updating QnA:', error);
                alert('답변 등록 중 오류가 발생했습니다.');
            });
    };

    if (!qnaDetail) {
        return <div>Loading...</div>; // 데이터를 불러올 때까지 로딩 상태를 표시
    }

    return (
        <div className={styles.qnaDetailsContainer}>
            <Paper elevation={3} className={styles.qnaDetailsPaper}>
                <Typography variant="h6" gutterBottom className={styles.qnaDetailsGrayText}>
                    [1:1 문의내역]
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {qnaDetail.qnaTitle} {/* 문의 제목 */}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    작성자: {qnaDetail.user.username} | 이메일 : {qnaDetail.user.email} 
                    <br/>
                    날짜: {new Date(qnaDetail.qnaCreatedTime).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })} 
                    <br/>카테고리: {category}
                </Typography>
                <Typography variant="body1" gutterBottom>
                   <br/> {qnaDetail.qnaQuestion} {/* 문의 내용 */}
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
                        onChange={handleResponseChange} // 답변 입력 핸들러
                    />
                    <FormControl fullWidth variant="outlined" className={styles.qnaDetailsFormControl}>
                        <InputLabel id="status-label">문의상태 변경</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={qnaStatus}
                            onChange={handleStatusChange} // 상태 변경 핸들러
                            label="문의상태 변경"
                        >
                            <MenuItem value="N">대기</MenuItem>
                            <MenuItem value="T">진행중</MenuItem>
                            <MenuItem value="P">완료</MenuItem>
                        </Select>
                    </FormControl>

                    {/*환불 처리 카테고리일 때만 '환불하기' 버튼 표시 */}
                   
                    <div className={styles.qnaDetailsButtonContainer}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit} // 답변 제출 핸들러
                            className={styles.qnaDetailsSubmitButton}
                        >
                            답변 등록
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => router.push('http://localhost:3000/adminPage/adminQnaPage')}
                            className={styles.qnaDetailsBackButton}
                        >
                            목록
                        </Button>
                        </div>
                        <div>
                        {category === '환불 처리' && (
                        <Button
                            variant="contained"
                            onClick={() => router.push('http://localhost:3000/adminPage/adminPaymentPage')}
                                //환불 처리 로직 추가
                                className={styles.qnaDetailsRefundButton}>
                                환불 처리 페이지
                                </Button> 
                    )}
                    </div>
                </Paper>
            </Box>
        </div>
    );
};

export default AdminQnaDetails;
