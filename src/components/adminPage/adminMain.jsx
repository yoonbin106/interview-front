//adminMain.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminMain.module.css';
import dynamic from 'next/dynamic';

// AdminMainCharts 컴포넌트를 동적 로딩으로 가져온다.
const AdminMainCharts = dynamic(() => import('@/components/adminPage/adminMainCharts'),{ssr:false});

const AdminMain = () => {
    const [currentFormattedDate, setCurrentFormattedDate] = useState(''); // 현재 날짜를 포맷팅하여 저장하는 상태 변수
    const [announcements, setAnnouncements] = useState([]); // 전체 공지사항 데이터를 저장하는 상태 변수
    const [adminAnnouncements, setAdminAnnouncements] = useState([]); // 관리자 공지사항 데이터를 저장하는 상태 변수

    // 날짜 포맷팅 및 초기화: 클라이언트 사이드에서만 실행
    useEffect(() => {
        // 날짜를 포맷팅하는 함수
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        const now = new Date(); // 현재 날짜와 시간을 가져옴
        setCurrentFormattedDate(formatDate(now.toISOString())); // 포맷된 날짜를 상태로 설정

        // 하드코딩된 공지사항 데이터 설정
        const hardcodedAnnouncements = [
            {
                noticeNo: 71,
                noticeTitle: '새로운 기능 업데이트',
                noticeContent: '이번 주에 새로운 기능이 업데이트 되었습니다.',
                noticeCreatedTime: '2024-08-08 T10:00:00Z',
            },
            {
                noticeNo: 70,
                noticeTitle: '정기 점검 안내',
                noticeContent: '다음 주 정기 점검이 있을 예정입니다.',
                noticeCreatedTime: '2024-08-08 T12:00:00Z',
            },
            {
                noticeNo: 69,
                noticeTitle: '보안 패치',
                noticeContent: '최근 보안 패치가 적용되었습니다.',
                noticeCreatedTime: '2024-08-07 T14:00:00Z',
            },
            {
                noticeNo: 68,
                noticeTitle: '서비스 이용 안내',
                noticeContent: '서비스 이용에 관한 안내입니다.',
                noticeCreatedTime: '2024-08-06 T16:00:00Z',
            },
            {
                noticeNo: 67,
                noticeTitle: '이벤트 안내',
                noticeContent: '다음 주 이벤트 안내입니다.',
                noticeCreatedTime: '2024-08-05 T18:00:00Z',
            }
        ];
        setAnnouncements(hardcodedAnnouncements); // 전체 공지사항 데이터를 설정

        const hardcodedAdminAnnouncements = [
            {
                adminNoticeNo: 18,
                adminTitle: '관리자 회의',
                adminContent: '이번 주 관리자 회의가 있습니다.',
                noticeCreatedTime: '2024-08-03 T10:00:00Z',
            },
            {
                adminNoticeNo: 17,
                adminTitle: '서버 점검',
                adminContent: '서버 점검 일정이 공지되었습니다.',
                noticeCreatedTime: '2024-08-03 T12:00:00Z',
            },
            {
                adminNoticeNo: 16,
                adminTitle: '데이터 백업',
                adminContent: '정기 데이터 백업이 예정되어 있습니다.',
                noticeCreatedTime: '2024-08-03 T14:00:00Z',
            },
            {
                adminNoticeNo: 15,
                adminTitle: '신규 직원 교육',
                adminContent: '신규 직원 교육 일정입니다.',
                noticeCreatedTime: '2024-08-02 T16:00:00Z',
            },
            {
                adminNoticeNo: 14,
                adminTitle: '정책 변경',
                adminContent: '새로운 정책 변경 사항이 있습니다.',
                noticeCreatedTime: '2024-08-01 T18:00:00Z',
            }
        ];
        setAdminAnnouncements(hardcodedAdminAnnouncements); // 관리자 공지사항 데이터를 설정

    }, []);

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
            </div>
            <div className={sidebar.content}>
                <Container fluid className={styles.adminMainContainerFluid}>
                    <Row className={styles.adminMainContent}>
                        <h2 className={styles.adminMainTitle}>관리자페이지 홈</h2>
                        <Col className={styles.adminMainColPadding}>
                            
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
                                    {announcements.length > 0 ? (
                                        <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Table bordered hover={false} className={styles.adminMainTable}>
                                                <thead>
                                                    <tr>
                                                        <th className={styles.adminMainTableHeader}>번호</th>
                                                        <th className={styles.adminMainTableHeader}>제목</th>
                                                        <th className={styles.adminMainTableHeader}>내용</th>
                                                        <th className={styles.adminMainTableHeader}>게시날짜</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {announcements.map((announcement, index) => (
                                                        <tr key={index}>
                                                            <td>{announcement.noticeNo}</td>
                                                            <td>{announcement.noticeTitle}</td>
                                                            <td>{announcement.noticeContent}</td>
                                                            <td>{announcement.noticeCreatedTime}</td>
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
                                    {adminAnnouncements.length > 0 ? (
                                        <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Table bordered hover={false} className={styles.adminMainTable}>
                                                <thead>
                                                    <tr>
                                                        <th className={styles.adminMainTableHeader}>번호</th>
                                                        <th className={styles.adminMainTableHeader}>제목</th>
                                                        <th className={styles.adminMainTableHeader}>내용</th>
                                                        <th className={styles.adminMainTableHeader}>게시날짜</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminAnnouncements.map((announcement, index) => (
                                                        <tr key={index}>
                                                            <td>{announcement.adminNoticeNo}</td>
                                                            <td>{announcement.adminTitle}</td>
                                                            <td>{announcement.adminContent}</td>
                                                            <td>{announcement.noticeCreatedTime}</td>
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