import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useRouter } from 'next/router';

const SearchResults = ({ results, allData }) => {
    const [sortedResults, setSortedResults] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (results.length === 0) {
            // 결과가 없을 때 기본 데이터를 자음순으로 정렬
            const sortedDefaultResults = allData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
            setSortedResults(sortedDefaultResults);
        } else {
            setSortedResults(results);
        }
    }, [results, allData]);

    const handleViewDetails = (row) => {
        router.push(`/adminPage/adminUserDetailsPage`); // 특정 게시물의 상세 페이지로 이동
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell>이름</TableCell>
                        <TableCell>성별</TableCell>
                        <TableCell>생년월일</TableCell>
                        <TableCell>핸드폰번호</TableCell>
                        <TableCell>이메일</TableCell>
                        <TableCell>회원정보</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedResults.map((result, index) => (
                        <TableRow key={index}>
                            <TableCell>{result.name}</TableCell>
                            <TableCell>{result.gender}</TableCell>
                            <TableCell>{result.birth}</TableCell>
                            <TableCell>{result.phone}</TableCell>
                            <TableCell>{result.email}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#4A90E2',
                                        '&:hover': {
                                            backgroundColor: '#357ABD',
                                        },
                                    }}
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
    );
};

export default SearchResults;