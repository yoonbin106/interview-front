import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Collapse, Button, Select, MenuItem, Divider } from '@mui/material';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import styles from '@/styles/adminPage/adminReportedFinComment.module.css';

export default function AdminReportedFinComment() {
  const reportedFinComments = [
    { id: 3021, category: '광고', content: '단 6개월만에 취업성공? ICT2기 절찬리에 모집중@@-->링크클릭', author: 'user789', date: '2023-08-10' },
    { id: 3022, category: '스팸', content: '무의미한 반복 텍스트...', author: 'user654', date: '2023-08-09' },
    { id: 3023, category: '욕설', content: '이 씨발', author: 'user123', date: '2023-08-08' },
    { id: 3024, category: '비방', content: 'ewns__<<이사람 조심하세요 미쳐있음', author: 'user456', date: '2023-08-07' },
    { id: 3025, category: '허위 정보', content: '2강의실 최고대가리는 "최가흔" 모두들 기억해주세요', author: 'user987', date: '2023-08-06' },
    { id: 3026, category: '광고', content: '플젝이 어렵다? ☆PPT주말반☆ 속성 강의가 있답니다.', author: 'user321', date: '2023-08-05' },
    { id: 3027, category: '스팸', content: '또 다른 무의미한 텍스트...', author: 'user123', date: '2023-08-04' },
    { id: 3028, category: '욕설', content: '플젝 너무 힘들엉 십발', author: 'user654', date: '2023-08-03' },
    { id: 3029, category: '광고', content: '[개봉//임박]추피티vs흥파고 리벤지대결!!!!', author: 'user456', date: '2023-08-02' },
    { id: 3030, category: '허위 정보', content: '사실 이거 전혀 사실이 아니에요', author: 'user789', date: '2023-08-01' },
    { id: 3031, category: '광고', content: '이거 한번 봐봐요! 대박!', author: 'user987', date: '2023-07-31' },
    { id: 3032, category: '스팸', content: '같은 내용 반복...', author: 'user321', date: '2023-07-30' },
    { id: 3033, category: '욕설', content: '정말 나쁜 말들...', author: 'user123', date: '2023-07-29' },
    { id: 3034, category: '비방', content: '너무 못하네요', author: 'user654', date: '2023-07-28' },
    { id: 3035, category: '허위 정보', content: '이거 진짜라고 하는데 아닌 듯...', author: 'user456', date: '2023-07-27' },
    { id: 3036, category: '광고', content: '최고의 상품! 지금 구입하세요!', author: 'user111', date: '2023-07-26' },
    { id: 3037, category: '스팸', content: '스팸 메시지 테스트 중입니다.', author: 'user222', date: '2023-07-25' },
    { id: 3038, category: '욕설', content: '욕설이 포함된 내용입니다.', author: 'user333', date: '2023-07-24' },
    { id: 3039, category: '비방', content: '이 사람 진짜 별로예요.', author: 'user444', date: '2023-07-23' },
    { id: 3040, category: '허위 정보', content: '이건 진짜가 아닌 것 같아요.', author: 'user555', date: '2023-07-22' },
    { id: 3041, category: '광고', content: '저렴한 가격에 최고의 품질!', author: 'user666', date: '2023-07-21' },
  ];

  const rows = reportedFinComments.map(comment => ({
    id: comment.id,
    category: comment.category,
    title: comment.content,
    author: comment.author,
    date: comment.date,
  }));

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
    <div>
      {/* 페이지 상단: 제목 */}
      <Box display="flex" alignItems="center" mb={2}>
        <WarningTwoToneIcon sx={{ fontSize: 60, color: '#000', marginRight: '8px' }} />
        <h2 className={styles.reportedFinCommentTitle}>𝐑𝐞𝐬𝐨𝐥𝐯𝐞𝐝 𝐂𝐨𝐦𝐦𝐞𝐧𝐭𝐬</h2>
      </Box>
      <Divider sx={{ my: 2, borderBottomWidth: 3, borderColor: '#999' }} /> 
      <div>
        {/* 신고된 댓글을 표시하는 테이블 */}
        <TableContainer component={Paper} className={styles.reportedFinCommentTableContainer}>
          <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.reportedFinCommentTableHeaderCell}>글 번호</TableCell>
                <TableCell align="center" className={styles.reportedFinCommentTableHeaderCell}>내용</TableCell>
                <TableCell align="center" className={styles.reportedFinCommentTableHeaderCell}>작성자</TableCell>
                <TableCell align="center" className={styles.reportedFinCommentTableHeaderCell}>작성날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">
                      <span onClick={() => toggleRow(index)} className={styles.reportedFinCommentLink}>
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
                          <p><strong>신고 카테고리:</strong> {row.category}</p>
                          <p><strong>신고자:</strong> user123</p>
                          <p><strong>신고사유:</strong></p>
                          <Box className={styles.reportedCommentReasonBox}>
                            이 내용은 적절하지 않습니다.
                          </Box>
                          <div className={styles.reportedFinCommentButtonContainer}>
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
        </TableContainer>
      </div>

      <div>
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
  );
}
