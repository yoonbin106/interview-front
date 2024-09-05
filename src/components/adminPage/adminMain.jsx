//adminMain.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminMain.module.css';
import dynamic from 'next/dynamic';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { ListItemIcon } from '@mui/material';
import axios from 'axios';

// AdminMainCharts 컴포넌트를 동적 로딩으로 가져온다.
const AdminMainCharts = dynamic(() => import('@/components/adminPage/adminMainCharts'),{ssr:false});

const AdminMain = () => {
    const [currentFormattedDate, setCurrentFormattedDate] = useState(''); // 현재 날짜를 포맷팅하여 저장하는 상태 변수
    const [notice, setNotice] = useState([]); // 전체 공지사항 데이터를 저장하는 상태 변수
    const [adminNotice, setAdminNotice] = useState([]); // 관리자 공지사항 데이터를 저장하는 상태 변수

    // 날짜 포맷팅 및 초기화: 클라이언트 사이드에서만 실행
    useEffect(() => {
        // 날짜를 포맷팅하는 함수
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        const now = new Date(); // 현재 날짜와 시간을 가져옴
        setCurrentFormattedDate(formatDate(now.toISOString())); // 포맷된 날짜를 상태로 설정

       //공지사항 데이터 가져오기
       const fetchNotice = async() => {
        try{
            const response = await axios.get('http://localhost:8080/api/notice');//전체 공지사항
            const sortedNotice = response.data
                    .sort((a, b) => new Date(b.noticeCreatedTime) - new Date(a.noticeCreatedTime)) // 날짜 내림차순 정렬
                    .slice(0, 5); // 상위 10개만 가져오기
                setNotice(sortedNotice);
        } catch(error){
            console.error('공지사항 데이터를 가져오는 중 오류가 발생했습니다:', error);
        };
       };
       //관리자 공지사항 데이터 가져오기
       const fetchAdminNotice = async () =>{
        try {
            const response = await axios.get('http://localhost:8080/api/adminnotice');
            const sortedAdminNotice = response.data
            .sort((a, b) => new Date(b.noticeCreatedTime) - new Date(a.noticeCreatedTime)) // 날짜 내림차순 정렬
            .slice(0, 5); // 상위 10개만 가져오기
        setAdminNotice(sortedAdminNotice);
        } catch (error){
            console.error('관리자 공지사항 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
       };
       fetchNotice();
       fetchAdminNotice();
    }, []);

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
            </div>
            <div className={sidebar.content}>
                <Container fluid className={styles.adminMainContainerFluid}>
                    <Row className={styles.adminMainContent}>
                        <Col className={styles.adminMainColPadding}>
                            <div className={styles.adminMainTitleContainer}>
                                <ListItemIcon>
                                <HomeTwoToneIcon sx={{fontSize:60, color:'#5A8AF2'}} />
                                </ListItemIcon>
                                <h2 className={styles.adminMainTitle}>𝐌𝐚𝐢𝐧 𝐀𝐝𝐦𝐢𝐧𝐏𝐚𝐠𝐞</h2>
                            </div>
                            <hr className={styles.adminMainTitleDivider} />
                            {/* 사이트 종합 정보 카드 */}
                            <Card className={styles.infoCard}>
                                <Card.Header className={styles.infoCardHeader}>
                                    {currentFormattedDate} 사이트 종합 정보
                                </Card.Header>
                                <Card.Body>
                                    <div className={styles.infoTableContainer}>
                                        <div className={styles.infoTableColumn}>
                                            <AdminMainCharts chartType="signup" />
                                        </div>
                                        <div className={styles.infoTableColumn}>
                                            <AdminMainCharts chartType="activeUsers" />
                                        </div>
                                        </div>
                                </Card.Body>
                            </Card>

                            {/* 전체 공지사항 테이블 */}
                            <Card className={styles.adminMainCard}>
                                <Card.Header className={`${styles.adminMainCardHeader} ${styles.adminMainMainHeader}`}>
                                    전체 공지사항
                                </Card.Header>
                                <Card.Body>
                                    {notice.length > 0 ? (
                                        <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Table bordered hover={false} className={styles.adminMainTable}>
                                                <thead>
                                                    <tr>
                                                        <th className={styles.adminMainTableHeader}>글 번호</th>
                                                        <th className={styles.adminMainTableHeader}>제목</th>
                                                        <th className={styles.adminMainTableHeader}>내용</th>
                                                        <th className={styles.adminMainTableHeader}>작성날짜</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {notice.map((row) => (
                                                        <tr key={row.noticeId} style={{cursor:'pointer'}}>
                                                           <td align="center">{row.noticeId}</td>
                                                           <td align="center" className={styles.adminNoticeTitleCell}>
                                                            {row.noticeTitle}
                                                           </td>
                                                            <td align="center">{row.user.username}</td>
                                                            <td align="center">
                                                                {new Date(row.noticeCreatedTime).toLocaleString('ko-KR',{
                                                                     year: 'numeric',
                                                                     month: '2-digit',
                                                                     day: '2-digit',
                                                                     hour: '2-digit',
                                                                     minute: '2-digit',

                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <p className={styles.adminMainCardBodyP}>공지사항이 없습니다</p>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* 관리자 공지사항 테이블 */}
                            <Card className={styles.adminMainCard}>
                                <Card.Header className={`${styles.adminMainCardHeader} ${styles.adminMainMainHeader}`}>
                                    관리자 공지사항
                                </Card.Header>
                                <Card.Body>
                                    {adminNotice.length > 0 ? (
                                        <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Table bordered hover={false} className={styles.adminMainTable}>
                                                <thead>
                                                    <tr>
                                                        <th className={styles.adminMainTableHeader}>글 번호</th>
                                                        <th className={styles.adminMainTableHeader}>제목</th>
                                                        <th className={styles.adminMainTableHeader}>내용</th>
                                                        <th className={styles.adminMainTableHeader}>작성날짜</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminNotice.map((row) => (
                                                        <tr key={row.adminNoticeId} style={{cursor:'pointer'}}>
                                                            <td align="center">{row.adminNoticeId}</td>
                                                            <td align="center">{row.adminNoticeTitle}</td>
                                                            <td align="center">{row.user.username}</td>
                                                            <td align="center">
                                                            {new Date(row.adminNoticeCreatedTime).toLocaleString('ko-KR', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                            })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <p className={styles.adminMainCardBodyP}>관리자 공지사항이 없습니다</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default AdminMain;