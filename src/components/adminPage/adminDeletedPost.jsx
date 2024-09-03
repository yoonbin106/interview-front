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
import { TextField, Grid, FormControl, InputLabel, Divider } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminDeletedPost.module.css';

const AdminDeletedPost = () => {
    // 하드코딩된 삭제된 게시글 데이터 (임시 데이터)
    const deletedpost = [
        { id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15' },
        { id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10' },
        { id: 13, title: '새로운 기능 업데이트', author: 'admin456', date: '2024-06-30' },
        { id: 12, title: '운영정책 변경 안내', author: 'admin789', date: '2024-06-25' },
        { id: 11, title: '서버 이전 공지', author: 'admin222', date: '2024-06-20' },
        { id: 10, title: '서비스 이용약관 변경', author: 'admin555', date: '2024-06-15' },
        { id: 9, title: '데이터베이스 점검 안내', author: 'admin888', date: '2024-06-10' },
        { id: 8, title: '긴급 서버 점검', author: 'admin333', date: '2024-06-05' },
        { id: 7, title: '서비스 일시 중단 안내', author: 'admin999', date: '2024-05-30' },
        { id: 6, title: '공휴일 휴무 안내', author: 'admin111', date: '2024-05-25' },
        { id: 5, title: '유료 서비스 변경 안내', author: 'admin654', date: '2024-05-20' },
        { id: 4, title: '시스템 유지보수 작업', author: 'admin333', date: '2024-05-15' },
        { id: 3, title: '회원가입 정책 변경', author: 'admin222', date: '2024-05-10' },
        { id: 2, title: '보안 강화 업데이트', author: 'admin999', date: '2024-05-05' },
        { id: 1, title: '서버 업그레이드 안내', author: 'admin123', date: '2024-05-01' },
    ];

    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDeletedPost, setFilteredDeletedPost] = useState(deletedpost);

    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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
        setFilteredDeletedPost(filteredData);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalPages = Math.ceil(filteredDeletedPost.length / rowsPerPage);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredDeletedPost.length) : 0;

    return (
        <div className={styles.deletedPostContainer}>
            <div className={styles.deletedPostSidebar}>
                <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
            </div>
            <div className={styles.deletedPostContent}>
                <div className={styles.deletedPostMainContainer}>
                    <div>
                        <Box display="flex" alignItems="center" mb={2}>
                            <DeleteTwoToneIcon sx={{ fontSize: 60, color: '#5A8AF2', marginRight: '8px' }} />
                            <h2 className={styles.deletedPostTitle}>𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐏𝐨𝐬𝐭</h2>
                        </Box>
                        <Divider sx={{ my: 2, borderBottomWidth: 3, borderColor: '#999' }} />

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
                                        ? filteredDeletedPost.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                    disabled={!searchCategory}
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
