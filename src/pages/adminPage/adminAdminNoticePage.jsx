//**adminAdminNoticePage.jsx
import styles from '@/styles/adminPage/adminPage.module.css';
import React, { useState } from 'react';
import RegisterButton from '@/components/adminPage/adminRegisterButton';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AdminNoticeTable from '@/components/adminPage/adminAdminNoticeTable';
import NestedList from '@/components/adminPage/adminSideMenu';

const AdminNotice = () => {
    // 하드코딩된 공지사항 데이터
    const adminNotices = [
        { id: 12, title: '시스템 유지보수 안내 (9/30)', author: 'admin123', date: '2024-09-20' },
        { id: 11, title: '시스템 긴급 점검 안내 (8월 15일)', author: 'admin1004', date: '2024-08-11' },
        { id: 10, title: '회원 등급별 혜택 확대 안내', author: 'admin1107', date: '2024-08-10' },
        { id: 9, title: '보안 강화 관련 공지사항', author: 'admin123', date: '2024-08-09' },
        { id: 8, title: '신규 서비스 출시 안내', author: 'admin1004', date: '2024-08-08' },
        { id: 7, title: '고객센터 운영 시간 변경 안내', author: 'admin1107', date: '2024-08-07' },
        { id: 6, title: '8월 이벤트 당첨자 발표', author: 'admin123', date: '2024-08-06' },
        { id: 5, title: '2024년 상반기 결산 보고서', author: 'admin1004', date: '2024-08-05' },
        { id: 4, title: '서비스 이용약관 변경 안내', author: 'admin1107', date: '2024-08-04' },
        { id: 3, title: '2024년 고객 만족도 조사 결과 발표', author: 'admin123', date: '2024-08-03' },
        { id: 2, title: '긴급 서버 점검 안내 (8월 10일)', author: 'admin1004', date: '2024-08-02' },
        { id: 1, title: '개인정보 처리방침 변경 안내', author: 'admin1107', date: '2024-08-01' },
    ];

    // 검색 상태 관리
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNotices, setFilteredNotices] = useState(adminNotices);  // 초기 필터된 데이터는 전체 공지사항 데이터

    // 검색 카테고리 변경 핸들러
    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm(''); // 카테고리 변경 시 검색어 초기화
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = adminNotices.filter(item => {
            if (searchCategory === 'title') {
                return item.title.toLowerCase().includes(lowercasedFilter);
            }
            if (searchCategory === 'author') {
                return item.author.toLowerCase().includes(lowercasedFilter);
            }
            return false;
        });
        setFilteredNotices(filteredData);
    };

    return <>
    <div className={styles.container}>
        <div className={styles.sidebar}>
            <NestedList/>
        </div>
        <div className={styles.content}>
            <div style={{ position: 'relative', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{margin: 15, whiteSpace: 'nowrap'}}>관리자 공지사항</h2>
                        <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}}>
                             {/* 공지사항 등록 버튼 */}
                            <RegisterButton to="/adminPage/adminNoticeRegisterPage" />
                        </div>
                    </div>
                    <AdminNoticeTable rows={filteredNotices} />
                    <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
                        <Grid item xs={3}> {/* 드롭다운 리스트 */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="search-category-label">검색 기준</InputLabel>
                                <Select
                                    labelId="search-category-label"
                                    id="search-category"
                                    value={searchCategory}
                                    onChange={handleCategoryChange}
                                    label="검색 기준"
                                >
                                    <MenuItem value="">선택</MenuItem>
                                    <MenuItem value="title">제목</MenuItem>
                                    <MenuItem value="author">작성자</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={7}> {/* 검색어 입력 필드 */}
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="검색어를 입력하세요"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                disabled={!searchCategory}
                                style={{ height: '56px' }}
                            />
                        </Grid>
                        <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
                            {/* 검색 버튼 */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                style={{ height: '56px', width: '100%', backgroundColor:'#4A90E2',color: 'white'}}
                            >
                                검색
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    </div>
    </>
};

export default AdminNotice;