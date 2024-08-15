import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import styles from '@/styles/adminPage/adminPaginationTableFin.module.css';
import { Grid } from '@mui/material';

export default function ReportedFinPostTable({ rows }) {
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
    setPage(0); // 페이지를 첫 페이지로 초기화
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
    setPage(0); // 검색 후 첫 페이지로 이동
  };

  return (
    <>
      <TableContainer component={Paper} className={styles.RePortedFinTableContainer}>
        <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={styles.ReportedFinHeaderCell}>글 번호</TableCell>
              <TableCell align="center" className={styles.ReportedFinHeaderCell}>카테고리</TableCell>
              <TableCell align="center" className={styles.ReportedFinHeaderCell}>제목</TableCell>
              <TableCell align="center" className={styles.ReportedFinHeaderCell}>작성자</TableCell>
              <TableCell align="center" className={styles.ReportedFinHeaderCell}>작성날짜</TableCell>
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
                  <a href={`/adminPage/adminReportedPostDetailsPage`} style={{ textDecoration: 'none', color: 'black' }}>
                    {row.title}
                  </a>
                </TableCell>
                <TableCell align="center">{row.author}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">검색 결과가 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 검색 기능 */}
      <Box sx={{ marginTop: 2 }}>
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
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: '#4A90E2',
                '&:hover': { backgroundColor: '#357ABD' },
                height: '56px'
              }}
            >
              검색
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* 페이지네이션 */}
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <FormControl variant="outlined" sx={{ marginLeft: 2 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            displayEmpty
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}