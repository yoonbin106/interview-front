//adminReportedPost.jsx

import React, { useState } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead } from '@mui/material';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminReportedPost.module.css';

// PaginationTableReportedPost 컴포넌트: ReportedPost 테이블을 렌더링하는 컴포넌트
const PaginationTableReportedPost = ({ rows, page, rowsPerPage }) => {
  // 빈 행 계산 (페이지가 변경될 때 테이블 하단을 채우기 위함)
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <TableContainer component={Paper} className={styles.reportedPostTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {/* 테이블 헤더: 글 번호, 카테고리, 제목, 작성자, 작성날짜 */}
            <TableCell align="center" className={styles.reportedPostHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.reportedPostHeaderCell}>카테고리</TableCell>
            <TableCell align="center" className={styles.reportedPostHeaderCell}>제목</TableCell>
            <TableCell align="center" className={styles.reportedPostHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.reportedPostHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 테이블 본문: 현재 페이지에 해당하는 행들만 렌더링 */}
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.id}</TableCell>
              <TableCell align="center">{`[${row.category}]`}</TableCell>
              <TableCell align="center" className={styles.reportedPostTitleCell}>
                {/* 제목 클릭 시 게시글 상세 페이지로 이동 */}
                <a href={`/adminPage/adminReportedPostDetailsPage`} className={styles.reportedPostTableLink}>
                  {row.title}
                </a>
              </TableCell>
              <TableCell align="center">{row.author}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
            </TableRow>
          ))}
          {/* 빈 행 처리 */}
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

// ReportedPost 컴포넌트: 전체 ReportedPost 관리 페이지 컴포넌트
const AdminReportedPost = () => {
    // 하드코딩된 reportedpost 데이터 (샘플 데이터)
    const reportedpost = [
      { id: 3021, category: '광고', title: '단 6개월만에 취업성공? ICT2기 절찬리에 모집중@@-->링크클릭', author: 'user789', date: '2023-08-10', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3022, category: '스팸', title: '무의미한 반복 텍스트...', author: 'user654', date: '2023-08-09', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3023, category: '욕설', title: '이 씨발', author: 'user123', date: '2023-08-08', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3024, category: '비방', title: 'ewns__<<이사람 조심하세요 미쳐있음', author: 'user456', date: '2023-08-07', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3025, category: '허위 정보', title: '2강의실 최고대가리는 "최가흔" 모두들 기억해주세요', author: 'user987', date: '2023-08-06', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3026, category: '광고', title: '플젝이 어렵다? ☆PPT주말반☆ 속성 강의가 있답니다.', author: 'user321', date: '2023-08-05', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3027, category: '스팸', title: '또 다른 무의미한 텍스트...', author: 'user123', date: '2023-08-04', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3028, category: '욕설', title: '플젝 너무 힘들엉 십발', author: 'user654', date: '2023-08-03', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3029, category: '광고', title: '[개봉//임박]추피티vs흥파고 리벤지대결!!!!', author: 'user456', date: '2023-08-02', content: '여기에 게시글 내용이 들어갑니다.' },
      { id: 3030, category: '허위 정보', title: '사실 이거 전혀 사실이 아니에요', author: 'user789', date: '2023-08-01', content: '여기에 게시글 내용이 들어갑니다.' },
    ];

    // 상태 관리: 검색 카테고리, 검색어, 필터링된 게시글 목록, 페이지, 페이지당 행 수
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReportedPost, setFilteredReportedPost] = useState(reportedpost);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
        const filteredData = reportedpost.filter(item => {
            const matchesStatus = statusFilter ? item.category === statusFilter : true;
            const matchesSearch = searchCategory === 'title'
                ? item.title.toLowerCase().includes(lowercasedFilter)
                : item.author.toLowerCase().includes(lowercasedFilter);

            return matchesStatus && matchesSearch;
        });
        setFilteredReportedPost(filteredData);
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

    const totalPages = Math.ceil(filteredReportedPost.length / rowsPerPage);

    return (
        <div className={styles.reportedPostContainer}>
            <div className={styles.reportedPostSidebar}>
                <NestedList/>
            </div>
            <div className={styles.reportedPostContent}>
            <div className={styles.reportedPostMainContainer}>
                    <div>
                    {/* 페이지 상단: 제목 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className={styles.reportedPostTitle}>신고된 게시글</h2>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            </div>
                            </div>
                            
                            {/* 신고된 게시글 목록을 테이블로 렌더링 */}
                            <PaginationTableReportedPost rows={filteredReportedPost} page={page} rowsPerPage={rowsPerPage} />
                            
                            {/* 검색 필터링 UI */}
                             <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
                                <Grid item xs={3}>
                                    <FormControl fullWidth variant="outlined">
                                        {/* 상태 필터링 (카테고리 기준) */}
                                        <InputLabel id="status-filter-label">카테고리 검색</InputLabel>
                                        <Select
                                            labelId="status-filter-label"
                                            id="status-filter"
                                            value={statusFilter}
                                            onChange={handleStatusChange}
                                            label="카테고리 검색"
                                        >
                                            <MenuItem value="">전체</MenuItem>
                                            <MenuItem value="광고">광고</MenuItem>
                                            <MenuItem value="스팸">스팸</MenuItem>
                                            <MenuItem value="욕설">욕설</MenuItem>
                                            <MenuItem value="비방">비방</MenuItem>
                                            <MenuItem value="허위정보">허위정보</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    {/* 검색 기준 선택 (제목, 작성자) */}
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
                                <Grid item xs={4}>
                                    {/* 검색어 입력 필드 */}
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
                                <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    {/* 검색 버튼 */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSearch}
                                        style={{ height: '56px', width: '100%', backgroundColor: '#5A8AF2', color: 'white' }}
                                    >
                                        검색
                                    </Button>
                                </Grid>
                            </Grid> 

                            {/* 페이지네이션 컨트롤 */}
                            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* 페이지네이션: 처음, 이전, 다음, 마지막 페이지로 이동하는 버튼 */}
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(0)}
                                    disabled={page === 0}
                                    sx={{ marginRight: 2 }}
                                >
                                    처음
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(page - 1)}
                                    disabled={page === 0}
                                    sx={{ marginRight: 2 }}
                                >
                                    이전
                                </Button>
                                <span>{page + 1} / {totalPages}</span>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    sx={{ marginLeft: 2 }}
                                >
                                    다음
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(totalPages - 1)}
                                    disabled={page >= totalPages - 1}
                                    sx={{ marginLeft: 2 }}
                                >
                                    마지막
                                </Button>
                                {/* 페이지당 표시할 행 수 선택 */}
                                <Select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    sx={{ marginLeft: 2 }}
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

export default AdminReportedPost;