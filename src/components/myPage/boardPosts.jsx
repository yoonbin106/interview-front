import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from '@/styles/myPage/boardPosts.module.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '@mui/material/Pagination';
import { useStores } from '@/contexts/storeContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import ShortcutIcon from '@mui/icons-material/Shortcut';

import { TextField, Grid, FormControl, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderTop: '2px solid #aaaaaa',
    borderBottom: '2px solid #aaaaaa',
    whiteSpace: 'nowrap',          // 텍스트를 한 줄로 유지
    overflow: 'hidden',            // 넘치는 부분을 숨김
    textOverflow: 'ellipsis',      // 넘치는 텍스트를 '...'로 표시
    // maxWidth: '200px',
    

    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#eeeeee',
        color: theme.palette.common.black,
        textAlign: 'center',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: 'center',
        height: 65,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const BoardPosts = observer(() => {
    const { userStore } = useStores();

    const [bbsPost, setBbsPost] = useState([]);
    const [bbsComment, setBbsComment] = useState([]);

    const router = useRouter();

    const [currentPostPage, setCurrentPostPage] = useState(1); // 현재 게시글 페이지
    const [currentCommentPage, setCurrentCommentPage] = useState(1); // 현재 댓글 페이지
    const itemsPerPage = 2; // 페이지당 항목 수

    useEffect(() => {
        getMyBbsComment();
        getMyBbsPost();
    }, []);

    const handlePostPageChange = (event, value) => {
        setCurrentPostPage(value);
    };

    const handleCommentPageChange = (event, value) => {
        setCurrentCommentPage(value);
    };

    const indexOfLastPost = currentPostPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = bbsPost.slice(indexOfFirstPost, indexOfLastPost);

    const indexOfLastComment = currentCommentPage * itemsPerPage;
    const indexOfFirstComment = indexOfLastComment - itemsPerPage;
    const currentComments = bbsComment.slice(indexOfFirstComment, indexOfLastComment);


    const formatTime = (timestamp) => {
        const commentDate = new Date(timestamp);

        const formattedDate = commentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\./g, '.');

        return formattedDate;
    }

    const handleRowClick = (bbsId) => {
        router.push(`/bbs/postView?id=${bbsId}`);
    };

    const getMyBbsComment = async () => {
        try {
            const userId = userStore.id;
            const response = await axios.post('http://localhost:8080/api/mypage/getMyBbsComment', //userChatrooms
                userId,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setBbsComment(response.data);
        } catch (error) {
            console.error('내가 작성한 댓글 불러오기 중 에러 발생:', error);
        }
    };

    const getMyBbsPost = async () => {
        try {
            const userId = userStore.id;
            const response = await axios.post('http://localhost:8080/api/mypage/getMyBbsPost', //userChatrooms
                userId,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setBbsPost(response.data);
        } catch (error) {
            console.error('내가 작성한 게시글 불러오기 중 에러 발생:', error);
        }
    };

    return (
        <section className={styles.formContact}>
            <h1 className={styles.formTitle}>작성글/댓글 조회</h1>


            <h5 className={styles.formSubTitle}>내가 작성한 게시글 조회</h5>

            <div className={styles.tableContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, align: 'center', tableLayout: 'fixed' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: '70px' }}>번호</StyledTableCell>
                                <StyledTableCell style={{ width: '180px', maxWidth: '200px' }}>제목</StyledTableCell>
                                <StyledTableCell style={{ width: '450px' }}>내용</StyledTableCell>
                                <StyledTableCell style={{ width: '110px' }}>작성일</StyledTableCell>
                                <StyledTableCell style={{ width: '120px' }}></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentPosts.map((post) => (

                                <StyledTableRow key={post.bbsId}>
                                    <StyledTableCell style={{ width: '70px' }}>{post.bbsId}</StyledTableCell>
                                    <StyledTableCell
                                        onClick={() => handleRowClick(post.bbsId)}
                                        style={{ cursor: 'pointer', width: '180px', maxWidth: '200px' }}
                                    >
                                        {post.title}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '450px' }}>{post.content}</StyledTableCell>
                                    <StyledTableCell style={{ width: '110px' }}>{formatTime(post.createdAt)}</StyledTableCell>
                                    <StyledTableCell style={{ cursor: 'pointer', width: '120px' }} onClick={() => handleRowClick(post.bbsId)}><ShortcutIcon /></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <div className={styles.tablePagination}>
                <div className={styles.tablePagination}>
                    <Pagination
                        count={Math.ceil(bbsPost.length / itemsPerPage)}
                        page={currentPostPage}
                        onChange={handlePostPageChange}
                        shape="rounded"
                    />
                </div>
            </div>




            <h5 className={styles.formSubTitle}>작성 댓글 내역</h5>

            <div className={styles.tableContent}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, align: 'center', tableLayout: 'fixed' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: '70px' }}>번호</StyledTableCell>
                                <StyledTableCell style={{ width: '180px', maxWidth: '200px' }}>게시글 제목</StyledTableCell>
                                <StyledTableCell style={{ width: '450px' }}>댓글 내용</StyledTableCell>
                                <StyledTableCell style={{ width: '110px' }}>작성일</StyledTableCell>
                                <StyledTableCell style={{ width: '120px' }}></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentComments.map((comment) => (

                                <StyledTableRow key={comment.commentId}>

                                    <StyledTableCell style={{ width: '70px' }}>{comment.commentId}</StyledTableCell>
                                    <StyledTableCell style={{ width: '180px', maxWidth: '200px' }}>{comment.bbsTitle}</StyledTableCell>
                                    <StyledTableCell
                                        onClick={() => handleRowClick(comment.bbsId)}
                                        style={{ cursor: 'pointer', width: '450px', maxWidth: '200px' }}
                                    >
                                        {comment.content}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '110px' }}>{formatTime(comment.createdAt)}</StyledTableCell>
                                    <StyledTableCell style={{ cursor: 'pointer', width: '120px' }} onClick={() => handleRowClick(comment.bbsId)}><ShortcutIcon /></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <div className={styles.tablePagination}>
                <Pagination
                    count={Math.ceil(bbsComment.length / itemsPerPage)}
                    page={currentCommentPage}
                    onChange={handleCommentPageChange}
                    shape="rounded"
                />
            </div>







        </section>



    );
});

export default BoardPosts;