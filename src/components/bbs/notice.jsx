import React, { useState, useEffect } from 'react';
import { Box, TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead } from '@mui/material';
import NestedList from '@/components/bbs/bbsSidebar';
import styles from '@/styles/bbs/bbsNotice.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';

const Notice = () => {
    // 공지사항 데이터 (하드코딩)
    const [noticeData, setNoticeData] = useState([]);
    const router = useRouter();
    //행을 클릭했을 때 실행되는 함수
    const handleRowClick = (noticeId) => {
        router.push(`/bbs/bbsNoticeDetailsPage/${noticeId}`)
    }
    // 상태 관리
    const [searchCategory, setSearchCategory] = useState(''); // 검색 카테고리
    const [searchTerm, setSearchTerm] = useState(''); // 검색어
    const [filteredNotices, setFilteredNotices] = useState([]); // 필터링된 공지사항
    const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 게시물 수
    const [page, setPage] = useState(0); // 현재 페이지
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredNotices.length) : 0;
    useEffect(() => {
        const fetchNoticeData = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/notice');
            const sortedData = response.data.sort((a,b) => new Date(b.noticeCreatedTime) - new Date(a.noticeCreatedTime));
            setNoticeData(response.data); // 가져온 데이터를 상태에 저장
            setFilteredNotices(sortedData);//초기값 설정
          } catch (error) {
            console.error('Error fetching Notice data:', error);
          }
        };
    
        fetchNoticeData(); // 컴포넌트가 마운트될 때 AdminNotice 데이터를 가져옴
      }, []); 
   

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
        const filteredData = noticeData.filter(item => {
            if (searchCategory === 'title') {
                return item.title.toLowerCase().includes(lowercasedFilter);
            }
            if (searchCategory === 'author') {
                return item.author.toLowerCase().includes(lowercasedFilter);
            }
            return false;
        });
        setFilteredNotices(filteredData);
    };

    // 페이지당 게시물 개수 변경 핸들러
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 페이지 개수 변경 시 첫 페이지로 초기화
    };

    // 페이지 변경 핸들러
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(filteredNotices.length / rowsPerPage); // 전체 페이지 수

    useEffect(() => {
        console.log("현재 페이지의 게시글 데이터:", filteredNotices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [filteredNotices, page, rowsPerPage]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <div className="main-container">
                    <div style={{ position: 'relative', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '90%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 15, whiteSpace: 'nowrap', fontSize: 30, fontWeight: 'bold' }}>전체 공지</h2>
                            </div>

                            {/* 공지사항 테이블 */}
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
                                            ? filteredNotices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filteredNotices
                                        ).map((row) => (
                                            <TableRow key={row.noticeId}
                                            hover
                                            onClick={() => handleRowClick(row.noticeId)}
                                            style={{cursor:'pointer'}}>
                                            <TableCell align="center">{row.noticeId}</TableCell>
                                            <TableCell align="center" className={styles.adminNoticeTitleCell}>
                                                {row.noticeTitle}
                                            </TableCell>
                                            <TableCell align="center">{row.user.username}</TableCell> {/* 작성자 이름 표시 */}
                                            <TableCell align="center" className={styles.noticeDateCell}>
                                                {new Date(row.noticeCreatedTime).toLocaleString('ko-KR',{
                                                    year: 'numeric',
                                                    month:'2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </TableCell>
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

                            <Grid container spacing={1} alignItems="center" justifyContent="flex-end" className={styles.noticeGridContainer}>
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
                                <MenuItem value="">선택</MenuItem>
                                <MenuItem value="title">제목</MenuItem>
                                <MenuItem value="author">작성자</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="검색어를 입력하세요"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            disabled={!searchCategory}
                            className={styles.noticeGridItem}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSearch}
                            className={styles.noticeSearchButton}
                        >
                            검색
                        </Button>
                    </Grid>
                </Grid>
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
        </div>
    );
};

export default Notice;
