import React from 'react';
import styles from '@/styles/myPage/interviewHistory.module.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textAlign: 'center',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: 'center',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const rows = [
    { no: 1, title: '제목1', content: 'content', date: '2024-01-01', url: '1111' },
    { no: 2, title: '제목2', content: 'content', date: '2024-01-01', url: '2222' },
    { no: 3, title: '제목3', content: 'content', date: '2024-01-01', url: '3333' }
];


const InquiryHistory = () => {

    const handleRowClick = (url) => {
        if (typeof window !== 'undefined') {
            window.location.href = url; // 클릭한 행의 링크로 이동
        }
      };

    return (
        <section className={styles.formContact}>
            <h1 className={styles.formTitle}>Q&A 내역</h1>
            

            <div className={styles.interviewContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, height: 350, align: 'center' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>번호</StyledTableCell>
                                <StyledTableCell>제목</StyledTableCell>
                                <StyledTableCell>내용</StyledTableCell>
                                <StyledTableCell>작성일</StyledTableCell>
                                {/* <StyledTableCell>상세보기</StyledTableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                
                                <StyledTableRow key={row.no} onClick={() => 
                                    handleRowClick(row.url)}  // 각 행에 클릭 이벤트 추가
                                    style={{ cursor: 'pointer' }}  // 행에 마우스를 올리면 포인터로 변경
                                >
                                    
                                    <StyledTableCell>{row.no}</StyledTableCell>
                                    <StyledTableCell>{row.title}</StyledTableCell>
                                    <StyledTableCell>{row.content}</StyledTableCell>
                                    <StyledTableCell>{row.date}</StyledTableCell>
                                    {/* <StyledTableCell>{row.detail}</StyledTableCell> */}
                                    
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        </section>



    );
};

export default InquiryHistory;