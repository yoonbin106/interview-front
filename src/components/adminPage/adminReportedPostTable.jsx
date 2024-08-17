//**adminReportedPostTable.jsx
import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, TextField, InputLabel, MenuItem, FormControl, Select, Button, Grid } from '@mui/material';
import styles from '@/styles/adminPage/adminReportedPostTable.module.css';

export default function ReportedPostTable({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchCategory, setSearchCategory] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    setSearchQuery('');
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    const newFilteredRows = rows.filter((row) => {
      if (!searchCategory || searchCategory === 'all') {
        return row.title.includes(searchQuery) || row.author.includes(searchQuery);
      }
      if (searchCategory === 'category') {
        return row.category.includes(searchQuery);
      }
      if (searchCategory === 'author') {
        return row.author.includes(searchQuery);
      }
      if (searchCategory === 'title') {
        return row.title.includes(searchQuery);
      }
      return true;
    });
    setFilteredRows(newFilteredRows);
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <>
      <TableContainer component={Paper} className={styles.reportedPostTableContainer}>
        <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={styles.reportedPostHeaderCell}>글 번호</TableCell>
              <TableCell align="center" className={styles.reportedPostHeaderCell}>카테고리</TableCell>
              <TableCell align="center" className={styles.reportedPostHeaderCell}>제목</TableCell>
              <TableCell align="center" className={styles.reportedPostHeaderCell}>작성자</TableCell>
              <TableCell align="center" className={styles.reportedPostHeaderCell}>작성날짜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredRows
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">
                  <a href={`/adminPage/adminReportedPostDetailsPage`} style={{textDecoration:'none',color:'black'}}>
                    {row.title}
                  </a>
                </TableCell>
                <TableCell align="center">{row.author}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 30 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>
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
        <FormControl variant="outlined" sx={{ marginLeft: 2 }}>
        <Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          displayEmpty
        >
           <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={-1}>전체</MenuItem>
          </Select>
        </FormControl>
      </Box>
     
      {/* 검색 기능 */}
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="search-category-label">검색 기준</InputLabel>
              <Select
                labelId="search-category-label"
                id="search-category"
                value={searchCategory}
                onChange={handleCategoryChange}
                label="검색 기준"
              >
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="category">카테고리</MenuItem>
                <MenuItem value="author">작성자</MenuItem>
                <MenuItem value="title">제목</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              disabled={!searchCategory || searchCategory === 'all'}
              style={{ height: '56px' }}
            />
          </Grid>
          <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              style={{ height: '56px', width: '100%', backgroundColor:'#4A90E2',color: 'white'}}
            >
              검색
            </Button>
          </Grid>
        </Grid>
        </Box>
    </>
  );
}