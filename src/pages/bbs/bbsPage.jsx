import React, { useEffect, useState } from 'react';
import PaginationTableNotice from '@/components/bbs/bbsTable'; // PaginationTableNotice로 변경
import RegisterButton from '@/components/bbs/bbsRegisterButton';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '@/styles/bbs/BoardTable.module.css';

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bbs');
                console.log(response);
                setPosts(response.data);
                setFilteredPosts(response.data); // 필터링된 게시물에 처음 데이터 설정
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // 검색 카테고리 변경 핸들러
    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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
        setFilteredPosts(filteredData);
        setPage(0); // 검색 시 페이지를 첫 페이지로 초기화
    };

    // 페이지당 게시물 개수 변경 핸들러
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 페이지 개수 변경 시 첫 페이지로 초기화
    };

    // 페이지 변경 핸들러
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(filteredPosts.length / rowsPerPage); // 전체 페이지 계산

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

                            {/* 페이지네이션 */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(0)}
                                    disabled={page === 0}
                                    style={{ marginRight: '8px' }}
                                >
                                    처음
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(page - 1)}
                                    disabled={page === 0}
                                    style={{ marginRight: '8px' }}
                                >
                                    이전
                                </Button>
                                <span>{page + 1} / {totalPages}</span>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    style={{ marginLeft: '8px' }}
                                >
                                    다음
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleChangePage(totalPages - 1)}
                                    disabled={page >= totalPages - 1}
                                    style={{ marginLeft: '8px' }}
                                >
                                    마지막
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardTable;
