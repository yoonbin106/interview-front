//adminUser.jsx

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminUser.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import axios from 'axios';

const AdminUser = ({ allData }) => {
    const [searchCondition, setSearchCondition] = useState(''); // 검색 조건 상태 관리
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [sortedResults, setSortedResults] = useState([]); // 정렬된 결과 상태 관리
    const [page, setPage] = useState(0); // 현재 페이지 상태 관리
    const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지 당 표시할 항목 수 상태 관리
    const [totalUsers, setTotalUsers] = useState(0); //회원 수 상태 추가
    const router = useRouter(); // 페이지 이동을 위한 Next.js useRouter 사용

    //회원 수 가져오는 API 호출
    useEffect(() => {
        const fetchUserCount = async () => {
            try{
                const response = await axios.get('http://localhost:8080/api/auth/users/count');
                setTotalUsers(response.data);//회원 수 설정
            } catch(error){
                console.error('Error fetching user count:', error);
            }
        };
        fetchUserCount();
    }, []);

    // 컴포넌트가 처음 렌더링될 때 데이터 정렬 및 초기화
    useEffect(() => {
        if (sortedResults.length === 0 && searchTerm === '') {
            const sortedDefaultResults = allData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
            setSortedResults(sortedDefaultResults); // 이름 기준으로 정렬된 초기 데이터 설정
        }
    }, [sortedResults, searchTerm, allData]);

    // 검색 조건 변경 핸들러
    const handleConditionChange = (event) => {
        setSearchCondition(event.target.value);
    };

    // 검색어 변경 핸들러
    const handleTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 기능: 조건에 따라 데이터를 필터링
    const handleSearch = (searchCondition, searchTerm) => {
        const filteredResults = allData.filter((item) => {
            if (searchCondition === 'email') {
                return item.email.includes(searchTerm); // 이메일로 필터링
            } else if (searchCondition === 'phonelastnumber4') {
                return item.phone.slice(-4) === searchTerm; // 핸드폰번호 마지막 4자리로 필터링
            }
            return false;
        });
        setSortedResults(filteredResults); // 필터링된 결과 설정
        setPage(0); // 검색 후 첫 페이지로 이동
    };

    // 검색 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();
        handleSearch(searchCondition, searchTerm); // 검색 실행
    };

    // 상세보기 버튼 클릭 시 페이지 이동 핸들러
    const handleViewDetails = (email) => {
        router.push(`/adminPage/adminUserDetailsPage/${email}`); // 상세보기 페이지로 이동
    };

    // 다음 페이지로 이동하는 핸들러
    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // 이전 페이지로 이동하는 핸들러
    const handlePreviousPage = () => {
        setPage((prevPage) => prevPage - 1);
    };

    const totalPages = Math.ceil(sortedResults.length / rowsPerPage); // 전체 페이지 수 계산

 
    return (
        <Box className={styles.adminUserContainer}>
            <Box display="flex" alignItems="center">
                <GroupTwoToneIcon sx={{ fontSize: 60, color: '#5A8AF2', marginRight: '8px' }} />
                <Typography variant="h3" gutterBottom>
                    𝐒𝐞𝐚𝐫𝐜𝐡 𝐔𝐬𝐞𝐫
                </Typography>
            </Box>
           
            <div>
            <Divider sx={{ my: 2, borderBottomWidth: 3,  borderColor: '#999' }} /> 
            </div>
    
            {/* 검색 폼 */}
            <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2, minWidth: 120, marginTop:3,}}>
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
                 {/*회원 수 출력*/}
            <Typography variant="h6" gutterBottom>
                [전체 회원 수] : {totalUsers} 명
            </Typography>
            {/* 회원정보 테이블 */}
            <TableContainer component={Paper} className={styles.adminUserTableContainer}>
                <Table className={styles.adminUserTable}>
                    <TableHead className={styles.adminUserTableHead}>
                        <TableRow>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>이름</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>이메일</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>성별</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>생년월일</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>핸드폰번호</TableCell>
                            <TableCell align="center" className={styles.adminUserTableHeaderCell}>회원정보</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((result, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.name}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.email}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.gender}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.birth}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>{result.phone}</TableCell>
                                <TableCell align="center" className={styles.adminUserTableBodyCell}>
                                    <Button
                                        variant="contained"
                                        className={styles.adminUserViewDetailsButton}
                                        onClick={() => handleViewDetails(result.email)}
                                    >
                                        상세보기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    
            {/* 커스텀 페이지네이션 */}
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