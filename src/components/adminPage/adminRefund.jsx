//adminRefund.jsx

import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, Select, MenuItem, Card, CardContent, FormControl, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from '@/styles/adminPage/adminRefund.module.css';

export default function AdminRefund() {
    // 상태 관리
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [page, setPage] = useState(0); // 현재 페이지 상태
    const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지당 행 수 상태
    const [startDate, setStartDate] = useState(null); // 조회 시작 날짜 상태
    const [endDate, setEndDate] = useState(null); // 조회 종료 날짜 상태
    const [refundStatus, setRefundStatus] = useState(''); // 환불 상태 필터링 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [expanded, setExpanded] = useState(false); // 아코디언 확장 상태
    const [notes, setNotes] = useState({}); // 관리자 메모 상태

    // 더미 데이터 정렬 (최신 날짜순)
    const sortedData = [
        { refundId: 'refund_id_001', email: 'user1@example.com', refundDate: '2024-08-01', amount: '₩39,000', status: '대기', admin: null, reason: '상품을 받아봤는데 생각보다 품질이 좋지 않아서 환불을 요청합니다. 제품 설명과 실물이 많이 달라서 실망했습니다.' },
        { refundId: 'refund_id_002', email: 'user2@example.com', refundDate: '2024-08-02', amount: '₩49,000', status: '처리중', admin: '관리자1', reason: '저는 원래 주문한 상품과 다른 색상의 제품이 배송되었습니다. 색상 변경이 불가능하다면 환불을 받고 싶습니다.' },
        { refundId: 'refund_id_021', email: 'user21@example.com', refundDate: '2024-06-29', amount: '₩34,000', status: '완료', admin: '관리자4', reason: '제품을 사용했는데 기능이 제대로 작동하지 않았습니다. 이 문제로 인해 환불을 요청합니다.' },
        { refundId: 'refund_id_022', email: 'user22@example.com', refundDate: '2024-06-27', amount: '₩45,000', status: '대기', admin: null, reason: '주문한 제품이 다른 상품으로 도착했습니다. 환불 처리를 원합니다.' },
        { refundId: 'refund_id_023', email: 'user23@example.com', refundDate: '2024-06-25', amount: '₩52,000', status: '처리중', admin: '관리자1', reason: '배송이 너무 지연되었기 때문에 환불을 원합니다. 빠른 처리 부탁드립니다.' },
        { refundId: 'refund_id_024', email: 'user24@example.com', refundDate: '2024-06-22', amount: '₩60,000', status: '완료', admin: '관리자3', reason: '상품이 도착했을 때 이미 파손된 상태였습니다. 환불을 요청합니다.' },
        { refundId: 'refund_id_025', email: 'user25@example.com', refundDate: '2024-06-20', amount: '₩47,000', status: '대기', admin: null, reason: '주문한 제품의 사이즈가 너무 커서 사용이 불가능합니다. 환불을 원합니다.' },
        { refundId: 'refund_id_026', email: 'user26@example.com', refundDate: '2024-06-18', amount: '₩55,000', status: '처리중', admin: '관리자2', reason: '제품의 색상이 화면에서 본 것과 달라서 환불을 원합니다.' },
        { refundId: 'refund_id_027', email: 'user27@example.com', refundDate: '2024-06-15', amount: '₩50,000', status: '완료', admin: '관리자4', reason: '사용 중 문제가 발생하여 환불을 요청합니다. 빠른 처리 부탁드립니다.' },
        { refundId: 'refund_id_028', email: 'user28@example.com', refundDate: '2024-06-10', amount: '₩33,000', status: '대기', admin: null, reason: '배송된 제품이 생각했던 것과 다릅니다. 환불을 원합니다.' },
        { refundId: 'refund_id_029', email: 'user29@example.com', refundDate: '2024-06-07', amount: '₩42,000', status: '처리중', admin: '관리자1', reason: '주문한 제품이 아닌 다른 제품이 배송되었습니다. 환불을 요청합니다.' },
        { refundId: 'refund_id_030', email: 'user30@example.com', refundDate: '2024-06-05', amount: '₩58,000', status: '완료', admin: '관리자3', reason: '제품의 품질이 기대 이하입니다. 환불을 원합니다.' }
    ];

    // 컴포넌트가 마운트될 때 더미 데이터를 검색 결과에 설정
    useEffect(() => {
        setSearchResults(sortedData);
    }, []);

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = () => {
        const query = searchQuery.toLowerCase(); // 검색어를 소문자로 변환
        const filtered = sortedData.filter((item) => {
            const matchesStatus = refundStatus ? item.status === refundStatus : true; // 상태 필터 적용
            const matchesDateRange = (!startDate || dayjs(item.refundDate).isAfter(dayjs(startDate).subtract(1, 'day'))) &&
                                      (!endDate || dayjs(item.refundDate).isBefore(dayjs(endDate).add(1, 'day'))); // 날짜 범위 필터 적용
            const matchesSearchQuery = searchQuery === '' ||
                                        item.refundId.toLowerCase().includes(query) ||
                                        item.email.toLowerCase().includes(query); // 검색어 필터 적용

            return matchesStatus && matchesDateRange && matchesSearchQuery; // 모든 필터 조건을 만족하는 데이터 반환
        }).sort((a, b) => dayjs(b.refundDate) - dayjs(a.refundDate)); // 최신순으로 정렬

        setSearchResults(filtered); // 필터링된 데이터를 상태에 저장
        setPage(0); // 페이지를 첫 페이지로 초기화
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

    // 아코디언 패널 확장/축소 핸들러
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false); // 클릭된 패널을 확장, 다른 패널은 축소
    };

    // 메모 입력 변경 핸들러
    const handleNoteChange = (refundId, value) => {
        setNotes(prevNotes => ({
            ...prevNotes,
            [refundId]: value // 입력된 메모를 상태에 저장
        }));
    };

    // 메모 저장 버튼 클릭 핸들러
    const handleSaveNote = (refundId) => {
        console.log(`Note for ${refundId}:`, notes[refundId]); // 콘솔에 메모를 출력 (백엔드 연동 시 이 부분을 API 호출로 대체)
        setNotes(prevNotes => ({
            ...prevNotes,
            [refundId]: notes[refundId] || '' // 메모 상태를 업데이트
        }));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.adminRefundContainer}>
                <div className={styles.adminRefundContent}>
                    <h3 className={styles.adminRefundTitle}>환불 관리</h3>
                    <Card sx={{ width: '100%', textAlign: 'left' }}>
                        <CardContent>
                            <Box sx={{ mb: 4 }}>
                                {/* 환불 상태 필터 */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>환불 상태</InputLabel>
                                    <Select
                                        value={refundStatus}
                                        onChange={(e) => setRefundStatus(e.target.value)}
                                        label="환불 상태"
                                    >
                                        <MenuItem value="">전체</MenuItem>
                                        <MenuItem value="대기">대기</MenuItem>
                                        <MenuItem value="처리중">처리중</MenuItem>
                                        <MenuItem value="완료">완료</MenuItem>
                                    </Select>
                                </FormControl>

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
                                    <Button variant="contained" onClick={handleSearch} sx={{ height: '56px', backgroundColor: '#5A8AF2'}}>
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
                                        <TableCell className={styles.adminRefundTableHeader}>처리 관리자</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* 테이블 행을 반복하여 생성 */}
                                    {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.refundId}>
                                            <TableCell>
                                                {/* 아코디언: 클릭 시 추가 정보 및 메모 입력 가능 */}
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
                                                        {/* 메모 입력 필드 */}
                                                        <TextField
                                                            label="메모"
                                                            multiline
                                                            fullWidth
                                                            rows={3}
                                                            value={notes[row.refundId] || ''}
                                                            onChange={(e) => handleNoteChange(row.refundId, e.target.value)}
                                                            sx={{ mt: 2 }}
                                                        />
                                                        {/* 메모 저장 버튼 */}
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            onClick={() => handleSaveNote(row.refundId)}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            메모 저장
                                                        </Button>
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