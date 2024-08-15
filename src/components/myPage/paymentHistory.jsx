import React from 'react';
import styles from '@/styles/myPage/paymentHistory.module.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

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
    { no: 1, paymentProduct: '상품명', paymentMethod: '핸드폰결제', payment: '10,000', date: '2024-01-01', detail: <ManageSearchIcon/>, url: '1111' },
    { no: 2, paymentProduct: '상품명', paymentMethod: '핸드폰결제', payment: '10,000', date: '2024-01-01', detail: <ManageSearchIcon/>, url: '2222' },
    { no: 3, paymentProduct: '상품명', paymentMethod: '핸드폰결제', payment: '10,000', date: '2024-01-01', detail: <ManageSearchIcon/>, url: '3333' }
];


const PaymentHistory = () => {

    const handleRowClick = (url) => {
        if (typeof window !== 'undefined') {
            window.location.href = url; // 클릭한 행의 링크로 이동
        }
    };

    return (
        <section className={styles.formContact}>
            <h1 className={styles.formTitle}>결제 내역</h1>
            <section className={styles.infoBox}>
                <div className={styles.infoHeader}>
                    <span className={styles.infoLabel}>안내</span>
                </div>
                <p className={styles.infoContent}>
                    ㅁㄴㅇㅁㄴㅇ <br /> <br />
                    - ㅁㄴㅇㅁㄴㅇ <br />
                    - ㅁㄴㅇㅁㄴㅇ <br />
                    - ㅁㄴㅇㅁㄴㅇ
                </p>
            </section>

            <div className={styles.interviewContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, height: 350, align: 'center' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>결제번호</StyledTableCell>
                                <StyledTableCell>상품명</StyledTableCell>
                                <StyledTableCell>결제수단</StyledTableCell>
                                <StyledTableCell>결제금액</StyledTableCell>
                                <StyledTableCell>결제일시</StyledTableCell>
                                <StyledTableCell>상세보기</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (

                                <StyledTableRow key={row.no} onClick={() =>
                                    handleRowClick(row.url)}  // 각 행에 클릭 이벤트 추가
                                    style={{ cursor: 'pointer' }}  // 행에 마우스를 올리면 포인터로 변경
                                >

                                    <StyledTableCell>{row.no}</StyledTableCell>
                                    <StyledTableCell>{row.paymentProduct}</StyledTableCell>
                                    <StyledTableCell>{row.paymentMethod}</StyledTableCell>
                                    <StyledTableCell>{row.payment} 원</StyledTableCell>
                                    <StyledTableCell>{row.date}</StyledTableCell>
                                    <StyledTableCell>{row.detail}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        </section>



    );
};

export default PaymentHistory;
