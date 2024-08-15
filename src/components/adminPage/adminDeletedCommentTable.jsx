import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styles from '@/styles/adminPage/adminReportedTable.module.css';
import { FormControl } from '@mui/material';

export default function AdminDeletedCommentTable({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openRowIndex, setOpenRowIndex] = React.useState(null);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  const handleDelete = () => {
    if (window.confirm("댓글을 영구삭제하시겠습니까?")) {
      alert("댓글 삭제가 완료되었습니다.");
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <TableContainer component={Paper} className={styles.ReportedTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={styles.ReportedHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.ReportedHeaderCell}>내용</TableCell>
            <TableCell align="center" className={styles.ReportedHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.ReportedHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                  <span onClick={() => toggleRow(index)} className={styles.ReportedLink}>
                    {row.title}
                  </span>
                </TableCell>
                <TableCell align="center">{row.author}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                  <Collapse in={openRowIndex === index} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <p><strong>게시판:</strong> 게시판123</p>
                      <Box
                        sx={{
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '16px',
                          backgroundColor: '#f9f9f9',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '14px',
                          color: '#333',
                          height: '100px',
                        }}
                      >
                        돌아서면 까먹어
                      </Box>
                      <div className={styles.ReportedButtonContainer}>
                        <Button variant="contained" color="error" onClick={handleDelete}>댓글 삭제</Button>
                      </div>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
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