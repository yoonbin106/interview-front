//**adminReportedCommentTable.jsx */
import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Collapse, Button, Select, MenuItem } from '@mui/material';
import styles from '@/styles/adminPage/adminReportedCommentTable.module.css';

export default function PaginationTableComment({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openRowIndex, setOpenRowIndex] = React.useState(null);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 페이지를 첫 페이지로 초기화
  };

  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  const handleDelete = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      alert("댓글 삭제가 완료되었습니다.");
    }
  };

  const handleHide = () => {
    if (window.confirm("댓글을 숨기시겠습니까?")) {
      alert("댓글 숨김이 완료되었습니다.");
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <TableContainer component={Paper} className={styles.reportedCommentTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>내용</TableCell>
            <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>작성날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                  <span onClick={() => toggleRow(index)} className={styles.reportedCommentTableLink}>
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
                      <p><strong>신고 카테고리:</strong> 광고</p> {/* 임의로 '광고'로 설정 */}
                      <p><strong>신고자:</strong> user123</p> {/* 임의로 'user123'으로 설정 */}
                      <p><strong>신고사유:</strong></p>
                      <Box
                        sx={{
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '16px',
                          backgroundColor: '#f9f9f9',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '14px',
                          color: '#333',
                          height: '100px',  // 높이를 더 크게 설정
                        }}
                      >
                        이 내용은 적절하지 않습니다.
                      </Box>
                      <div className={styles.reportedCommentTableButtonContainer}>
                        <Button variant="contained" color="error" onClick={handleDelete}>댓글 삭제</Button>
                        <Button variant="contained" color="warning" onClick={handleHide}>댓글 숨김</Button>
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
    </TableContainer>
  );
}