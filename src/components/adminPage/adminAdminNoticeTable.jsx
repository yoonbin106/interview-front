import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import styles from '@/styles/adminPage/adminAdminNoticeTable.module.css';

export default function AdminNoticeTable({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 페이지를 첫 페이지로 초기화
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <TableContainer component={Paper} className={styles.NoticePaginationTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={styles.NoticePaginationHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.NoticePaginationHeaderCell}>제목</TableCell>
            <TableCell align="center" className={styles.NoticePaginationHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.NoticePaginationHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.id}</TableCell>
              <TableCell align="center">
                <a href={`/adminPage/adminAdminNoticeDetails`} style={{textDecoration:'none',color:'black'}}>
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
    </TableContainer>
  );
}