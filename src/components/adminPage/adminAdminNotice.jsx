import React from 'react';
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
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 CSS를 가져옵니다.
import styles from '@/styles/adminPage/adminAdminNotice.module.css';

const AdminAdminNotice = () => {
    const router = useRouter();

    const [date, setDate] = React.useState(new Date());

    const adminadminnotices = [
        { id: 12, title: '시스템 유지보수 안내 (9/30)', author: 'admin123', date: '2024-09-20' },
        { id: 11, title: '시스템 긴급 점검 안내 (8월 15일)', author: 'admin1004', date: '2024-08-11' },
        { id: 10, title: '회원 등급별 혜택 확대 안내', author: 'admin1107', date: '2024-08-10' },
        { id: 9, title: '보안 강화 관련 공지사항', author: 'admin123', date: '2024-08-09' },
        { id: 8, title: '신규 서비스 출시 안내', author: 'admin1004', date: '2024-08-08' },
        { id: 7, title: '고객센터 운영 시간 변경 안내', author: 'admin1107', date: '2024-08-07' },
        { id: 6, title: '8월 이벤트 당첨자 발표', author: 'admin123', date: '2024-08-06' },
        { id: 5, title: '2024년 상반기 결산 보고서', author: 'admin1004', date: '2024-08-05' },
        { id: 4, title: '서비스 이용약관 변경 안내', author: 'admin1107', date: '2024-08-04' },
        { id: 3, title: '2024년 고객 만족도 조사 결과 발표', author: 'admin123', date: '2024-08-03' },
        { id: 2, title: '긴급 서버 점검 안내 (8월 10일)', author: 'admin1004', date: '2024-08-02' },
        { id: 1, title: '개인정보 처리방침 변경 안내', author: 'admin1107', date: '2024-08-01' },
    ];

    const [searchCategory, setSearchCategory] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredNotices, setFilteredNotices] = React.useState(adminadminnotices);

    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = adminadminnotices.filter(item => {
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

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const totalPages = Math.ceil(filteredNotices.length / rowsPerPage);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredNotices.length) : 0;

    // 현재 월을 표시하기 위한 로직
    const currentMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className={styles.adminNoticeContainer}>
            <div className={styles.adminNoticeSidebar}>
                <NestedList />
            </div>
            <div className={styles.adminNoticeContent}>
                <div className={styles.adminNoticeMainContainer}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className={styles.adminNoticeTitle}>관리자 공지사항</h2>
                           
                        </div>
                        
                        {/* 테이블 가로 길이에 맞춘 달력 */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                            <Box sx={{ width: '100%' }}>
                                <Calendar
                                    value={date}
                                    onChange={setDate}
                                    className={styles.calendar}
                                />
                            </Box>
                        </Box>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#007bff',
                                        '&:hover': {
                                            backgroundColor: '#0056b3',
                                        },
                                    }}
                                    onClick={() => router.push('/adminPage/adminAdminNoticeRegisterPage')}
                                >
                                    글 등록
                                </Button>
                            </div>
                        <TableContainer component={Paper} className={styles.adminNoticeTableContainer}>
                            <Table sx={{ minWidth: 650 }} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" className={styles.adminNoticeTableHeaderCell}>글 번호</TableCell>
                                        <TableCell align="center" className={styles.adminNoticeTableHeaderCell}>제목</TableCell>
                                        <TableCell align="center" className={styles.adminNoticeTableHeaderCell}>작성자</TableCell>
                                        <TableCell align="center" className={styles.adminNoticeTableHeaderCell}>작성날짜</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? filteredNotices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : filteredNotices
                                    ).map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="center">{row.id}</TableCell>
                                            <TableCell align="center">
                                                <a href={`/adminPage/adminAdminNoticeDetailsPage`} className={styles.adminNoticeTableLink}>
                                                    {row.title}
                                                </a>
                                            </TableCell>
                                            <TableCell align="center">{row.author}</TableCell>
                                            <TableCell align="center">{row.date}</TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={4} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <Grid container spacing={1} alignItems="center" justifyContent="flex-end" className={styles.adminNoticeGridContainer}>
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
                                    className={styles.adminNoticeGridItem}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSearch}
                                    className={styles.adminNoticeSearchButton}
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
    );
};

export default AdminAdminNotice;