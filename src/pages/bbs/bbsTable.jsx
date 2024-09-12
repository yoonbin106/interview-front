import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import styles from '@/styles/bbs/bbsTable.module.css';
import axios from 'axios';
import { useStores } from '@/contexts/storeContext';
import Link from 'next/link';

export default function PaginationTableNotice({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const [error, setError] = React.useState(null);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bbs/${id}`);
        // 최신 글이 가장 먼저 보이도록 createdAt 기준 내림차순 정렬
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <TableContainer component={Paper} className={styles.bbsTableContainer}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={styles.bbsHeaderCell}>글 번호</TableCell>
            <TableCell align="center" className={styles.bbsHeaderCell}>제목</TableCell>
            <TableCell align="center" className={styles.bbsHeaderCell}>작성자</TableCell>
            <TableCell align="center" className={styles.bbsHeaderCell}>작성날짜</TableCell>
            <TableCell align="center" className={styles.bbsHeaderCell}>조회수</TableCell>
            <TableCell align="center" className={styles.bbsHeaderCell}>좋아요</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((post) => (
            <TableRow key={post.bbs_id}>
              <TableCell align="center">{post.bbs_id}</TableCell>
              <TableCell align="center">
                <Link href={`/bbs/postView?id=${post.bbs_id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  {post.title}
                </Link>
              </TableCell>
              <TableCell align="center">{post.username}</TableCell>
              <TableCell align="center">{post.createdAt}</TableCell>
              <TableCell align="center">{post.hitCount || 0}</TableCell>
              <TableCell align="center">{post.likes || 0}</TableCell>
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
}
