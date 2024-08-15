import React from 'react';
import styles from '@/styles/myPage/boardPosts.module.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '@mui/material/Pagination';

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
    { no: 1, thumnail: 'test', title: 'tttt', date: '2024-01-01', url: '1111', detail: <CloseIcon/>},
    { no: 2, thumnail: 'test', title: 'tttt', date: '2024-01-01', url: '2222', detail: <CloseIcon/> },
    { no: 3, thumnail: 'test', title: 'tttt', date: '2024-01-01', url: '3333', detail: <CloseIcon/> },
    { no: 4, thumnail: 'test', title: 'tttt', date: '2024-01-01', url: '3333', detail: <CloseIcon/> },
    { no: 5, thumnail: 'test', title: 'tttt', date: '2024-01-01', url: '3333', detail: <CloseIcon/> }
];


const BoardPosts = () => {
    
    const handleRowClick = (url) => {
        if (typeof window !== 'undefined') {
            window.location.href = url; // 클릭한 행의 링크로 이동
        }
    };
    return (
        <section className={styles.formContact}>
            <h1 className={styles.formTitle}>작성글/댓글 조회</h1>
            
            <h5 className={styles.formSubTitle}>작성글 내역</h5>

            <div className={styles.tableContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, height: 200, align: 'center' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>번호</StyledTableCell>
                                <StyledTableCell>제목</StyledTableCell>
                                <StyledTableCell>작성일</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                
                                <StyledTableRow key={row.no}>
                                    
                                    <StyledTableCell>{row.no}</StyledTableCell>
                                    <StyledTableCell  onClick={() => 
                                        handleRowClick(row.url)}  // 각 행에 클릭 이벤트 추가
                                        style={{ cursor: 'pointer' }}  // 행에 마우스를 올리면 포인터로 변경
                                    >
                                        {row.title} 
                                    </StyledTableCell>
                                    <StyledTableCell>{row.date}</StyledTableCell>
                                    <StyledTableCell>{row.detail}</StyledTableCell>
                                    
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <div className={styles.tablePagination}>
                <Pagination  count={5} shape="rounded" />
            </div>
            





            <h5 className={styles.formSubTitle}>댓글 내역</h5>

            <div className={styles.tableContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, height: 200, align: 'center' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>번호</StyledTableCell>
                                <StyledTableCell>내용</StyledTableCell>
                                <StyledTableCell>작성일</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                
                                <StyledTableRow key={row.no}>
                                    
                                    <StyledTableCell>{row.no}</StyledTableCell>
                                    <StyledTableCell  onClick={() => 
                                        handleRowClick(row.url)}  // 각 행에 클릭 이벤트 추가
                                        style={{ cursor: 'pointer' }}  // 행에 마우스를 올리면 포인터로 변경
                                    >
                                        {row.title} 
                                    </StyledTableCell>
                                    <StyledTableCell>{row.date}</StyledTableCell>
                                    <StyledTableCell>{row.detail}</StyledTableCell>
                                    
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
            </div>
            <div className={styles.tablePagination}>
                    <Pagination count={2} shape="rounded" />
            </div>
        </section>



    );
};

export default BoardPosts;