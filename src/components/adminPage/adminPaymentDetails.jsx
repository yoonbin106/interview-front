import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';

export default function PaymentDetails({ data, page, rowsPerPage, totalRows, onPageChange, onRowsPerPageChange }) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (newPage) => {
        onPageChange(null, newPage);
    };

    const handleRowsPerPageChange = (event) => {
        onRowsPerPageChange(event);
        onPageChange(null, 0); // 페이지를 처음으로 초기화
    };

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>결제번호</TableCell>
                            <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>이메일</TableCell>
                            <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>결제일</TableCell>
                            <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>금액</TableCell>
                            <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>상태</TableCell>
                            <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>요금제 유형</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
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
        </Box>
    );
}