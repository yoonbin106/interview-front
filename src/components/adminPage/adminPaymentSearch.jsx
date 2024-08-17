//**adminPaymentSearch */
import React, { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box, TextField, Card, CardContent } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // 최신 버전의 어댑터로 변경
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4A90E2',
        },
    },
});

export default function PaymentSearch({ onSearch }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [planType, setPlanType] = useState('basic');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        onSearch(searchQuery, startDate, endDate, planType);
    };

    return (
        <ThemeProvider theme={theme}>
            <Card sx={{ maxWidth: 600, mt: 5, align: 'left' }}>
                <CardContent>
                    <Box sx={{ mb: 4 }}>
                        <FormControl component="fieldset">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormLabel component="legend" sx={{ mr: -3 }}>　요금제 유형을 선택해주세요.</FormLabel>
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

                        <LocalizationProvider dateAdapter={AdapterDayjs}> {/* 최신 어댑터로 변경 */}
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