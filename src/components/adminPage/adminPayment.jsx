//adminPayment.jsx

import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // 최신 버전에서는 AdapterDayjs 사용
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from '@/styles/adminPage/adminPayment.module.css';

// 테마 생성: Material-UI에서 사용하는 기본 테마 설정
const theme = createTheme({
    palette: {
        primary: {
            main: '#4A90E2',
        },
    },
});

export default function AdminPayment() {
    const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장하는 상태
    const [page, setPage] = useState(0); // 현재 페이지를 저장하는 상태
    const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지당 표시할 행 수를 저장하는 상태
    const [startDate, setStartDate] = useState(null); // 조회 시작 날짜를 저장하는 상태
    const [endDate, setEndDate] = useState(null); // 조회 종료 날짜를 저장하는 상태
    const [planType, setPlanType] = useState('베이직'); // 선택된 요금제 유형을 저장하는 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어를 저장하는 상태

    // 더미 결제 데이터
    const paymentData = [
        { paymentId: 'order_id_001', email: 'user1@example.com', paymentDate: '2024-08-01', amount: '₩39,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_002', email: 'user2@example.com', paymentDate: '2024-08-02', amount: '₩49,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_003', email: 'user3@example.com', paymentDate: '2024-08-03', amount: '₩59,000', status: '취소', planType: '베이직' },
        { paymentId: 'order_id_004', email: 'user4@example.com', paymentDate: '2024-08-04', amount: '₩29,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_005', email: 'user5@example.com', paymentDate: '2024-08-05', amount: '₩39,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_006', email: 'user6@example.com', paymentDate: '2024-08-06', amount: '₩45,000', status: '취소', planType: '프리미엄' },
        { paymentId: 'order_id_007', email: 'user7@example.com', paymentDate: '2024-07-30', amount: '₩33,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_008', email: 'user8@example.com', paymentDate: '2024-07-28', amount: '₩55,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_009', email: 'user9@example.com', paymentDate: '2024-07-25', amount: '₩29,000', status: '취소', planType: '베이직' },
        { paymentId: 'order_id_010', email: 'user10@example.com', paymentDate: '2024-07-15', amount: '₩49,000', status: '승인', planType: '프리미엄' },
    ];

    // 컴포넌트가 처음 렌더링될 때 실행되는 useEffect 훅
    useEffect(() => {
        // 초기 데이터는 날짜 최신순으로 정렬하여 설정
        const sortedData = [...paymentData].sort((a, b) => dayjs(b.paymentDate) - dayjs(a.paymentDate));
        setSearchResults(sortedData); // 정렬된 데이터를 검색 결과로 설정
    }, []);

    // 검색 버튼 클릭 시 실행되는 함수
    const handleSearch = () => {
        const query = searchQuery.toLowerCase(); // 검색어를 소문자로 변환

        // 조건에 맞는 결제 데이터를 필터링
        const filtered = paymentData.filter((item) => {
            const matchesPlanType = planType ? item.planType === planType : true; // 요금제 유형 필터링
            const matchesDateRange = (!startDate || dayjs(item.paymentDate).isAfter(dayjs(startDate).subtract(1, 'day'))) &&
                (!endDate || dayjs(item.paymentDate).isBefore(dayjs(endDate).add(1, 'day'))); // 날짜 범위 필터링
            const matchesSearchQuery = searchQuery === '' ||
                item.paymentId.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query); // 검색어 필터링

            return matchesPlanType && matchesDateRange && matchesSearchQuery;
        }).sort((a, b) => dayjs(b.paymentDate) - dayjs(a.paymentDate)); // 필터링된 데이터를 최신 날짜순으로 정렬

        setSearchResults(filtered); // 필터링된 데이터를 검색 결과로 설정
        setPage(0); // 검색 후 첫 페이지로 이동
    };

    // 페이지 변경 핸들러
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // 페이지당 행 수 변경 핸들러
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 페이지를 첫 페이지로 초기화
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.adminPaymentContainer}>
                <div className={styles.adminPaymentContent}>
                    <h3 className={styles.adminPaymentTitle}>결제내역 관리</h3>
                    <ThemeProvider theme={theme}>
                        {/* 검색 필터 UI */}
                        <Card className={styles.adminPaymentCard} sx={{ mt: 5 }}>
                            <CardContent>
                                <Box sx={{ mb: 4 }}>
                                    {/* 요금제 유형 선택 */}
                                    <FormControl component="fieldset">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FormLabel component="legend" sx={{ mr: -3 }}>요금제 유형을 선택해주세요.</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-label="planType"
                                                name="planType"
                                                value={planType}
                                                onChange={(e) => setPlanType(e.target.value)}
                                            >
                                                <FormControlLabel value="베이직" control={<Radio />} label="베이직" />
                                                <FormControlLabel value="프리미엄" control={<Radio />} label="프리미엄" />
                                            </RadioGroup>
                                        </Box>
                                    </FormControl>

                                    {/* 날짜 선택 */}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <DatePicker
                                                label="조회 시작 날짜"
                                                value={startDate}
                                                onChange={(newValue) => setStartDate(newValue)}
                                                renderInput={(params) => <TextField {...params} sx={{ mx: 1 }} />}
                                            />
                                            <Box sx={{ mx: 2 }}> ~ </Box>
                                            <DatePicker
                                                label="조회 종료 날짜"
                                                value={endDate}
                                                onChange={(newValue) => setEndDate(newValue)}
                                                renderInput={(params) => <TextField {...params} sx={{ mx: 1 }} />}
                                            />
                                        </Box>
                                    </LocalizationProvider>

                                    {/* 결제번호 또는 이메일 검색 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="결제번호 또는 이메일로 검색"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            sx={{ mr: 2 }}
                                        />
                                        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ height: '56px' }}>
                                            검색
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </ThemeProvider>

                    {/* 결제 내역 테이블 */}
                    <Box sx={{ width: '100%', mt: 4 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.adminPaymentTableHeader}>결제번호</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>이메일</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>결제일</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>금액</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>상태</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>요금제 유형</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* 현재 페이지에 해당하는 결제 데이터를 테이블에 표시 */}
                                    {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.paymentId}>
                                            <TableCell>{row.paymentId}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.paymentDate}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{row.planType}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                            <span>{page + 1} / {Math.ceil(searchResults.length / rowsPerPage)}</span>
                            <Button
                                variant="outlined"
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page >= Math.ceil(searchResults.length / rowsPerPage) - 1}
                                sx={{ marginLeft: 2 }}
                            >
                                다음
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleChangePage(Math.ceil(searchResults.length / rowsPerPage) - 1)}
                                disabled={page >= Math.ceil(searchResults.length / rowsPerPage) - 1}
                                sx={{ marginLeft: 2 }}
                            >
                                마지막
                            </Button>
                            {/* 페이지당 표시할 행 수 선택 */}
                            <Select
                                value={rowsPerPage}
                                onChange={handleChangeRowsPerPage}
                                sx={{ marginLeft: 2 }}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                </div>
            </div>
        </LocalizationProvider>
    );
}