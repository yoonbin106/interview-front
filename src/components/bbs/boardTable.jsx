

import React, { useState } from 'react';
import PaginationTable from '@/components/bbs/bbsTable';
import RegisterButton from '@/components/bbs/bbsRegisterButton';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/bbs/BoardTable.module.css';
import NestedList from '@/components/bbs/bbsSidebar';

const boardTable = () => {
    // 하드코딩된 게시판 데이터
    const notices = [
        { bbs_id: 15, title: '2024년 하반기 공휴일 안내', author: 'admin123', date: '2024-07-15', hitcount: 13, likes: 20 },
        { bbs_id: 14, title: '서비스 점검 안내 (8월 25일)', author: 'admin1004', date: '2024-07-10', hitcount: 15, likes: 10 },
        { bbs_id: 13, title: '신규 기능 업데이트 예정', author: 'admin1107', date: '2024-07-05', hitcount: 17, likes: 30 },
        { bbs_id: 12, title: '고객센터 운영 시간 변경 안내', author: 'admin123', date: '2024-07-01', hitcount: 15, likes: 15 },
        { bbs_id: 11, title: '긴급 서버 점검 안내 (7월 3일)', author: 'admin1004', date: '2024-06-28', hitcount: 13, likes: 20 },
        { bbs_id: 10, title: '6월 결산 보고서', author: 'admin1107', date: '2024-06-25', hitcount: 13, likes: 20 },
        { bbs_id: 9, title: '고객 설문조사 이벤트 당첨자 발표', author: 'admin123', date: '2024-06-20', hitcount: 13, likes: 20 },
        { bbs_id: 8, title: '보안 강화 관련 정책 변경 안내', author: 'admin1004', date: '2024-06-15', hitcount: 13, likes: 20 },
        { bbs_id: 7, title: '6월의 우수 고객 혜택 안내', author: 'admin1107', date: '2024-06-10', hitcount: 13, likes: 20 },
        { bbs_id: 6, title: '서비스 이용약관 변경 안내', author: 'admin123', date: '2024-06-05', hitcount: 13, likes: 20 },
        { bbs_id: 5, title: '회원 등급별 혜택 안내', author: 'admin1004', date: '2024-06-01', hitcount: 13, likes: 20 },
        { bbs_id: 4, title: '5월의 우수 고객 혜택 안내', author: 'admin1107', date: '2024-05-25', hitcount: 13, likes: 20 },
        { bbs_id: 3, title: '5월 결산 보고서', author: 'admin123', date: '2024-05-20', hitcount: 13, likes: 20 },
        { bbs_id: 2, title: '시스템 업데이트 공지 (5월 18일)', author: 'admin1004', date: '2024-05-15', hitcount: 13, likes: 20 },
        { bbs_id: 1, title: '개인정보 처리방침 변경 안내', author: 'admin1107', date: '2024-05-10', hitcount: 13, likes: 20 },
    ];

    const [searchCategory, setSearchCategory] = useState(''); // 검색 카테고리 상태 관리
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [filteredNotices, setFilteredNotices] = useState(notices); // 필터링된 공지사항 상태 관리

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
        const filteredData = notices.filter(item => {
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

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList/>
            </div>
        <div className={styles.content}>
        <div className={"main-container"}>
            <div style={{ position: 'relative', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 15, whiteSpace: 'nowrap' }}>전체 게시판</h2>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            {/* 게시판 등록 버튼 */}
                            <RegisterButton to="/bbs/bbsRegisterPage" />
                        </div>
                    </div>
                    {/* 필터링된 게시판을 테이블로 렌더링 */}
                    <PaginationTable rows={filteredNotices} />
                    <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
    <Grid item xs={3}>  
        {/* 드롭다운 리스트 */}
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
    <Grid item xs={2}> 
        <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            sx={{
                backgroundColor: '#4A90E2',
                '&:hover': { backgroundColor: '#357ABD'},
                height: '56px'
            }}
        >
            검색
        </Button>
    </Grid>
</Grid>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default boardTable
;