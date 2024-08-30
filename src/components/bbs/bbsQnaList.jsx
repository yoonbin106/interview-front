import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Box, Typography, Collapse } from '@mui/material';
import axios from 'axios';
import styles from '@/styles/bbs/bbsQnaList.module.css';

const BbsQnaList = () => {
  const [qnaData, setQnaData] = useState([]); // QnA 데이터를 저장하는 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 에러 상태를 저장하는 상태
  const [openRowIndexes, setOpenRowIndexes] = useState([]); // 여러 행을 동시에 열기 위한 상태

  // Qna 상태를 텍스트로 변환하는 함수 추가
  const getStatusText = (status) => {
    switch(status) {
      case 'N':
        return '문의 확인 전';
      case 'T':
        return '문의 확인 중';
      case 'P':
        return '문의 확인 완료';
      default:
        return '알 수 없음';
    }
  };

  useEffect(() => {
    const fetchQnaData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/qna');
        const sortedData = response.data.sort((a,b) => new Date(b.qnaCreatedTime) - new Date(a.qnaCreatedTime));
        setQnaData(sortedData);
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQnaData();
  }, []);

  // 아코디언 행 토글 핸들러
  const toggleRow = (index) => {
    setOpenRowIndexes((prevOpenIndexes) => {
      if (prevOpenIndexes.includes(index)) {
        // 이미 열려있는 행이면 닫기
        return prevOpenIndexes.filter((i) => i !== index);
      } else {
        // 열려있지 않은 행이면 열기
        return [...prevOpenIndexes, index];
      }
    });
  };

  if (error) {
    return <p>{error}</p>; // 오류가 발생했을 때 표시될 UI
  }

  return (
    <div className={styles.bbsQnaListContainer}>
      <Typography variant="h3" gutterBottom align="left" style={{fontWeight:'bold'}} >
        1:1 문의내역
      </Typography>
      {qnaData.length === 0 ? (
        <div className={styles.bbsQnaListEmptyStateContainer}>
          <img
            src='../../images/no_inquiries.png' // 일러스트 이미지 경로
            alt="문의 내역 없음"
            className={styles.bbsQnaListIllustration}
          />
          <p className={styles.bbsQnaListEmptyText}>문의하신 내역이 없습니다.</p>
        </div>
      ) : (

        <TableContainer component={Paper} className={styles.bbsQnaListTableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>글 번호</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>카테고리</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>제목</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>작성날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qnaData.map((row,index) => (
                <React.Fragment key={row.qnaId}>
                <TableRow hover onClick={() => toggleRow(index)} style={{ cursor: 'pointer'}}>
                  <TableCell align="center">{row.qnaId}</TableCell> {/* 글 번호 표시 */}
                  <TableCell align="center">[{row.qnaCategory}]</TableCell> {/* 카테고리 표시 */}
                  <TableCell align="center">{row.qnaTitle}</TableCell>
                  <TableCell align="center">{row.qnaCreatedTime}</TableCell> {/* 작성 날짜 표시 */}
                  </TableRow>
                  <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      {/* Collapse 컴포넌트로 내용 표시 */}
                      <Collapse in={openRowIndexes.includes(index)} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="body1">
                            <strong>문의 카테고리:　</strong>{row.qnaCategory}
                          </Typography> {/* 내용 표시 */}
                          <Typography variant="body1">
                            <strong>작성날짜:　</strong>{row.qnaCreatedTime}
                          </Typography>
                          <br/>
                          <Typography variant="body1">
                            <strong>문의내역:　</strong>
                            {row.qnaQuestion}
                          </Typography>
                          <br/>
                          <Box marginTop={2} padding={2} style={{ backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                              관리자 확인 상태:
                            </Typography>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                              {getStatusText(row.qnaStatus)}
                            </Typography>
                            <br/>
                            <Typography variant="body1" style={{ fontWeight: 'bold', marginTop: '16px' }}>
                              답변:
                            </Typography>
                            <Typography variant="body1" 
                            style={{ marginLeft: '8px',color: row.qnaAnswer ? 'black' : 'gray', }}>
                              {row.qnaAnswer ? row.qnaAnswer : '최대한 빠른 시일 내에 답변 드리겠습니다.'}
                            </Typography>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default BbsQnaList;
