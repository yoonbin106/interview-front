//**adminRefundPage.jsx */
import React, { useState, useEffect } from 'react';
import RefundSearch from '@/components/adminPage/adminRefundSearch';
import RefundDetails from '@/components/adminPage/adminRefundDetails';
import dayjs from 'dayjs';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const sortedData = [
    { refundId: 'refund_id_001', email: 'user1@example.com', refundDate: '2024-08-01', amount: '₩39,000', status: '대기', admin: null, reason: '상품을 받아봤는데 생각보다 품질이 좋지 않아서 환불을 요청합니다. 제품 설명과 실물이 많이 달라서 실망했습니다.' },
    { refundId: 'refund_id_002', email: 'user2@example.com', refundDate: '2024-08-02', amount: '₩49,000', status: '처리중', admin: '관리자1', reason: '저는 원래 주문한 상품과 다른 색상의 제품이 배송되었습니다. 색상 변경이 불가능하다면 환불을 받고 싶습니다.' },
    { refundId: 'refund_id_003', email: 'user3@example.com', refundDate: '2024-08-03', amount: '₩59,000', status: '완료', admin: '관리자2', reason: '상품이 도착했을 때 이미 파손된 상태였습니다. 박스도 찌그러져 있었고, 내부 제품도 손상되어 있어 사용할 수가 없습니다.' },
    { refundId: 'refund_id_004', email: 'user4@example.com', refundDate: '2024-08-04', amount: '₩29,000', status: '대기', admin: null, reason: '배송이 너무 지연되어서 더 이상 기다릴 수 없을 것 같습니다. 환불 요청을 드리니, 빠른 처리 부탁드립니다.' },
    { refundId: 'refund_id_005', email: 'user5@example.com', refundDate: '2024-08-05', amount: '₩39,000', status: '처리중', admin: '관리자1', reason: '주문한 제품이 예상보다 큰 사이즈로 도착해서 환불 요청드립니다. 사이즈 안내가 제대로 되어있지 않았던 것 같습니다.' },
    { refundId: 'refund_id_006', email: 'user6@example.com', refundDate: '2024-08-06', amount: '₩45,000', status: '완료', admin: '관리자2', reason: '제품을 받아보니 사용 흔적이 있어서 새로운 제품이 아닌 것 같습니다. 새 제품으로 교환해 주시거나, 아니면 환불 처리 부탁드립니다.' },
    { refundId: 'refund_id_007', email: 'user7@example.com', refundDate: '2024-07-30', amount: '₩33,000', status: '대기', admin: null, reason: '주문을 잘못해서 다른 제품이 배송되었습니다. 잘못된 주문이기 때문에 환불을 원합니다. 환불 절차 안내 부탁드립니다.' },
    { refundId: 'refund_id_008', email: 'user8@example.com', refundDate: '2024-07-28', amount: '₩55,000', status: '완료', admin: '관리자3', reason: '제품을 사용해보니 설명에 나온 기능이 제대로 작동하지 않습니다. 고객센터에서도 도움을 받을 수 없어서 환불을 요청합니다.' },
    { refundId: 'refund_id_009', email: 'user9@example.com', refundDate: '2024-07-25', amount: '₩29,000', status: '대기', admin: null, reason: '상품 배송 과정에서 문제가 있었던 것 같습니다. 상품이 도착했을 때 패키지가 손상되어 있었고, 그로 인해 제품에도 문제가 생긴 것 같습니다.' },
    { refundId: 'refund_id_010', email: 'user10@example.com', refundDate: '2024-07-20', amount: '₩49,000', status: '처리중', admin: '관리자1', reason: '상품 설명에 적힌 내용과 실제 제품의 기능이 너무 다릅니다. 이렇게 잘못된 정보로 인해 구매를 했기 때문에 환불을 원합니다.' },
    { refundId: 'refund_id_011', email: 'user11@example.com', refundDate: '2024-07-18', amount: '₩39,000', status: '완료', admin: '관리자2', reason: '구매 후 한 번 사용해봤는데, 제품이 제 기대에 미치지 못했습니다. 추가로 발생한 문제는 없었지만, 환불을 원합니다.' },
    { refundId: 'refund_id_012', email: 'user12@example.com', refundDate: '2024-07-16', amount: '₩42,000', status: '대기', admin: null, reason: '제품의 디자인이 생각했던 것과 많이 달랐습니다. 또한, 품질도 기대 이하였기 때문에 반품하고 환불을 요청합니다.' },
    { refundId: 'refund_id_013', email: 'user13@example.com', refundDate: '2024-07-15', amount: '₩35,000', status: '처리중', admin: '관리자1', reason: '다른 브랜드의 유사한 제품을 구입한 후 이 제품이 필요 없다고 판단하여 환불 요청드립니다. 빠른 처리 부탁드립니다.' },
    { refundId: 'refund_id_014', email: 'user14@example.com', refundDate: '2024-07-13', amount: '₩31,000', status: '완료', admin: '관리자2', reason: '배송이 너무 늦어져서 사용하려고 했던 일정에 맞출 수가 없었습니다. 환불 처리를 요청합니다.' },
    { refundId: 'refund_id_015', email: 'user15@example.com', refundDate: '2024-07-10', amount: '₩49,000', status: '대기', admin: null, reason: '제품의 냄새가 너무 강해서 사용하기가 힘들 것 같습니다. 환불 요청 드리니, 빠른 처리 부탁드립니다.' },
    { refundId: 'refund_id_016', email: 'user16@example.com', refundDate: '2024-07-08', amount: '₩55,000', status: '처리중', admin: '관리자3', reason: '색상이 화면에서 본 것과 달라서 매우 실망했습니다. 제품을 반품하고 싶습니다. 환불 절차 안내 부탁드립니다.' },
    { refundId: 'refund_id_017', email: 'user17@example.com', refundDate: '2024-07-05', amount: '₩38,000', status: '완료', admin: '관리자1', reason: '제품의 크기가 제가 예상했던 것보다 너무 작아서 환불을 요청합니다. 제품 크기에 대한 상세 설명이 부족했습니다.' },
    { refundId: 'refund_id_018', email: 'user18@example.com', refundDate: '2024-07-03', amount: '₩32,000', status: '대기', admin: null, reason: '제품을 받고 나서 보니 사용된 흔적이 있어서 매우 불쾌했습니다. 새 제품으로 교환하거나, 환불 처리 부탁드립니다.' },
    { refundId: 'refund_id_019', email: 'user19@example.com', refundDate: '2024-07-01', amount: '₩40,000', status: '처리중', admin: '관리자2', reason: '배송이 예정된 날짜보다 너무 늦어져서 사용 시기를 놓쳤습니다. 따라서, 환불을 요청합니다.' },
    { refundId: 'refund_id_020', email: 'user20@example.com', refundDate: '2024-06-30', amount: '₩50,000', status: '완료', admin: '관리자3', reason: '제품을 사용해봤는데, 작동이 잘 되지 않습니다. 문제가 지속되어 환불을 요청합니다. 빠른 처리 부탁드립니다.' },
];
export default function AdminRefund() {
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);



    useEffect(() => {
        // 여기에 초기 데이터 설정이나 검색 결과 업데이트 로직을 추가할 수 있습니다.
        // const sortedData = []; // 여기에 초기 데이터가 있을 경우 처리
        setSearchResults(sortedData);
    }, []);

    const handleSearch = (searchQuery, startDate, endDate, status) => {
        const query = searchQuery.toLowerCase();

        const filtered = searchResults.filter((item) => {
            const matchesStatus = status ? item.status === status : true;

            const matchesDateRange = (!startDate || dayjs(item.refundDate).isAfter(dayjs(startDate).subtract(1, 'day'))) &&
                                      (!endDate || dayjs(item.refundDate).isBefore(dayjs(endDate).add(1, 'day')));

            const matchesSearchQuery = searchQuery === '' ||
                                        item.refundId.toLowerCase().includes(query) ||
                                        item.email.toLowerCase().includes(query);

            return matchesStatus && matchesDateRange && matchesSearchQuery;
        }).sort((a, b) => dayjs(b.refundDate) - dayjs(a.refundDate));

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
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <h3>환불 관리</h3>
                        <RefundSearch onSearch={handleSearch} />
                        <div style={{ flexGrow: 1 }}>
                            <RefundDetails 
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
            </div>
        </LocalizationProvider>
    );
}