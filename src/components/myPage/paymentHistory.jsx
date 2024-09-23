import React, { useEffect, useState } from 'react';
import styles from '@/styles/myPage/paymentHistory.module.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import { getPayInfoByUserId } from 'api/user';
import CampaignIcon from '@mui/icons-material/Campaign';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderTop: '2px solid #aaaaaa',
    borderBottom: '2px solid #aaaaaa',
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#eeeeee',
        color: theme.palette.common.black,
        textAlign: 'center',
        padding: '8px',  // 헤더 셀의 패딩을 줄임
        height: 50,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: 'center',
        padding: '8px',  // 바디 셀의 패딩을 줄임
        height: 65,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    height: '18px', // 행 높이를 줄임
}));

const PaymentHistory = observer(() => {
    const { userStore } = useStores();
    const [rows, setRows] = useState([]);
    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const paymentInfo = await getPayInfoByUserId(userStore.id);
                if (paymentInfo) {
                    const newRows = paymentInfo.data.map((info) => ({
                        no: info.orderId || '주문번호가 없습니다.',
                        paymentProduct: info.orderName || '주문내역이 없습니다',
                        paymentMethod: info.payMethod || '결제수단이 없습니다',
                        payment: info.price ? info.price.toString() : '결제금액이 없습니다',
                        date: info.approvedAt ? info.approvedAt.split('T')[0] : '결제일시 정보가 없습니다',
                        useCount: info.useCount != null ? info.useCount.toString() : '사용가능 횟수가 없습니다',
                    }));

                    setRows(newRows); // rows에 여러 항목을 추가
                }

            } catch (error) {
                console.error('결제 정보를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchPaymentInfo();
    }, [userStore]);

    return (
        <section className={styles.formContact}>
            <h1 className={styles.formTitle}>결제 내역</h1>
            <section className={styles.infoBox}>
                <div className={styles.infoHeader}>
                    <CampaignIcon sx={{ fontSize: 40 }} />
                    <span className={styles.infoLabel}>안내</span>
                </div>

                <div className={styles.infoContent}>
                    결제하신 내역을 보실 수 있습니다. <br /> <br />
                    - 결제를 취소하고 싶으시면 문의사항에 문의해주시길 바랍니다. <br />
                    - 횟수를 1번이라도 사용하시면 환불이 불가능한점 유의해주시길 바랍니다. <br />
                    - 환불문의시 주문번호, 상품명, 이메일 적어주시면 환불처리 도와드립니다.
                </div>
            </section>

            <div className={styles.interviewContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, align: 'center' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>주문번호</StyledTableCell>
                                <StyledTableCell>상품명</StyledTableCell>
                                <StyledTableCell>결제수단</StyledTableCell>
                                <StyledTableCell>결제금액</StyledTableCell>
                                <StyledTableCell>결제일시</StyledTableCell>
                                <StyledTableCell>남은횟수</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows && rows.length > 0 ? (
                                rows.map((row) => (
                                    <StyledTableRow key={row.no}>
                                        <StyledTableCell>{row.no}</StyledTableCell>
                                        <StyledTableCell>{row.paymentProduct}</StyledTableCell>
                                        <StyledTableCell>{row.paymentMethod}</StyledTableCell>
                                        <StyledTableCell>{row.payment} 원</StyledTableCell>
                                        <StyledTableCell>{row.date}</StyledTableCell>
                                        <StyledTableCell>{row.useCount}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={6} sx={{ alignContent: 'center' }}>
                                        결제 내역이 존재하지 않습니다.
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        </section>



    );
});

export default PaymentHistory;
