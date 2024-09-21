import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Box, Typography, Collapse, TextField, Button, TablePagination, Grid } from '@mui/material';
import axios from 'axios';
import styles from '@/styles/bbs/bbsQnaList.module.css';

const BbsQnaList = () => {
  const [qnaData, setQnaData] = useState([]); // QnA 데이터를 저장하는 상태
  const [filteredQnaData, setFilteredQnaData] = useState([]); // 검색된 QnA 데이터를 저장하는 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 에러 상태를 저장하는 상태
  const [openRowIndexes, setOpenRowIndexes] = useState([]); // 여러 행을 동시에 열기 위한 상태
  const [inputPasswords, setInputPasswords] = useState({}); // 비밀번호 입력 상태 저장
  const [verifiedIndexes, setVerifiedIndexes] = useState([]); // 비밀번호 검증된 문의글을 저장
  const [searchTerm, setSearchTerm] = useState(''); // 검색어를 저장하는 상태
  const [page, setPage] = useState(0); // 현재 페이지 번호를 저장하는 상태
  const [rowsPerPage, setRowsPerPage] = useState(5); // 한 페이지에 표시할 행 수 상태

  // Qna 상태를 텍스트로 변환하는 함수 추가
  const getStatusText = (status) => {
    switch (status) {
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

  //시간 표시 format
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  //이메일 포맷을 처리하는 함수(앞 4글자만 보이고, 나머지는 *로 대체)
  const formatEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart.length > 4 ? localPart.slice(0, 4) + '*'.repeat(localPart.length - 4) : localPart;
    return `${maskedLocalPart}@${domain}`;
  };

  useEffect(() => {
    const fetchQnaData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/qna');
        const sortedData = response.data.sort((a, b) => new Date(b.qnaCreatedTime) - new Date(a.qnaCreatedTime));
        setQnaData(sortedData);
        setFilteredQnaData(sortedData); // 처음에는 전체 데이터를 필터링 데이터로 설정
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
        return prevOpenIndexes.filter((i) => i !== index); // 이미 열려있는 행이면 닫기
      } else {
        return [...prevOpenIndexes, index]; // 열려있지 않은 행이면 열기
      }
    });
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e, index) => {
    setInputPasswords({ ...inputPasswords, [index]: e.target.value });
  };

  // 비밀번호 확인 핸들러
  const handleVerifyPassword = async (index, qnaId) => {
    const password = inputPasswords[index];
    try {
      const response = await axios.get(`http://localhost:8080/api/qna/${qnaId}`, {
        params: { password: password },
      });
      if (response.status === 200) {
        setVerifiedIndexes((prev) => [...prev, index]); // 비밀번호가 맞으면 해당 문의글을 검증된 리스트에 추가
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 확인 중 오류 발생:', error);
      alert('비밀번호 확인에 실패했습니다.');
    }
  };

  // 검색 버튼을 눌렀을 때만 검색 실행
  const handleSearch = () => {
    const filtered = qnaData.filter((item) =>
      item.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQnaData(filtered);
    setPage(0); // 검색 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 한 페이지에 표시할 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 페이지 번호 초기화
  };

  if (error) {
    return <p>{error}</p>; // 오류가 발생했을 때 표시될 UI
  }

  return (
    <div className={styles.bbsQnaListContainer}>
      <Typography variant="h3" gutterBottom align="left" style={{ fontWeight: 'bold' }}>
        1:1 문의내역
      </Typography>

      {filteredQnaData.length === 0 ? (
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
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>작성자</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>이메일</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>문의등록날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQnaData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <React.Fragment key={row.qnaId}>
                    <TableRow hover onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                      <TableCell align="center">{row.qnaId}</TableCell> {/* 글 번호 표시 */}
                      <TableCell align="center">[{row.qnaCategory}]</TableCell> {/* 카테고리 표시 */}
                      <TableCell align="center">{row.user.username}</TableCell>
                      <TableCell align="center">{formatEmail(row.user.email)}</TableCell> {/* 작성 날짜 표시 */}
                      <TableCell align="center">{formatDateTime(row.qnaCreatedTime)}</TableCell> {/* 등록 날짜 표시 */}
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                        <Collapse in={openRowIndexes.includes(index)} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            {/* 비밀번호가 맞으면 내용 보여주기 */}
                            {verifiedIndexes.includes(index) ? (
                              <>
                                <Typography variant="body1">
                                  <strong>문의 카테고리:　</strong>{row.qnaCategory}
                                </Typography>
                                <Typography variant="body1">
                                  <strong>문의 제목:　</strong>{row.qnaTitle}
                                </Typography>
                                <br />
                                <Typography variant="body1">
                                  <strong>문의내역:　</strong>
                                  {row.qnaQuestion}
                                </Typography>
                                <br />
                                <Box
                                  marginTop={2}
                                  padding={2}
                                  style={{ backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}
                                >
                                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                    관리자 확인 상태:
                                  </Typography>
                                  <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                    {getStatusText(row.qnaStatus)}
                                  </Typography>
                                  <br />
                                  <Typography variant="body1" style={{ fontWeight: 'bold', marginTop: '16px' }}>
                                    답변:
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    style={{ marginLeft: '8px', color: row.qnaAnswer ? 'black' : 'gray' }}
                                  >
                                    {row.qnaAnswer ? row.qnaAnswer : '최대한 빠른 시일 내에 답변 드리겠습니다.'}
                                  </Typography>
                                </Box>
                              </>
                            ) : (
                              <Box margin={1}>
                                <TextField
                                  variant="outlined"
                                  label="비밀번호를 입력해주세요."
                                  type="password"
                                  fullWidth
                                  value={inputPasswords[index] || ''}
                                  onChange={(e) => handlePasswordChange(e, index)}
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleVerifyPassword(index, row.qnaId)}
                                  className={styles.bbsQnaRegisterSubmitButton}
                                >
                                  비밀번호 입력
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>

          {/* 페이지네이션 추가 */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredQnaData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* 검색란을 테이블 아래로 이동 */}
      <Grid container spacing={1} alignItems="center" justifyContent="center" className={styles.bbsQnaGridContainer}>
        <Grid item className={styles.bbsQnaGridItemInput}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="이름으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  // 검색어만 업데이트
          />
        </Grid>
        <Grid item className={styles.bbsQnaGridItemButton}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSearch()}  // 검색 버튼 클릭 시 검색 로직 실행
            className={styles.bbsQnaSearchButton}
          >
            검색
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BbsQnaList;
