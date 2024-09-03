import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import styles from '@/styles/adminPage/adminRefund.module.css';
import { getAllRefundInfo } from 'api/user';
import PaymentTwoToneIcon from '@mui/icons-material/PaymentTwoTone';


export default function AdminRefund() {
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        async function fetchPaymentData() {
            try {
                const response = await getAllRefundInfo();
                const paymentList = response.data.map(item => ({
                    refundId: item.orderId,
                    email: item.userId.email,
                    refundDate: dayjs(item.canceledAt).format('YYYY-MM-DD'),
                    amount: `₩${item.price.toLocaleString()}`,
                    status: item.cancelStatus === "DONE" ? "처리완료" : "대기중",
                    admin: item.orderName,
                    reason: item.cancelReason || '사유 없음',
                }));
                setSearchResults(paymentList);
            } catch (error) {
                console.error('Failed to fetch payment data:', error);
            }
        }
        fetchPaymentData();
    }, []);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        const filtered = searchResults.filter((item) => {
            const matchesDateRange = (!startDate || dayjs(item.refundDate).isAfter(dayjs(startDate).subtract(1, 'day'))) &&
                                      (!endDate || dayjs(item.refundDate).isBefore(dayjs(endDate).add(1, 'day')));
            const matchesSearchQuery = searchQuery === '' ||
                                        item.refundId.toLowerCase().includes(query) ||
                                        item.email.toLowerCase().includes(query);

            return matchesDateRange && matchesSearchQuery;
        }).sort((a, b) => dayjs(b.refundDate) - dayjs(a.refundDate));

        setSearchResults(filtered);
        setPage(0);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.adminRefundContainer}>
                <div className={styles.adminRefundContent}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <PaymentTwoToneIcon sx={{ fontSize: 60, color: '#4A90E2', marginRight: '8px' }} />
                        <h3 className={styles.adminRefundTitle}>𝐑𝐞𝐟𝐮𝐧𝐝</h3>
                    </Box>
                    <Divider sx={{ my: 2, borderBottomWidth: 3, borderColor: '#999' }} />

                    <Card sx={{ width: '100%', textAlign: 'left' }}>
                        <CardContent>
                            <Box sx={{ mb: 4 }}>
                                {/* 조회 날짜 선택 */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <DatePicker
                                        label="조회 시작 날짜"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue ? dayjs(newValue) : null)}
                                        renderInput={(params) => <TextField {...params} sx={{ mx: 1 }} />}
                                    />
                                    <Box sx={{ mx: 2 }}> ~ </Box>
                                    <DatePicker
                                        label="조회 종료 날짜"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue ? dayjs(newValue) : null)}
                                        renderInput={(params) => <TextField {...params} sx={{ mx: 1 }} />}
                                    />
                                </Box>

                                {/* 검색어 입력 필드 및 검색 버튼 */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        placeholder="환불번호 또는 이메일로 검색"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        sx={{ mr: 2 }}
                                    />
                                    <Button variant="contained" onClick={handleSearch} sx={{ height: '56px', backgroundColor: '#5A8AF2' }}>
                                        검색
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 환불 요청 목록 테이블 */}
                    <Box sx={{ width: '100%', mt: 4 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.adminRefundTableHeader}>환불번호</TableCell>
                                        <TableCell className={styles.adminRefundTableHeader}>이메일</TableCell>
                                        <TableCell className={styles.adminRefundTableHeader}>환불일</TableCell>
                                        <TableCell className={styles.adminRefundTableHeader}>금액</TableCell>
                                        <TableCell className={styles.adminRefundTableHeader}>환불 상태</TableCell>
                                        <TableCell className={styles.adminRefundTableHeader}>결제 플랜</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* 테이블 행을 반복하여 생성 */}
                                    {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.refundId}>
                                            <TableCell>
                                                {/* 아코디언: 클릭 시 추가 정보 표시 */}
                                                <Accordion expanded={expanded === row.refundId} onChange={handleChange(row.refundId)}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls={`${row.refundId}-content`}
                                                        id={`${row.refundId}-header`}
                                                    >
                                                        <Typography>{row.refundId}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography variant="body2">
                                                            <strong>환불 사유:</strong> {row.reason || '사유 없음'}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.refundDate}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{row.admin || 'N/A'}</TableCell>
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
