//**adminMain.jsx*/
import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Card } from 'react-bootstrap';
//import { getNotices, getAdminNotices } from '../../api/axios';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminMain.module.css';

const AdminMain = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [adminAnnouncements, setAdminAnnouncements] = useState([]);

    useEffect(() => {
        //하드코딩
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
        setAnnouncements(hardcodedAnnouncements);

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
        setAdminAnnouncements(hardcodedAdminAnnouncements);
    }, []);
      
    /*
    useEffect(() => {
        const fetchNotices = async () => {
            console.log("Fetching announcements...");
            try {
                const data = await getNotices();
                console.log("Announcements fetched:", data);
                const sortedAnnouncements = data.sort((a, b) => b.noticeNo - a.noticeNo);
                setAnnouncements(sortedAnnouncements.slice(0, 5));
            } catch (error) {
                console.error("There was an error fetching the announcements!", error);
            }
        };
        fetchNotices();
    }, []);

    useEffect(() => {
        const fetchAdminNotices = async () => {
            console.log("Fetching admin announcements...");
            try {
                const data = await getAdminNotices();
                console.log("Admin announcements fetched:", data);
                const sortedAdminAnnouncements = data.sort((a, b) => b.adminNoticeNo - a.adminNoticeNo);
                setAdminAnnouncements(sortedAdminAnnouncements.slice(0, 5));
            } catch (error) {
                console.error("There was an error fetching the admin announcements!", error);
            }
        };
        fetchAdminNotices();
    }, []);
*/
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric',weekday: 'long', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const currentFormattedDate = formatDate(new Date().toISOString());
    return <>
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList/>
            </div>
            <div className={sidebar.content}>
                <Container fluid className={styles.adminMainContainerFluid}> {/* styles 적용 */}
                    <Row className={`${styles.adminMainContent}`}> {/* styles 적용 */}
                        <h2 className="adminPageTitle">관리자페이지 홈</h2>
                        <Col className={styles.adminMainColPadding}> {/* styles 적용 */}
                            <Card className={styles.adminMainCard}> {/* 추가된 카드, styles 적용 */}
                                <Card.Header className={`${styles.adminMainCardHeader} ${styles.adminMainMainHeader}`}> {/* styles 적용 */}
                                {currentFormattedDate} 사이트 종합 정보
                                </Card.Header>
                                <Card.Body>
                                <div className={styles.adminMainTableContainer}>
                                    <div className={styles.adminMainTableColumn}>
                                        <div>오늘의 가입회원</div>
                                        <div>: 2000명</div>
                                    </div>
                                    <div className={styles.adminMainTableColumn}>
                                        <div>현재 사이트 접속자 수</div>
                                        <div>: 732명</div>
                                    </div>
                                    <div className={styles.adminMainTableColumn}>
                                        <div>회원의 평균 체류 시간</div>
                                        <div>: 78분</div>
                                    </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className={styles.adminMainCard}> {/* styles 적용 */}
                                <Card.Header className={`${styles.adminMainCardHeader} ${styles.adminMainMainHeader}`}> {/* styles 적용 */}
                                    전체 공지사항
                                </Card.Header>
                                <Card.Body>
                                    {announcements.length > 0 ? (
                                        <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Table bordered hover={false} className={styles.adminMainTable}> {/* styles 적용 */}
                                                <thead>
                                                    <tr>
                                                        <th className={styles.adminMainTableHeader}>번호</th> {/* styles 적용 */}
                                                        <th className={styles.adminMainTableHeader}>제목</th> {/* styles 적용 */}
                                                        <th className={styles.adminMainTableHeader}>내용</th> {/* styles 적용 */}
                                                        <th className={styles.adminMainTableHeader}>게시날짜</th> {/* styles 적용 */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {announcements.map((announcement, index) => (
                                                        <tr key={index}>
                                                            <td>{announcement.noticeNo}</td>
                                                            <td>{announcement.noticeTitle}</td>
                                                            <td>{announcement.noticeContent}</td>
                                                            <td>{(announcement.noticeCreatedTime)}</td>
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

                            <Card className={styles.adminMainCard}> {/* styles 적용 */}
                                <Card.Header className={`${styles.adminMainCardHeader} ${styles.adminMainMainHeader}`}> {/* styles 적용 */}
                                    관리자 공지사항
                                </Card.Header>
                                <Card.Body>
                                    {adminAnnouncements.length > 0 ? (
                                        <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Table bordered hover={false} className={styles.adminMainTable}> {/* styles 적용 */}
                                                <thead>
                                                    <tr>
                                                        <th className={styles.adminMainTableHeader}>번호</th> {/* styles 적용 */}
                                                        <th className={styles.adminMainTableHeader}>제목</th> {/* styles 적용 */}
                                                        <th className={styles.adminMainTableHeader}>내용</th> {/* styles 적용 */}
                                                        <th className={styles.adminMainTableHeader}>게시날짜</th> {/* styles 적용 */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminAnnouncements.map((announcement, index) => (
                                                        <tr key={index}>
                                                            <td>{announcement.adminNoticeNo}</td>
                                                            <td>{announcement.adminTitle}</td>
                                                            <td>{announcement.adminContent}</td>
                                                            <td>{(announcement.noticeCreatedTime)}</td>
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
    </>
}

export default AdminMain;