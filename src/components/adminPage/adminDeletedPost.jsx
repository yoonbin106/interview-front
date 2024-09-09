import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TextField, Grid, FormControl, InputLabel, Divider } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminDeletedPost.module.css';
import { useRouter } from 'next/router';

const AdminDeletedPost = () => {
    const [deletedPosts, setDeletedPosts] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDeletedPost, setFilteredDeletedPost] = useState([]);

    const router = useRouter(); // useRouter 사용

    // 백엔드에서 삭제된 게시글 데이터를 가져오는 함수
    useEffect(() => {
        const fetchDeletedPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bbs/deleted');
                // 내림차순 정렬 (최신 글이 위로)
                const sortedPosts = response.data.sort((a, b) => new Date(b.deleted_date) - new Date(a.deleted_date));
                setDeletedPosts(sortedPosts);
                setFilteredDeletedPost(sortedPosts);
            } catch (error) {
                console.error('Error fetching deleted posts:', error);
            }
        };
        fetchDeletedPosts();
    }, []);

    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = deletedPosts.filter(item => {
            if (searchCategory === 'title') {
                return item.title.toLowerCase().includes(lowercasedFilter);
            }
            if (searchCategory === 'author') {
                return item.userId.username.toLowerCase().includes(lowercasedFilter);
            }
            return false;
        });
        setFilteredDeletedPost(filteredData);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalPages = Math.ceil(filteredDeletedPost.length / rowsPerPage);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredDeletedPost.length) : 0;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const formattedTime = date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${formattedDate} ${formattedTime}`;
    };

    // 행을 클릭했을 때 실행되는 함수
    const handleRowClick = (bbsId) => {
        router.push(`/adminPage/adminDeletedPostDetailsPage/${bbsId}`);
    };

    return (
        <div className={styles.deletedPostContainer}>
            <div className={styles.deletedPostSidebar}>
                <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
            </div>
            <div className={styles.deletedPostContent}>
                <div className={styles.deletedPostMainContainer}>
                    <div>
                        <Box display="flex" alignItems="center" mb={2}>
                            <DeleteTwoToneIcon sx={{ fontSize: 60, color: '#5A8AF2', marginRight: '8px' }} />
                            <h2 className={styles.deletedPostTitle}>𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐏𝐨𝐬𝐭</h2>
                        </Box>
                        <Divider sx={{ my: 2, borderBottomWidth: 3, borderColor: '#999' }} />

                        <TableContainer component={Paper} className={styles.deletedPostTableContainer}>
                            <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>글 번호</TableCell>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>제목</TableCell>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>작성자</TableCell>
                                        <TableCell align="center" className={styles.deletedPostTableHeaderCell}>삭제날짜</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? filteredDeletedPost.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : filteredDeletedPost
                                    ).map((row) => (
                                        <TableRow 
                                            key={row.bbsId} 
                                            hover 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => handleRowClick(row.bbsId)}
                                        >
                                            <TableCell align="center">{row.bbsId}</TableCell>
                                            <TableCell align="center" className={styles.deletedPostTableLink}>
                                                    {row.title}
                                            </TableCell>
                                            <TableCell align="center">{row.userId.username}</TableCell>
                                            <TableCell align="center">{formatDate(row.deleted_date)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 30 * emptyRows }}>
                                            <TableCell colSpan={4} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* 검색 필터 UI */}
                        <Grid container spacing={1} alignItems="center" justifyContent="flex-end" className={styles.deletedPostGridContainer}>
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
                                    className={styles.deletedPostGridItem}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSearch}
                                    className={styles.deletedPostSearchButton}
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
    );
};

export default AdminDeletedPost;
