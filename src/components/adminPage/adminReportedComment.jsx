import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Collapse, Button, Select, MenuItem, Divider } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminReportedComment.module.css';

export default function AdminReportedComment() {
  const router = useRouter();
  const [reportedComments, setReportedComments] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openRowIndex, setOpenRowIndex] = React.useState(null);

  // 서버에서 신고된 댓글 목록 가져오기
  React.useEffect(() => {
    axios.get('http://localhost:8080/api/adminreported/reportedcomments')
      .then(response => {
        console.log('Fetched reported comments:', response.data); // 콘솔에 데이터를 출력
        setReportedComments(response.data); // 상태 업데이트
      })
      .catch(error => {
        console.error('Error fetching reported comments:', error);
      });
  }, []);

  const paginatedComments = reportedComments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(reportedComments.length / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOpenRowIndex(null);  // 페이지 변경 시 아코디언 상태 초기화
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setOpenRowIndex(null);  // 페이지 변경 시 아코디언 상태 초기화
  };

  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  // 댓글 영구 삭제
  const handleDelete = (commentId) => {
    if (window.confirm("댓글을 영구적으로 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/api/adminreported/deletecomment/${commentId}`)
        .then(() => {
          alert("댓글이 영구적으로 삭제되었습니다.");
          setReportedComments(reportedComments.filter(comment => comment.id !== commentId));
        })
        .catch(error => {
          console.error('Error deleting comment:', error);
          alert('댓글 삭제 중 오류가 발생했습니다.');
        });
    }
  };

  // 댓글 복구
  const handleRestore = (reportId) => {
    if (window.confirm("댓글을 복구하시겠습니까?")) {
      axios.put(`http://localhost:8080/api/adminreported/restorecomment/${reportId}`)
        .then(() => {
          alert("댓글이 복구되었습니다.");
          setReportedComments(reportedComments.filter(comment => comment.id !== reportId));
        })
        .catch(error => {
          console.error('Error restoring comment:', error);
          alert('댓글 복구 중 오류가 발생했습니다.');
        });
    }
  };

  return (
    <div>
      <Box display="flex" alignItems="center" mb={2}>
        <DeleteTwoToneIcon sx={{ fontSize: 60, color: '#5A8AF2', marginRight: '8px' }} />
        <h2 className={styles.reportedCommentTitle}>𝐑𝐞𝐩𝐨𝐫𝐭𝐞𝐝 𝐂𝐨𝐦𝐦𝐞𝐧𝐭</h2>
      </Box>
      <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#999', mb: 2 }} />
      <TableContainer component={Paper} className={styles.deletedCommentTableContainer}>
        <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>신고 번호</TableCell>
              <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>내용</TableCell>
              <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>작성자</TableCell>
              <TableCell align="center" className={styles.reportedCommentTableHeaderCell}>신고 날짜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComments.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow hover onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                  <TableCell align="center">{row.reportId}</TableCell>
                  <TableCell align="center">
                    <span className={styles.reportedCommentTableLink}>
                      {row.commentContent}
                    </span>
                  </TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{new Date(row.reportedAt).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={openRowIndex === index} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <p><strong>[신고 사유]</strong>　{row.reason}</p>
                        <p><strong>[신고자]</strong>　{row.reporterName}</p>
                        <br />
                        <hr />
                        <p><strong>[게시글 번호]</strong>　{row.bbsId}</p>
                        <p><strong>[게시글 제목]</strong>　 {row.title}</p>
                        <p><strong>[게시글 등록 날짜]</strong>　 {new Date(row.createdAt).toLocaleString()}</p>
                        <p><strong>[게시글 URL]</strong>
                          <a href={`http://localhost:3000/bbs/postView?id=${row.bbsId}`} target="_blank" rel="noopener"  className={styles.reportedCommentTableLink}>
                            http://localhost:3000/bbs/postView?id={row.bbsId}
                          </a>
                        </p>
                        <div className={styles.reportedCommentTableButtonContainer}>
                          <Button variant="contained" color="error" onClick={() => handleDelete(row.reportId)}>댓글 영구삭제</Button>
                          <Button variant="contained" color="primary" onClick={() => handleRestore(row.reportId)}>댓글 복구</Button>
                        </div>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => handleChangePage(null, 0)}
          disabled={page === 0}
          sx={{ marginRight: 2 }}
        >
          처음
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleChangePage(null, page - 1)}
          disabled={page === 0}
          sx={{ marginRight: 2 }}
        >
          이전
        </Button>
        <span>{page + 1} / {totalPages}</span>
        <Button
          variant="outlined"
          onClick={() => handleChangePage(null, page + 1)}
          disabled={page >= totalPages - 1}
          sx={{ marginLeft: 2 }}
        >
          다음
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleChangePage(null, totalPages - 1)}
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
  );
}
