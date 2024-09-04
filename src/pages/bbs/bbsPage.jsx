import React, { useEffect, useState } from 'react';
import PaginationTableNotice from '@/components/bbs/bbsTable'; // PaginationTableNotice로 변경
import RegisterButton from '@/components/bbs/bbsRegisterButton';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/bbs/BoardTable.module.css';
import Box from '@mui/material/Box';
import axios from 'axios'; // axios import 추가

const BoardTable = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchCategory, setSearchCategory] = useState(''); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물 상태 관리
    const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 게시물 개수
    const [page, setPage] = useState(0); // 현재 페이지 상태
    const [sortCriteria, setSortCriteria] = useState('bbsId'); // 기본 정렬 기준

    useEffect(() => {
        console.log("useEffect 실행됨");  // 이 로그가 찍히는지 확인
        
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bbs');
                console.log("서버 응답 (원본 데이터):", response.data);  // 이 로그가 찍히는지 확인
    
                let sortedPosts = [...response.data].sort((a, b) => b.bbsId - a.bbsId);  // 데이터가 정렬되는지 확인
                console.log("정렬된 게시글:", sortedPosts);
    
                setPosts(sortedPosts);  // 상태 업데이트
                setFilteredPosts(sortedPosts);
                setLoading(false);  // 로딩 상태 변경
            } catch (error) {
                console.error("데이터 로드 중 오류:", error);
                setError(error);
                setLoading(false);
            }
        };
    
        fetchPosts();  // 비동기 함수 호출
    }, []);  // 페이지 로드 시 한 번 실행
    
    
    
    useEffect(() => {
        if (posts.length > 0) {
            let sortedPosts = [...posts];
            if (sortCriteria === 'bbsId') {
                sortedPosts.sort((a, b) => b.bbsId - a.bbsId);
            } else if (sortCriteria === 'createdAt') {
                sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            console.log("정렬 기준에 따른 정렬된 게시글 데이터:", sortedPosts);
            setFilteredPosts(sortedPosts);
        }
    }, [sortCriteria, posts]);  // sortCriteria 또는 posts가 변경될 때마다 실행
    
    
    // 검색 카테고리 변경 핸들러
    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
        console.log("검색 카테고리 변경:", event.target.value);
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        console.log("검색어 변경:", event.target.value);
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = posts.filter(item => {
            if (searchCategory === 'title') {
                return item.title.toLowerCase().includes(lowercasedFilter);
            }
            if (searchCategory === 'author') {
                return item.author.toLowerCase().includes(lowercasedFilter);
            }
            return false;
        });
        console.log("검색 결과 필터링된 데이터:", filteredData);
        setFilteredPosts(filteredData);
        setPage(0); // 검색 시 페이지를 첫 페이지로 초기화
    };

    // 페이지당 게시물 개수 변경 핸들러
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 페이지 개수 변경 시 첫 페이지로 초기화
        console.log("페이지당 게시물 수 변경:", event.target.value);
    };

    // 페이지 변경 핸들러
    const handleChangePage = (newPage) => {
        setPage(newPage);
        console.log("페이지 변경:", newPage);
    };

    const totalPages = Math.ceil(filteredPosts.length / rowsPerPage); // 전체 페이지 계산

    useEffect(() => {
        console.log("현재 페이지의 게시글 데이터:", filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [filteredPosts, page, rowsPerPage]);

    // 정렬 기준 변경 핸들러
    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
        console.log("정렬 기준 변경:", event.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={"main-container"}>
                    <div style={{ position: 'relative', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '90%' }}>
                            {/* 게시판 헤더 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 15, whiteSpace: 'nowrap' }}>자유 게시판</h2>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <RegisterButton to="/bbs/bbsRegisterPage" />
                                </div>
                            </div>
                            <div className={styles.boardHeader}>
                                <div className={styles.info}>
                                    000 키워드로 검색된 글 <br /> {filteredPosts.length}개의 글
                                </div>
                                <div className={styles.boardHeaderControl}>
                                    <select onChange={handleRowsPerPageChange} value={rowsPerPage}>
                                        <option value={10}>10개씩</option>
                                        <option value={20}>20개씩</option>
                                        <option value={30}>30개씩</option>
                                    </select>
                                </div>
                                <div className={styles.boardHeaderControl}>
                                    {/* 정렬 기준 선택 */}
                                    <select onChange={handleSortCriteriaChange} value={sortCriteria}>
                                        <option value="bbsId">글 번호</option>
                                        <option value="createdAt">작성 날짜</option>
                                    </select>
                                </div>
                            </div>
                            {/* 필터링된 공지사항을 테이블로 렌더링 */}
                            <PaginationTableNotice rows={filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} />

                            {/* 검색 필터 */}
                            <Grid container spacing={1} alignItems="center" justifyContent="flex-end" style={{ marginTop: '20px', maxWidth: '100%' }}>
                                <Grid item xs={3}>
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
                                <Grid item xs={7}>
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
                                            '&:hover': { backgroundColor: '#357ABD' },
                                            height: '56px'
                                        }}
                                    >
                                        검색
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* 페이지네이션 컨트롤 */}
                            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(0)}
                                    disabled={page === 0}
                                    sx={{ marginRight: 2 }}
                                >
                                    처음
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(page - 1)}
                                    disabled={page === 0}
                                    sx={{ marginRight: 2 }}
                                >
                                    이전
                                </Button>
                                <span>{page + 1} / {totalPages}</span>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    sx={{ marginLeft: 2 }}
                                >
                                    다음
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(totalPages - 1)}
                                    disabled={page >= totalPages - 1}
                                    sx={{ marginLeft: 2 }}
                                >
                                    마지막
                                </Button>
                                {/* 페이지당 표시할 행 수 선택 */}
                                <Select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    sx={{ marginLeft: 2 }}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                </Select>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardTable;
