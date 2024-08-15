import React, { useState } from 'react';
import { Box, Button, TextField, Card, CardContent, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const theme = createTheme({
    palette:{
        primary: {
            main: '#4A90E2',
        }
    }
});

export default function RefundSearch({ onSearch }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [refundStatus, setRefundStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        onSearch(searchQuery, startDate, endDate, refundStatus);
    };

    return (
        <ThemeProvider theme={theme}>
            <Card sx={{ maxWidth: 600, mt: 5, textAlign: 'left' }}>
                <CardContent>
                    <Box sx={{ mb: 4 }}>
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

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        </LocalizationProvider>

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
    );
}