//adminDeletedPost.jsx

import React, { useState } from 'react';
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
import { TextField, Grid, FormControl, InputLabel } from '@mui/material';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminDeletedPost.module.css'; // CSS 파일을 import

const AdminDeletedPost = () => {
    // 하드코딩된 삭제된 게시글 데이터 (임시 데이터)
    const deletedpost = [
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        // ... 나머지 삭제된 게시글 데이터
    ];

    // 검색 상태를 관리하기 위한 useState 훅
    const [searchCategory, setSearchCategory] = useState(''); // 검색 카테고리 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredDeletedPost, setFilteredDeletedPost] = useState(deletedpost); // 필터링된 게시글 상태

    // 검색 카테고리 변경 핸들러: 사용자가 선택한 검색 기준에 따라 상태를 업데이트
    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm(''); // 카테고리 변경 시 검색어 초기화
    };

    // 검색어 변경 핸들러: 사용자가 입력한 검색어를 상태로 관리
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 시 필터링 로직: 입력된 검색어에 따라 게시글을 필터링
    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = deletedpost.filter(item => {
            if (searchCategory === 'title') {
                return item.title.toLowerCase().includes(lowercasedFilter);
            }
            if (searchCategory === 'author') {
                return item.author.toLowerCase().includes(lowercasedFilter);
            }
            return false;
        });
        setFilteredDeletedPost(filteredData); // 필터링된 결과를 상태로 업데이트
    };

    // 페이지 상태 관리
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const totalPages = Math.ceil(filteredDeletedPost.length / rowsPerPage); // 전체 페이지 수 계산

    // 페이지 변경 핸들러
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    // 페이지당 행 수 변경 핸들러
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 페이지를 0으로 초기화
    };

    // 비어있는 행의 수 계산 (페이지에 표시될 행이 부족할 경우)
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredDeletedPost.length) : 0;

    // 전체 페이지 렌더링
    return (
        <div className={styles.deletedPostContainer}>
            <div className={styles.deletedPostSidebar}>
                <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
            </div>
            <div className={styles.deletedPostContent}>
                <div className={styles.deletedPostMainContainer}>
                    <div>
                        {/* 페이지 상단: 제목 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className={styles.deletedPostTitle}>삭제된 게시글 목록</h2>
                        </div>
                        {/* 필터링된 게시글을 테이블로 렌더링 */}
                        <TableContainer component={Paper} className={styles.deletedPostTableContainer}>
                            <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>글 번호</TableCell>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>제목</TableCell>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>작성자</TableCell>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>삭제날짜</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? filteredDeletedPost.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 현재 페이지의 행만 보여줌
                                        : filteredDeletedPost
                                    ).map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="center">{row.id}</TableCell>
                                            <TableCell align="center">
                                                <a href={`/adminPage/adminDeletedPostDetailsPage`} className={styles.deletedPostTableLink}>
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
                        {/* 검색 필터 UI */}
                        <Grid container spacing={1} alignItems="center" justifyContent="flex-end" className={styles.deletedPostGridContainer}>
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
                                    disabled={!searchCategory} // 검색 카테고리를 선택해야만 입력 가능
                                    className={styles.deletedPostGridItem}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSearch}
                                    className={styles.deletedPostSearchButton}
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

export default AdminDeletedPost;