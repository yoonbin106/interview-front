//**adminPaymentPage.jsx */
import React, { useState, useEffect } from 'react';
import PaymentSearch from '@/components/adminPage/adminPaymentSearch';
import PaymentDetails from '@/components/adminPage/adminPaymentDetails';
import dayjs from 'dayjs';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // 최신 버전에서는 AdapterDayjs 사용


export default function AdminPayment() {
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const paymentData = [
        { paymentId: 'order_id_001', email: 'user1@example.com', paymentDate: '2024-08-01', amount: '₩39,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_002', email: 'user2@example.com', paymentDate: '2024-08-02', amount: '₩49,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_003', email: 'user3@example.com', paymentDate: '2024-08-03', amount: '₩59,000', status: '취소', planType: '베이직' },
        { paymentId: 'order_id_004', email: 'user4@example.com', paymentDate: '2024-08-04', amount: '₩29,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_005', email: 'user5@example.com', paymentDate: '2024-08-05', amount: '₩39,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_006', email: 'user6@example.com', paymentDate: '2024-08-06', amount: '₩45,000', status: '취소', planType: '프리미엄' },
        { paymentId: 'order_id_007', email: 'user7@example.com', paymentDate: '2024-07-30', amount: '₩33,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_008', email: 'user8@example.com', paymentDate: '2024-07-28', amount: '₩55,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_009', email: 'user9@example.com', paymentDate: '2024-07-25', amount: '₩29,000', status: '취소', planType: '베이직' },
        { paymentId: 'order_id_010', email: 'user10@example.com', paymentDate: '2024-07-15', amount: '₩49,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_011', email: 'user11@example.com', paymentDate: '2024-08-10', amount: '₩35,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_012', email: 'user12@example.com', paymentDate: '2024-08-09', amount: '₩39,000', status: '취소', planType: '프리미엄' },
        { paymentId: 'order_id_013', email: 'user13@example.com', paymentDate: '2024-08-07', amount: '₩42,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_014', email: 'user14@example.com', paymentDate: '2024-07-22', amount: '₩31,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_015', email: 'user15@example.com', paymentDate: '2024-08-11', amount: '₩49,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_016', email: 'user16@example.com', paymentDate: '2024-07-12', amount: '₩55,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_017', email: 'user17@example.com', paymentDate: '2024-07-18', amount: '₩38,000', status: '취소', planType: '베이직' },
        { paymentId: 'order_id_018', email: 'user18@example.com', paymentDate: '2024-07-08', amount: '₩32,000', status: '승인', planType: '프리미엄' },
        { paymentId: 'order_id_019', email: 'user19@example.com', paymentDate: '2024-07-03', amount: '₩40,000', status: '승인', planType: '베이직' },
        { paymentId: 'order_id_020', email: 'user20@example.com', paymentDate: '2024-06-30', amount: '₩50,000', status: '취소', planType: '프리미엄' },
    ];

    useEffect(() => {
        //초기 데이터는 날짜 최신순으로 정렬하여 설정
        const sortedData = [...paymentData].sort((a,b)=>dayjs(b.paymentDate)-dayjs(a.paymentDate));
        setSearchResults(sortedData);
    }, []);

    const handleSearch = (searchQuery, startDate, endDate, planType) => {
        const query = searchQuery.toLowerCase();

        const filtered = paymentData.filter((item) => {
            const matchesPlanType = planType ? item.planType === planType : true;

            const matchesDateRange = (!startDate || dayjs(item.paymentDate).isAfter(dayjs(startDate).subtract(1, 'day'))) &&
                                      (!endDate || dayjs(item.paymentDate).isBefore(dayjs(endDate).add(1, 'day')));

            const matchesSearchQuery = searchQuery === '' || 
                                        item.paymentId.toLowerCase().includes(query) || 
                                        item.email.toLowerCase().includes(query);

            return matchesPlanType && matchesDateRange && matchesSearchQuery;
        }).sort((a, b) => dayjs(b.paymentDate) - dayjs(a.paymentDate));

        setSearchResults(filtered);
        setPage(0); // 검색 후 첫 페이지로 이동
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <NestedList />
                </div>
                <div className={styles.content}>
                    <div>
                        <h3>　결제내역 관리</h3>
                        <PaymentSearch onSearch={handleSearch} />
                        <PaymentDetails 
                        data={searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} 
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalRows={searchResults.length}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage} 
                        />
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
}