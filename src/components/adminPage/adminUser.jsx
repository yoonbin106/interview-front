import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminUser.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AdminUser = ({ allData }) => {
    const [searchCondition, setSearchCondition] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedResults, setSortedResults] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지 당 10개의 항목 표시
    const router = useRouter();

    useEffect(() => {
        if (sortedResults.length === 0 && searchTerm === '') {
            const sortedDefaultResults = allData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
            setSortedResults(sortedDefaultResults);
        }
    }, [sortedResults, searchTerm, allData]);

    const handleConditionChange = (event) => {
        setSearchCondition(event.target.value);
    };

    const handleTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (searchCondition, searchTerm) => {
        const filteredResults = allData.filter((item) => {
            if (searchCondition === 'email') {
                return item.email.includes(searchTerm);
            } else if (searchCondition === 'phonelastnumber4') {
                return item.phone.slice(-4) === searchTerm;
            }
            return false;
        });
        setSortedResults(filteredResults);
        setPage(0); // 검색 후 첫 페이지로 이동
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSearch(searchCondition, searchTerm);
    };

    const handleViewDetails = (row) => {
        router.push(`/adminPage/adminUserDetailsPage`);
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => prevPage - 1);
    };

    const totalPages = Math.ceil(sortedResults.length / rowsPerPage);

    return (

        <Box className={styles.adminUserContainer}>
        <Typography variant="h3" gutterBottom>
            회원정보 검색
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2, minWidth: 120 }}>
                <InputLabel>검색 조건을 선택해주세요.</InputLabel>
                <Select
                    label="검색 조건"
                    value={searchCondition}
                    onChange={handleConditionChange}
                >
                        <MenuItem value="email">이메일</MenuItem>
                        <MenuItem value="phonelastnumber4">핸드폰번호 마지막 4자리</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="검색어 입력"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleTermChange}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="right">
                    <Button
                        variant="contained"
                        type="submit"
                        className={styles.adminUserSearchButton}
                    >
                        검색
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} className={styles.adminUserTableContainer}>
                <Table className={styles.adminUserTable}>
                    <TableHead className={styles.adminUserTableHead}>
                        <TableRow>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>이름</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>성별</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>생년월일</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>핸드폰번호</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>이메일</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>회원정보</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((result, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.name}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.gender}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.birth}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.phone}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.email}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>
                                    <Button
                                        variant="contained"
                                        className={styles.adminUserViewDetailsButton}
                                        onClick={() => handleViewDetails(result)}
                                    >
                                        상세보기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Custom Pagination */}
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                <IconButton onClick={handlePreviousPage} disabled={page === 0}>
                    <ArrowBackIcon />
                </IconButton>
                <span>{page + 1} / {totalPages}</span>
                <IconButton onClick={handleNextPage} disabled={page >= totalPages - 1}>
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AdminUser;