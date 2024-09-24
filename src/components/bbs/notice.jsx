import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TableHead,
    Typography,
} from '@mui/material';
import NestedList from '@/components/bbs/bbsSidebar';
import styles from '@/styles/bbs/bbsNotice.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Notifications } from '@mui/icons-material'; // 아이콘 추가

const Notice = () => {
    const [noticeData, setNoticeData] = useState([]);
    const router = useRouter();

    const handleRowClick = (noticeId) => {
        router.push(`/bbs/bbsNoticeDetailsPage/${noticeId}`);
    };

    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredNotices.length) : 0;

    useEffect(() => {
        const fetchNoticeData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/notice');
                const sortedData = response.data.sort((a,b) => new Date(b.noticeCreatedTime) - new Date(a.noticeCreatedTime));
                setNoticeData(response.data);
                setFilteredNotices(sortedData);
            } catch (error) {
                console.error('Error fetching Notice data:', error);
            }
        };

        fetchNoticeData();
    }, []);

    useEffect(() => {
        const queryPage = router.query.page ? parseInt(router.query.page, 10) : 0;
        setPage(queryPage);
    }, [router.query.page]);

    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = noticeData.filter(item => {
            const matchesSearch = searchCategory === 'title'
                ? item.noticeTitle.toLowerCase().includes(lowercasedFilter)
                : searchCategory === 'author'
                ? item.user.username.toLowerCase().includes(lowercasedFilter)
                : true;

            return matchesSearch;
        });
        setFilteredNotices(filteredData);
        setPage(0);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
        router.push({
            pathname: '/bbs/noticePage', // 정확한 경로로 설정
            query: { ...router.query, page: newPage }, // 페이지 상태를 쿼리에 추가
        });
    };

    const totalPages = Math.ceil(filteredNotices.length / rowsPerPage);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <div className="main-container">
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                        <Notifications sx={{ fontSize: 40, color: '#1976d2', marginRight: 1 }} />
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                            전체 공지
                        </Typography>
                    </Box>

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
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell align="center">{row.noticeId}</TableCell>
                                        <TableCell align="center" className={styles.NoticeTitleCell}>
                                            {row.noticeTitle}
                                        </TableCell>
                                        <TableCell align="center">{row.user.username}</TableCell>
                                        <TableCell align="center" className={styles.noticeDateCell}>
                                            {new Date(row.noticeCreatedTime).toLocaleString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                
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
    );
};

export default Notice;
