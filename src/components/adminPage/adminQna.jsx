//adminQna.jsx

import React, { useState } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead } from '@mui/material';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminQna.module.css';

// PaginationTableQna 컴포넌트: QnA 테이블을 렌더링하는 컴포넌트
const PaginationTableQna = ({ rows, page, rowsPerPage }) => {
  // 빈 행 계산 (페이지가 변경될 때 테이블 하단을 채우기 위함)
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <TableContainer component={Paper} className={styles.adminQnaTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {/* 테이블 헤더 정의 */}
            <TableCell align="center" className={styles.adminQnaHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>카테고리</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>제목</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.adminQnaHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 페이지당 표시할 행만 보여줌 */}
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.id}</TableCell>
              <TableCell align="center">{`[${row.category}]`}</TableCell>
              <TableCell align="center" className={styles.adminQnaTitleCell}>
                <a href={`/adminPage/adminQnaDetailsPage`} className={styles.adminQnaTableLink}>
                  {row.title}
                </a>
              </TableCell>
              <TableCell align="center">{row.author}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
            </TableRow>
          ))}
          {/* 빈 행이 있으면 테이블에 추가하여 테이블 높이 유지 */}
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

// AdminQna 컴포넌트: 전체 QnA 관리 페이지 컴포넌트
const AdminQna = () => {
    // 하드코딩된 QnA 데이터
    const adminqna = [
        { id: 12, category: '대기', title: '결제하려는데 계속 오류가 떠요 ㅠㅠ 어떻게 해야 되나요?', author: 'user123', date: '2024-08-12' },
        { id: 11, category: '진행중', title: '로그인할 때마다 비밀번호가 틀렸다고 나오는데... 왜 그런 거죠? ㅠ', author: 'user12341', date: '2024-08-11' },
        { id: 10, category: '완료', title: '서비스 이용 중에 자꾸 로그아웃되는데 이거 버그 아닌가요?', author: 'user215', date: '2024-08-10' },
        { id: 9, category: '대기', title: '구독 취소하려고 하는데 어디서 하면 되나요?', author: 'user123', date: '2024-08-09' },
        { id: 8, category: '진행중', title: '프로모션 코드를 입력했는데 적용이 안 되네요. 도와주실 수 있나요?', author: 'user456', date: '2024-08-08' },
        { id: 7, category: '완료', title: '비밀번호 재설정 이메일이 오질 않아요. 어떻게 해야 하나요?', author: 'user3032', date: '2024-08-07' },
        { id: 6, category: '대기', title: '회원정보 수정이 불가능한데, 이유가 뭘까요?', author: 'user778', date: '2024-08-06' },
        { id: 5, category: '진행중', title: '결제 내역을 어디서 확인할 수 있나요? 안내 부탁드립니다.', author: 'user56465', date: '2024-08-05' },
        { id: 4, category: '완료', title: '아이디를 변경할 수 있는지 궁금해요!', author: 'user11', date: '2024-08-04' },
        { id: 3, category: '대기', title: '서비스 구독 연장이 생각보다 복잡하네요. 좀 더 간편하게 할 수 없을까요?', author: 'user72', date: '2024-08-03' },
        { id: 2, category: '진행중', title: '2차 인증 설정하는데 문제가 생겼어요. 빠른 해결 부탁드립니다.', author: 'user4456', date: '2024-08-02' },
        { id: 1, category: '완료', title: '프로필 사진을 업로드하려고 했는데 자꾸 실패해요. 왜 그런지 아시나요?', author: 'user30', date: '2024-08-01' },
    ];

    // 검색 상태 관리
    const [searchCategory, setSearchCategory] = useState(''); // 검색 기준 카테고리 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredQna, setFilteredQna] = useState(adminqna); // 필터링된 QnA 상태
    const [statusFilter, setStatusFilter] = useState(''); // 상태 필터 (대기, 진행중, 완료) 상태
    const [page, setPage] = useState(0); // 현재 페이지 상태
    const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 표시할 행 수 상태

    // 상태(카테고리) 필터 변경 핸들러
    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setSearchCategory('');
        setSearchTerm(''); // 상태 변경 시 다른 검색 조건 초기화
    };

    // 검색 카테고리 변경 핸들러
    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm(''); // 카테고리 변경 시 검색어 초기화
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = adminqna.filter(item => {
            const matchesStatus = statusFilter ? item.category === statusFilter : true; // 상태 필터링
            const matchesSearch = searchCategory === 'title'
                ? item.title.toLowerCase().includes(lowercasedFilter)
                : item.author.toLowerCase().includes(lowercasedFilter); // 검색어 필터링

            return matchesStatus && matchesSearch;
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
                        <PaginationTableQna rows={filteredQna} page={page} rowsPerPage={rowsPerPage} />
                            
                        {/* 검색 필터링 UI */}
                        <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
                            {/* 상태 필터 */}
                            <Grid item xs={3}>
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
                                        <MenuItem value="대기">대기</MenuItem>
                                        <MenuItem value="진행중">진행중</MenuItem>
                                        <MenuItem value="완료">완료</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* 검색 기준 선택 */}
                            <Grid item xs={3}>
                                <FormControl fullWidth variant="outlined" disabled={!statusFilter}>
                                    <InputLabel id="search-category-label">검색 기준</InputLabel>
                                    <Select
                                        labelId="search-category-label"
                                        id="search-category"
                                        value={searchCategory}
                                        onChange={handleCategoryChange}
                                        label="검색 기준"
                                    >
                                        <MenuItem value="">선택</MenuItem>
                                        <MenuItem value="title">제목</MenuItem>
                                        <MenuItem value="author">작성자</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* 검색어 입력 */}
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="검색어를 입력하세요"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    disabled={!searchCategory}
                                    style={{ height: '56px' }}
                                />
                            </Grid>
                            {/* 검색 버튼 */}
                            <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSearch}
                                    style={{ height: '56px', width: '100%', backgroundColor: '#4A90E2', color: 'white' }}
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
                            {/* 페이지당 표시할 행 수 선택 */}
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