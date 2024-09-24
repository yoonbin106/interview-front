import React, { useEffect, useState } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';

import axios from 'axios';
import ForumIcon from '@mui/icons-material/Forum';
import styles from '@/styles/bbs/bbs.module.css';

import 'react-calendar/dist/Calendar.css'; // 기본 CSS를 가져옵니다.
import RegisterButton from '@/components/bbs/bbsRegisterButton';
import { useRouter } from 'next/router';


const Bbs = () => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [sortCriteria, setSortCriteria] = useState('bbsId');
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bbs');
                let sortedPosts = [...response.data].sort((a, b) => b.bbsId - a.bbsId);
                setPost(sortedPosts);
                setFilteredPosts(sortedPosts);
                setLoading(false);
            } catch (error) {
                console.error("데이터 로드 중 오류:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (post.length > 0) {
            let sortedPosts = [...post];
            if (sortCriteria === 'bbsId') {
                sortedPosts.sort((a, b) => b.bbsId - a.bbsId);
            } else if (sortCriteria === 'createdAt') {
                sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            setFilteredPosts(sortedPosts);
        }
    }, [sortCriteria, post]);


    const handleClick = (bbsId) => {
        router.push(`/bbs/postView?id=${bbsId}`)
    }

    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        if (searchCategory === ''){
            // 선택 기준이 빈 문자열일 때, 전체 게시글을 반환
            setFilteredPosts(post);
            setPage(0);
            return;
        }
        const filteredData = post.filter(item => {
            
            if (searchCategory === 'title') {
                return item.title.toLowerCase().includes(lowercasedFilter);
            }
            if (searchCategory === 'author') {
                
                return item.username && item.username.toLowerCase().includes(lowercasedFilter);
            }
            return false;
        });
        setFilteredPosts(filteredData);
        setPage(0);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(filteredPosts.length / rowsPerPage);

    useEffect(() => {
        console.log("현재 페이지의 게시글 데이터:", filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [filteredPosts, page, rowsPerPage]);

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={"main-container"}>
                    <div style={{ position: 'relative', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '90%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ForumIcon sx={{ marginRight: 1, color: 'primary.main', fontSize: 40 }} />
                                    <Typography variant="h5" className={styles.bbsTitle}>
                                        자유 게시판
                                    </Typography>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <RegisterButton to="/bbs/bbsRegisterPage" />
                                </div>
                                <hr className={styles.bbsTitleDivider} />
                            </div>
                             
                            <div className={styles.boardHeader}>
                                <div className={styles.info}>
                                    {searchTerm 
                                        ? `'${searchTerm}' 키워드로 검색된 글` 
                                        : '전체 글 목록'}
                                    <br /> {filteredPosts.length}개의 글
                                </div>
                                <div className={styles.boardHeaderControl}>
                                    <Select onChange={handleSortCriteriaChange} value={sortCriteria}>
                                        <MenuItem value="bbsId">글 번호</MenuItem>
                                        <MenuItem value="createdAt">작성 날짜</MenuItem>
                                    </Select>
                                    
                                </div>
                            </div>
                            
                            {/* 필터링된 게시판 테이블로 렌더링 */}
                            <TableContainer component={Paper} className={styles.bbsTableContainer} >
                                <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
                                    <TableHead sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                        <TableRow>
                                            <TableCell align="center" className={styles.bbsHeaderCell}>글 번호</TableCell>
                                            <TableCell align="center" className={styles.bbsHeaderCell}>제목</TableCell>
                                            <TableCell align="center" className={styles.bbsHeaderCell}>작성자</TableCell>
                                            <TableCell align="center" className={styles.bbsHeaderCell}>작성날짜</TableCell>
                                            <TableCell align="center" className={styles.bbsHeaderCell}>조회수</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filteredPosts
                                        ).map((post) => (
                                            <TableRow key={post.bbsId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                <TableCell align="center">{post.bbsId}</TableCell>
                                                <TableCell align="center">
                                                    <div style={{ textDecoration: 'none', color: 'black' }}>
                                                        <Tooltip title={post.title} arrow>
                                                            <Typography variant="body2" sx={{ cursor: 'pointer', fontWeight: 'bold', color: '#4A90E2' }}
                                                                onClick={() => handleClick(post.bbsId)}>
                                                                {post.title}
                                                            </Typography>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">{post.username}</TableCell>
                                                <TableCell align="center">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell align="center">{post.hitCount || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                           
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

export default Bbs;
