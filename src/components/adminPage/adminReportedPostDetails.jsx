//**adminReportedPostDetails.jsx

import React from 'react';
import { useRouter } from 'next/router';
import { Button, Paper, Typography } from '@mui/material';

export default function AdminReportedPostDetails({ posts }) {
    const router = useRouter();
    const { id } = router.query; // URL 쿼리에서 ID를 가져옵니다.

    const post = posts.find(post => post.id === parseInt(id)); // ID로 게시글을 찾습니다.

    const handleBack = () => {
        router.back(); // 이전 페이지로 돌아가기
    };

    if (!post) {
        return <Typography variant="h6">해당 게시글을 찾을 수 없습니다.</Typography>;
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                {post.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                카테고리: {post.category}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                작성자: {post.author}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                작성일: {post.date}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
                {post.content}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBack} style={{ marginTop: '20px' }}>
                뒤로가기
            </Button>
        </Paper>
    );
}