import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead } from '@mui/material';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminQna.module.css';
import axios from 'axios';
import {useRouter} from 'next/router';

// PaginationTableQna 컴포넌트: QnA 테이블을 렌더링하는 컴포넌트
const PaginationTableQna = ({ rows, page, rowsPerPage, getStatusText }) => {
  const router = useRouter();
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  //행을 클릭했을 때 실행되는 함수
  const handleRowClick = (qnaId) => {
    router.push(`/adminPage/adminQnaDetailsPage/${qnaId}`)
  }

  return (
    <TableContainer component={Paper} className={styles.adminQnaTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>상태</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>카테고리</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>제목</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.qnaId}
            hover
            onClick={() => handleRowClick(row.qnaId)}
            style={{cursor:'pointer'}}>
              <TableCell align="center">{row.qnaId}</TableCell>
              <TableCell align="center">{getStatusText(row.qnaStatus)}</TableCell>
              <TableCell align="center">{`[${row.qnaCategory}]`}</TableCell>
              <TableCell align="center" className={styles.adminQnaTitleCell}>
                  {row.qnaTitle}
              </TableCell>
              <TableCell align="center">{row.user.username}</TableCell> {/* 작성자 이름 표시 */}
              <TableCell align="center">
                {new Date(row.qnaCreatedTime).toLocaleString('ko-KR',{
                    year: 'numeric',
                    month:'2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 30 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// QnA 상태를 텍스트로 변환하는 함수
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

// AdminQna 컴포넌트: 전체 QnA 관리 페이지 컴포넌트
const AdminQna = () => {
  const [qnaData, setQnaData] = useState([]); // 실제 데이터베이스에서 가져온 QnA 데이터
  const [searchCategory, setSearchCategory] = useState(''); // 검색 기준 카테고리 상태
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [filteredQna, setFilteredQna] = useState([]); // 필터링된 QnA 상태
  const [statusFilter, setStatusFilter] = useState(''); // 상태 필터 (대기, 진행중, 완료) 상태
  const [categoryFilter, setCategoryFilter] = useState(''); // 카테고리 필터
  const [page, setPage] = useState(0); // 현재 페이지 상태
  const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 표시할 행 수 상태

  useEffect(() => {
    const fetchQnaData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/qna');
        
        //데이터를 최신 날짜 기준으로 정렬
        const sortedData = response.data.sort((a,b) => new Date(b.qnaCreatedTime) - new Date(a.qnaCreatedTime));
        setQnaData(response.data); // 가져온 데이터를 상태에 저장
        setFilteredQna(response.data); // 필터링된 QnA 상태에 전체 데이터 저장
      } catch (error) {
        console.error('Error fetching QnA data:', error);
      }
    };

    fetchQnaData(); // 컴포넌트가 마운트될 때 QnA 데이터를 가져옴
  }, []); 

  // 상태 필터 변경 핸들러
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setSearchCategory('');
    setSearchTerm(''); // 상태 변경 시 다른 검색 조건 초기화
  };

  // 카테고리 필터 변경 핸들러
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  // 검색 기준 필터 변경 핸들러
  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = qnaData.filter((item) => {
      const matchesStatus = statusFilter ? item.qnaStatus === statusFilter : true; // 상태 필터링
      const matchesCategory = categoryFilter ? item.qnaCategory === categoryFilter : true;
      const matchesSearch = searchCategory === 'title'
        ? item.qnaTitle.toLowerCase().includes(lowercasedFilter)
        : true; // 검색어 필터링

      return matchesStatus && matchesCategory && matchesSearch;
    });
    setFilteredQna(filteredData);
    setPage(0); // 검색 시 첫 페이지로 이동
  };

  // 페이지네이션 핸들러
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // 한 페이지에 표시할 행 수 변경 핸들러
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 페이지를 첫 페이지로 초기화
  };

  const totalPages = Math.ceil(filteredQna.length / rowsPerPage); // 전체 페이지 수 계산

  return (
    <div className={styles.adminQnaContainer}>
      <div className={styles.adminQnaSidebar}>
        <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
      </div>
      <div className={styles.adminQnaContent}>
        <div className={styles.adminQnaMainContainer}>
          <div>
            {/* 페이지 상단: 제목 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.adminQnaTitle}>고객센터 문의사항</h2>
            </div>
                
            {/* 필터링된 QnA를 테이블로 렌더링 */}
            <PaginationTableQna rows={filteredQna} 
                                page={page} 
                                rowsPerPage={rowsPerPage}
                                getStatusText={getStatusText} />
                
            {/* 검색 필터링 UI */}
            <Grid container spacing={1} alignItems="center" className={styles.adminQnaFilterContainer}>
  {/* 상태 필터 */}
  <Grid item xs={4} className={styles.adminQnaDropdown}>
    <FormControl fullWidth variant="outlined">
      <InputLabel id="status-filter-label">상태</InputLabel>
      <Select
        labelId="status-filter-label"
        id="status-filter"
        value={statusFilter}
        onChange={handleStatusChange}
        label="상태"
      >
        <MenuItem value="">전체</MenuItem>
        <MenuItem value="N">대기</MenuItem>
        <MenuItem value="T">진행중</MenuItem>
        <MenuItem value="P">완료</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  {/* 질문 카테고리 필터 */}
  <Grid item xs={4} className={styles.adminQnaDropdown}>
    <FormControl fullWidth variant="outlined">
      <InputLabel id="category-filter-label">질문 카테고리</InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter"
        value={categoryFilter}
        onChange={handleCategoryChange}
        label="질문 카테고리"
      >
        <MenuItem value="">전체</MenuItem>
        <MenuItem value="계정 및 로그인">계정 및 로그인</MenuItem>
        <MenuItem value="AI면접 준비">AI면접 준비</MenuItem>
        <MenuItem value="기술 문제 해결">기술 문제 해결</MenuItem>
        <MenuItem value="결제 및 환불">결제 및 환불</MenuItem>
        <MenuItem value="기타">기타</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  {/* 검색 기준 선택 */}
  <Grid item xs={4} className={styles.adminQnaDropdown}>
    <FormControl fullWidth variant="outlined">
      <InputLabel id="search-category-label">검색 기준</InputLabel>
      <Select
        labelId="search-category-label"
        id="search-category"
        value={searchCategory}
        onChange={handleSearchCategoryChange}
        label="검색 기준"
      >
        <MenuItem value="">전체</MenuItem>
        <MenuItem value="title">글 제목</MenuItem>
        <MenuItem value="author">작성자</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  {/* 검색어 입력 */}
  <Grid item xs={9} className={styles.adminQnaSearchInput}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="검색어를 입력하세요"
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </Grid>

  {/* 검색 버튼 */}
  <Grid item xs={3}>
    <Button
      variant="contained"
      color="primary"
      onClick={handleSearch}
      className={styles.adminQnaSearchButton}
    >
      검색
    </Button>
  </Grid>
</Grid>


            {/* 페이지네이션 컨트롤 */}
            <Box className={styles.adminQnaPaginationControl}>
              <Button
                variant="outlined"
                onClick={() => handleChangePage(0)}
                disabled={page === 0}
                className={styles.adminQnaPaginationButton}
              >
                처음
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className={styles.adminQnaPaginationButton}
              >
                이전
              </Button>
              <span className={styles.adminQnaPageIndicator}>{page + 1} / {totalPages}</span>
              <Button
                variant="outlined"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                className={styles.adminQnaPaginationButton}
              >
                다음
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChangePage(totalPages - 1)}
                disabled={page >= totalPages - 1}
                className={styles.adminQnaPaginationButton}
              >
                마지막
              </Button>
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className={styles.adminQnaRowsPerPageSelect}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQna;
