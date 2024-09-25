import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Collapse, Button, Select, MenuItem, Divider } from '@mui/material';
import styles from '@/styles/adminPage/adminDeletedComment.module.css';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminDeletedComment() {
  const router = useRouter();
  const [deletedComments, setDeletedComments] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openRowIndex, setOpenRowIndex] = React.useState(null);

  // 서버에서 삭제된 댓글 목록 가져오기
  React.useEffect(() => {
    axios.get('http://localhost:8080/api/admindeleted/deleted-comments')
      .then(response => {
        console.log('받아오는 데이터:',response)
        // 삭제된 날짜 기준으로 오름차순 정렬
        const sortedData = response.data.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
        setDeletedComments(sortedData);
      })
      .catch(error => {
        console.error('Error fetching deleted comments:', error);
      });
  }, []);

  // 댓글 데이터를 페이지네이션에 맞춰 나눔
  const paginatedComments = deletedComments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalPages = Math.ceil(deletedComments.length / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOpenRowIndex(null); // 페이지 변경시 아코디언 상태 초기화 (모두 닫힘)
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setOpenRowIndex(null); // 페이지 변경 시 아코디언 상태 초기화
  };

  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  // 댓글 영구삭제
  const handleDelete = (commentId) => {
    if (window.confirm("댓글을 영구적으로 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/api/admindeleted/delete/${commentId}`)
        .then(() => {
          alert("댓글이 영구적으로 삭제되었습니다.");
          setDeletedComments(deletedComments.filter(comment => comment.commentId !== commentId));
          setOpenRowIndex(null);  // 아코디언 닫기
        })
        .catch(error => {
          console.error('Error deleting comment:', error);
          alert('댓글 삭제 중 오류가 발생했습니다.');
        });
    }
  };

  // 댓글 복구
  const handleRestore = (commentId, postDeleted) => {
    if (postDeleted) {
    } else {
      if (window.confirm("댓글을 복구하시겠습니까?")) {
        axios.post(`http://localhost:8080/api/admindeleted/restorecomment/${commentId}`)
          .then(() => {
            alert("댓글이 복구되었습니다.");
            setDeletedComments(deletedComments.filter(comment => comment.commentId !== commentId));
            setOpenRowIndex(null);  // 아코디언 닫기
          })
          .catch(error => {
            console.error('Error restoring comment:', error);
            alert('댓글 복구 중 오류가 발생했습니다.');
          });
      }
    }
  };

  return (
    <div>
      <div>
        <Box display="flex" alignItems="center" mb={2}>
          <DeleteTwoToneIcon sx={{ fontSize: 60, color: '#5A8AF2', marginRight: '8px' }} />
          <h2 className={styles.deletedCommentTitle}>𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐂𝐨𝐦𝐦𝐞𝐧𝐭</h2>
        </Box>
        <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#999', mb: 2 }} />
        <TableContainer component={Paper} className={styles.deletedCommentTableContainer}>
          <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.deletedCommentTableHeaderCell}>댓글 번호</TableCell>
                <TableCell align="center" className={styles.deletedCommentTableHeaderCell}>내용</TableCell>
                <TableCell align="center" className={styles.deletedCommentTableHeaderCell}>작성자</TableCell>
                <TableCell align="center" className={styles.deletedCommentTableHeaderCell}>삭제된 날짜</TableCell> {/* 삭제된 날짜 열 추가 */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedComments.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow hover onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                    <TableCell align="center">{row.commentId}</TableCell>
                    <TableCell align="center">
                      <span className={styles.deletedCommentTableLink}>
                        {row.content}
                      </span>
                    </TableCell>
                    <TableCell align="center">{row.username}</TableCell>
                    <TableCell align="center">{new Date(row.deletedAt).toLocaleString()}</TableCell> {/* 삭제된 날짜 표시 */}
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse in={openRowIndex === index} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <p><strong>게시판 제목:</strong> {row.bbsTitle}</p>
                          <p><strong>댓글 등록 날짜:</strong> {new Date(row.createdAt).toLocaleString()}</p> {/* 댓글 등록 날짜 */}
                          <div className={styles.deletedCommentTableButtonContainer}>
                            <Button variant="contained" color="error" onClick={() => handleDelete(row.commentId)}>댓글 영구삭제</Button>
                            <Button variant="contained" color="primary" onClick={() => handleRestore(row.commentId, row.bbs?.deleted)}>댓글 복구</Button>
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
    </div>
  );
}
