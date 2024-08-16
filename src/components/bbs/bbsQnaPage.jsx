//bbsQnaPage.jsx

import React, { useState } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PaginationTableQna from '@/components/bbs/bbsQnaTable';
import styles from '@/styles/bbs/bbsPage.module.css';
import NestedList from '@/components/bbs/bbsSidebar';

const BbsQna = () => {
    // 하드코딩된 문의사항 데이터
    const adminqna = [
        { id: 12, category: '대기', title: '결제하려는데 계속 오류가 떠요 ㅠㅠ 어떻게 해야 되나요?', author: 'user123', date: '2024-08-12' },
        { id: 11, category: '진행중', title: '로그인할 때마다 비밀번호가 틀렸다고 나오는데... 왜 그런 거죠? ㅠ', author: 'user123', date: '2024-08-11' },
        { id: 10, category: '완료', title: '서비스 이용 중에 자꾸 로그아웃되는데 이거 버그 아닌가요?', author: 'user123', date: '2024-08-10' },
        { id: 9, category: '대기', title: '구독 취소하려고 하는데 어디서 하면 되나요?', author: 'user123', date: '2024-08-09' },
        { id: 8, category: '진행중', title: '프로모션 코드를 입력했는데 적용이 안 되네요. 도와주실 수 있나요?', author: 'user123', date: '2024-08-08' },
        { id: 7, category: '완료', title: '비밀번호 재설정 이메일이 오질 않아요. 어떻게 해야 하나요?', author: 'user123', date: '2024-08-07' },
        { id: 6, category: '대기', title: '회원정보 수정이 불가능한데, 이유가 뭘까요?', author: 'user123', date: '2024-08-06' },
        { id: 5, category: '진행중', title: '결제 내역을 어디서 확인할 수 있나요? 안내 부탁드립니다.', author: 'user123', date: '2024-08-05' },
        { id: 4, category: '완료', title: '아이디를 변경할 수 있는지 궁금해요!', author: 'user123', date: '2024-08-04' },
        { id: 3, category: '대기', title: '서비스 구독 연장이 생각보다 복잡하네요. 좀 더 간편하게 할 수 없을까요?', author: 'user123', date: '2024-08-03' },
        { id: 2, category: '진행중', title: '2차 인증 설정하는데 문제가 생겼어요. 빠른 해결 부탁드립니다.', author: 'user123', date: '2024-08-02' },
        { id: 1, category: '완료', title: '프로필 사진을 업로드하려고 했는데 자꾸 실패해요. 왜 그런지 아시나요?', author: 'user123', date: '2024-08-01' },
    ];

    // 검색 상태 관리
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQna, setFilteredQna] = useState(adminqna);
    const [statusFilter, setStatusFilter] = useState('');

    // 상태(카테고리) 필터 변경 핸들러
    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setSearchCategory('');
        setSearchTerm(''); // 상태 변경 시 다른 검색 조건 초기화
    };

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
        const filteredData = adminqna.filter(item => {
            const matchesStatus = statusFilter ? item.category === statusFilter : true;
            const matchesSearch = searchCategory === 'title'
                ? item.title.toLowerCase().includes(lowercasedFilter)
                : item.author.toLowerCase().includes(lowercasedFilter);

            return matchesStatus && matchesSearch;
        });
        setFilteredQna(filteredData);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList/>
            </div>
        <div className={styles.content}>
            <div className="main-container">
                <div style={{ position: 'relative', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{margin: 15, whiteSpace: 'nowrap'}}>문의내역</h2>
                            <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}}></div>
                        </div>
                        {/* 필터링된 공지사항을 테이블로 렌더링 */}
                        <PaginationTableQna rows={filteredQna} />
                        <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
                            <Grid item xs={3}> {/* 상태(카테고리) 필터 */}
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="status-filter-label">상태</InputLabel>
                                    <Select
                                        labelId="status-filter-label"
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={handleStatusChange}
                                        label="상태"
                                    >
                                        <MenuItem value="">전체</MenuItem>
                                        <MenuItem value="대기">대기</MenuItem>
                                        <MenuItem value="진행중">진행중</MenuItem>
                                        <MenuItem value="완료">완료</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}> {/* 검색 기준 선택 */}
                                <FormControl fullWidth variant="outlined" disabled={!statusFilter}>
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
                            <Grid item xs={4}> {/* 검색어 입력 필드 */}
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSearch}
                                    style={{ height: '56px', width: '100%', backgroundColor: '#4A90E2', color: 'white' }}  // 버튼의 높이와 위치 조정
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

export default BbsQna;