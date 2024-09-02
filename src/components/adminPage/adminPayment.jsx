import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Card, CardContent, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from '@/styles/adminPage/adminPayment.module.css';
import { cancelPayment, getAllPayInfo } from 'api/user';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4A90E2',
        },
    },
});

export default function AdminPayment() {
    const [searchResults, setSearchResults] = useState([]); 
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const [startDate, setStartDate] = useState(null); 
    const [endDate, setEndDate] = useState(null); 
    const [planType, setPlanType] = useState('베이직'); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [open, setOpen] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [selectedPaymentKey, setSelectedPaymentKey] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchPaymentData() {
            try {
                const paymentList = await getAllPayInfo();
                console.log(paymentList); // 데이터 구조 확인용

                const processedData = paymentList.data.map(item => ({
                    paymentId: item.orderId,
                    email: item.userId.email,
                    paymentDate: dayjs(item.approvedAt).format('YYYY-MM-DD'),
                    amount: `${item.useCount.toLocaleString()}`,
                    status: item.isCanceled === 1 ? '환불' : '승인',
                    planType: item.orderName,
                    isRefundable: item.isCanceled === 0,
                    paymentKey: item.paymentKey,
                }));

                const sortedData = [...processedData].sort((a, b) => dayjs(b.paymentDate) - dayjs(a.paymentDate));
                setSearchResults(sortedData);
            } catch (error) {
                console.error('Failed to fetch payment data:', error);
            }
        }

        fetchPaymentData();
    }, []);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase(); 

        const filtered = searchResults.filter((item) => {
            const matchesPlanType = planType ? item.planType === planType : true;
            const matchesDateRange = (!startDate || dayjs(item.paymentDate).isAfter(dayjs(startDate).subtract(1, 'day'))) &&
                (!endDate || dayjs(item.paymentDate).isBefore(dayjs(endDate).add(1, 'day')));
            const matchesSearchQuery = searchQuery === '' ||
                item.paymentId.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query);

            return matchesPlanType && matchesDateRange && matchesSearchQuery;
        }).sort((a, b) => dayjs(b.paymentDate) - dayjs(a.paymentDate));

        setSearchResults(filtered); 
        setPage(0); 
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    const handleOpenModal = (paymentKey) => {
        setSelectedPaymentKey(paymentKey);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setRefundReason('');
    };

    const handleRefund = async () => {
        if (!refundReason.trim()) {
            alert('환불 사유를 입력해주세요.');
            return;
        }
    
        console.log('Payment Key:', selectedPaymentKey);
        console.log('Refund Reason:', refundReason);
        try {
            const refundResponse = await cancelPayment(selectedPaymentKey, refundReason);
    
            // HTTP 상태 코드가 200일 경우
            if (refundResponse.status === 200) {
                router.push('/adminPage/adminRefundPage');
            } else {
                // 상태 코드가 200이 아닌 경우 오류 메시지 출력
                alert(`오류 발생: ${refundResponse.data}`);
            }
        } catch (error) {
            // 요청 중 예외가 발생한 경우 오류 메시지 출력
            alert(`오류 발생: ${error.response?.data || error.message}`);
        }
        handleCloseModal();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.adminPaymentContainer}>
                <div className={styles.adminPaymentContent}>
                    <h3 className={styles.adminPaymentTitle}>결제내역 관리</h3>
                    <ThemeProvider theme={theme}>
                        <Card className={styles.adminPaymentCard} sx={{ mt: 5 }}>
                            <CardContent>
                                <Box sx={{ mb: 4 }}>
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

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="결제번호 또는 이메일로 검색"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            sx={{ mr: 2 }}
                                        />
                                        <Button variant="contained" onClick={handleSearch} sx={{ height: '56px' , backgroundColor: '#5A8AF2'}}>
                                            검색
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </ThemeProvider>

                    <Box sx={{ width: '100%', mt: 4}}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.adminPaymentTableHeader}>결제번호</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>이메일</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>결제일</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>남은횟수</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>요금제 유형</TableCell>
                                        <TableCell className={styles.adminPaymentTableHeader}>결제취소</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.paymentId}>
                                        <TableCell>{row.paymentId}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.paymentDate}</TableCell>
                                        <TableCell>{row.amount}</TableCell>
                                        <TableCell>{row.planType}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="outlined" 
                                                color="secondary"
                                                disabled={!row.isRefundable}  
                                                onClick={() => handleOpenModal(row.paymentKey)} 
                                            >
                                                {row.isRefundable ? '환불하기' : '환불 완료'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>

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
                            {/* 환불 모달 */}
                            <Modal
                                open={open}
                                onClose={(event, reason) => {
                                    if (reason !== "backdropClick") {
                                        handleCloseModal();
                                    }
                                }}
                                aria-labelledby="refund-modal-title"
                                aria-describedby="refund-modal-description"
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    p: 4,
                                    position: 'relative'
                                }}>
                                    <Button 
                                        onClick={handleCloseModal} 
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                    >
                                        <CloseIcon />
                                    </Button>
                                    <h2 id="refund-modal-title">환불사유를 입력해주세요</h2>
                                    <TextField
                                        fullWidth
                                        placeholder="환불사유를 입력해주세요"
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        multiline
                                        rows={4}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleRefund}
                                        sx={{ mt: 2, display: 'block', marginLeft: 'auto' }}
                                    >
                                        환불처리하기
                                    </Button>
                                </Box>
                            </Modal>
                        </Box>
                    </Box>
                </div>
            </div>
        </LocalizationProvider>
    );
}