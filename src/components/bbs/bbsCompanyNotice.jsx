import React,{useState,useEffect} from 'react';
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
import { TextField, Grid, FormControl, InputLabel, Typography, ListItemIcon } from '@mui/material';
import NestedList from '@/components/bbs/bbsSidebar';
import { useRouter } from 'next/router';


import styles from '@/styles/bbs/bbsCompanyNotice.module.css';
import axios from 'axios';
import { FaBuilding } from 'react-icons/fa';



const PaginationTableAdminCompanyNotice = ({rows,page,rowsPerPage}) => {
    const router = useRouter();
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    //행을 클릭했을 때 실행되는 함수
    const handleRowClick = (companyNoticeId) => {
        router.push(`/bbs/bbsCompanyNoticeDetailsPage/${companyNoticeId}`)
    }
    return (
        <TableContainer component={Paper} className={styles.companyNoticeTableContainer}>
          <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.companyNoticeTableHeaderCell}>글 번호</TableCell>
                <TableCell align="center" className={styles.companyNoticeTableHeaderCell}>제목</TableCell>
                <TableCell align="center" className={styles.companyNoticeTableHeaderCell}>작성자</TableCell>
                <TableCell align="center" className={styles.companyNoticeTableHeaderCell}>작성날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row) => (
                <TableRow key={row.companyNoticeId}
                hover
                onClick={() => handleRowClick(row.companyNoticeId)}
                style={{cursor:'pointer'}}>
                  <TableCell align="center">{row.companyNoticeId}</TableCell>
                  <TableCell align="center" className={styles.companyNoticeTitleCell}>
                      {row.companyNoticeTitle}
                  </TableCell>
                  <TableCell align="center">{row.user.username}</TableCell> {/* 작성자 이름 표시 */}
                  <TableCell align="center">
                    {new Date(row.companyNoticeCreatedTime).toLocaleString('ko-KR',{
                        year: 'numeric',
                        month:'2-digit',
                        day: '2-digit',
                        
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 30 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };
const BbsCompanyNotice = () => {
    const router = useRouter();
    const [companyNoticeData, setCompanyNoticeData] = useState([]); // 실제 데이터베이스에서 가져온 데이터 
    const [searchCategory, setSearchCategory] = useState(''); // 검색 기준 카테고리 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredNotices, setFilteredNotices] = useState([]); // 필터링된 QnA 상태
    const [categoryFilter, setCategoryFilter] = useState(''); // 카테고리 필터
    const [page, setPage] = useState(0); // 현재 페이지 상태
    const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 표시할 행 수 상태
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const fetchCompanyNoticeData = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/companynotice');
            const sortedData = response.data.sort((a,b) => new Date(b.companyNoticeCreatedTime) - new Date(a.companyNoticeCreatedTime));
            setCompanyNoticeData(response.data); // 가져온 데이터를 상태에 저장
            setFilteredNotices(sortedData);//초기값 설정
          } catch (error) {
            console.error('Error fetching BbsNotice data:', error);
          }
        };
    
        fetchCompanyNoticeData(); // 
      }, []); 
   
    useEffect(() => {
        const queryPage = router.query.page ? parseInt(router.query.page, 10) : 0;
        setPage(queryPage);
    }, [router.query.page]);
    
    const handleCategoryChange = (event) => {
        setSearchCategory(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = companyNoticeData.filter(item => {
            const matchesSearch = searchCategory === 'title'
                ? item.companyNoticeTitle.toLowerCase().includes(lowercasedFilter)
                : searchCategory === 'author'
                ? item.user.username.toLowerCase().includes(lowercasedFilter)
                : true; // 검색어 필터링
    
            return matchesSearch;
        });
        setFilteredNotices(filteredData);
        setPage(0); // 검색 시 첫 페이지로 이동
    };
    

    const handleChangePage = (newPage) => {
        setPage(newPage);
        router.push({
            pathname: '/bbs/bbsCompanyNoticePage', // 정확한 경로로 설정
            query: { ...router.query, page: newPage }, // 페이지 상태를 쿼리에 추가
        });
    };
    
        const handleRowsPerPageChange = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

    const totalPages = Math.ceil(filteredNotices.length / rowsPerPage);

   

    

    return (
        <div className={styles.companyNoticeContainer}>
            <div className={styles.companyNoticeSidebar}>
                <NestedList />
            </div>
            <div className={styles.companyNoticeContent}>
                
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ fontSize: 40, color: '#1976d2'  }} >
                            <FaBuilding />
                        </ListItemIcon>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                            기업 공지
                        </Typography>
                    </Box>

                    <PaginationTableAdminCompanyNotice
                        rows={filteredNotices}
                        page={page}
                        rowsPerPage={rowsPerPage}
                    />
                   
                    <Grid container spacing={1} alignItems="center" justifyContent="flex-end" className={styles.companyNoticeGridContainer}>
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
                                className={styles.companyNoticeGridItem}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSearch}
                                className={styles.companyNoticeSearchButton}
                            >
                                검색
                            </Button>
                        </Grid>
                    </Grid>

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
    );
};

export default BbsCompanyNotice;
