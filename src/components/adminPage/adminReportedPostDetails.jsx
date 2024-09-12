//adminDeletedPostDetails.jsx

import React from 'react';
import { useRouter } from 'next/router';
import { Button, Paper, Typography } from '@mui/material';

export default function AdminReportedPostDetails({ posts }) {
    const router = useRouter(); // Next.js의 useRouter 훅을 사용하여 라우터 객체를 가져옴
    const { id } = router.query; // URL 쿼리에서 게시글 ID를 가져옴

    // URL에서 가져온 ID를 사용하여 삭제된 게시글 중 해당 게시글을 찾음
    const post = posts.find(post => post.id === parseInt(id)); 

    // '뒤로가기' 버튼 클릭 시 이전 페이지로 돌아가는 핸들러
    const handleBack = () => {
        router.back(); // 이전 페이지로 돌아감
    };

    // 게시글이 존재하지 않을 경우 표시할 메시지
    if (!post) {
        return <Typography variant="h6">해당 게시글을 찾을 수 없습니다.</Typography>;
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            {/* 게시글 제목 */}
            <Typography variant="h5" gutterBottom>
                {post.title}
            </Typography>
            {/* 게시글 카테고리 */}
            <Typography variant="subtitle1" gutterBottom>
                카테고리: {post.category}
            </Typography>
            {/* 게시글 작성자 */}
            <Typography variant="subtitle1" gutterBottom>
                작성자: {post.author}
            </Typography>
            {/* 게시글 작성일 */}
            <Typography variant="subtitle1" gutterBottom>
                작성일: {post.date}
            </Typography>
            {/* 게시글 내용 */}
            <Typography variant="body1" style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
                {post.content}
            </Typography>
            {/* '뒤로가기' 버튼 */}
            <Button variant="contained" color="primary" onClick={handleBack} style={{ marginTop: '20px' }}>
                뒤로가기
            </Button>
        </Paper>
    );
}