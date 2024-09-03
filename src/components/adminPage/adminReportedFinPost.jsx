import React, { useState } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Divider } from '@mui/material';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminReportedFinPost.module.css';

// PaginationTableReportedFinPost 컴포넌트: 신고 처리 완료된 게시글을 테이블로 렌더링하는 컴포넌트
const PaginationTableReportedFinPost = ({ rows, page, rowsPerPage }) => {
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <TableContainer component={Paper} className={styles.reportedFinPostTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={styles.reportedFinPostHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.reportedFinPostHeaderCell}>카테고리</TableCell>
            <TableCell align="center" className={styles.reportedFinPostHeaderCell}>제목</TableCell>
            <TableCell align="center" className={styles.reportedFinPostHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.reportedFinPostHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.id}</TableCell>
              <TableCell align="center">{`[${row.category}]`}</TableCell>
              <TableCell align="center" className={styles.reportedFinPostTitleCell}>
                <a href={`/adminPage/adminReportedFinPostDetailsPage`} className={styles.reportedFinPostTableLink}>
                  {row.title}
                </a>
              </TableCell>
              <TableCell align="center">{row.author}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
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

// AdminReportedFinPost 컴포넌트: 신고 처리 완료된 게시글을 관리하는 페이지 컴포넌트
const AdminReportedFinPost = () => {
  const reportedfinpost = [
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

  const [searchCategory, setSearchCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReportedFinPost, setFilteredReportedFinPost] = useState(reportedfinpost);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setSearchCategory('');
    setSearchTerm('');
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = reportedfinpost.filter(item => {
      const matchesStatus = statusFilter ? item.category === statusFilter : true;
      const matchesSearch = searchCategory === 'title'
        ? item.title.toLowerCase().includes(lowercasedFilter)
        : item.author.toLowerCase().includes(lowercasedFilter);

      return matchesStatus && matchesSearch;
    });
    setFilteredReportedFinPost(filteredData);
    setPage(0);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalPages = Math.ceil(filteredReportedFinPost.length / rowsPerPage);

  return (
    <div className={styles.reportedFinPostContainer}>
      <div className={styles.reportedFinPostSidebar}>
        <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
      </div>
      <div className={styles.reportedFinPostContent}>
        <div className={styles.reportedFinPostMainContainer}>
          <div>
            {/* 페이지 상단: 제목 */}
            <Box display="flex" alignItems="center" mb={2}>
              <WarningTwoToneIcon sx={{ fontSize: 60, color: '#000', marginRight: '8px' }} />
              <h2 className={styles.reportedFinPostTitle}>𝐑𝐞𝐬𝐨𝐥𝐯𝐞𝐝 𝐑𝐞𝐩𝐨𝐫𝐭𝐬</h2>
            </Box>
            <Divider sx={{ my: 2, borderBottomWidth: 3, borderColor: '#555' }} /> {/* 굵고 중간 톤의 Divider 추가 */}
            
            {/* 필터링된 게시글을 테이블로 렌더링 */}
            <PaginationTableReportedFinPost rows={filteredReportedFinPost} page={page} rowsPerPage={rowsPerPage} />
            
            {/* 검색 필터링 UI */}
            <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
              <Grid item xs={3}>
                <FormControl fullWidth variant="outlined">
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
                    <MenuItem value="허위 정보">허위 정보</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
              <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
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

export default AdminReportedFinPost;
