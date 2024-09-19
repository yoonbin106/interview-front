import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/adminPage/adminReportedPostDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import { Card, CardContent, Button, Divider, Typography, Grid } from '@mui/material'; // MUI 사용

export default function AdminReportedPostDetailsPage() {
    const router = useRouter();
    const { reportId } = router.query;  // reportId 동적 라우팅 값 추출
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        if (reportId) {
            axios.get(`http://localhost:8080/api/adminreported/reportedposts/${reportId}`)
                .then(response => {
                    setPost(response.data);  // 게시글 정보 설정
                    setLoading(false);  // 데이터를 받은 후 로딩 상태를 false로 설정
                })
                .catch(error => {
                    console.error('Error fetching post data:', error);
                    setError('게시글을 불러오는 중 오류가 발생했습니다.');
                    setLoading(false);  // 오류 발생 시에도 로딩 상태를 false로 설정
                });
        }
    }, [reportId]);

    // 게시글 삭제하는 함수
    const handleDelete = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 완전히 삭제하시겠습니까? 영구 삭제 시, 복구가 어렵습니다")) {
                axios.delete(`http://localhost:8080/api/adminreported/delete/${reportId}`)
                    .then(() => {
                        alert("게시글 삭제가 완료되었습니다.");
                        router.push('/adminPage/adminReportedPostPage');
                    })
                    .catch(error => {
                        console.error('Error deleting post:', error);
                        alert('삭제 중 오류가 발생했습니다.');
                    });
            }
        }
    };

    // 게시글 복구하는 함수
    const handleRestore = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 [신고->일반] 게시글로 복구하시겠습니까?")) {
                axios.put(`http://localhost:8080/api/adminreported/updatestatus/${reportId}/VISIBLE`)
                    .then(() => {
                        alert('게시글이 복구되었습니다.');
                        router.push('/adminPage/adminReportedPostPage');
                    })
                    .catch(error => {
                        console.error('Error restoring post:', error);
                        alert('게시글 복구 중 오류가 발생했습니다.');
                    });
            }
        }
    };

    // 목록으로 돌아가기 함수
    const handleBack = () => {
        router.push('/adminPage/adminReportedPostPage');
    };

    // 로딩 중 또는 에러가 있을 때 처리
    if (loading) {
        return <div>게시글을 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // 데이터가 준비되었을 때 렌더링
    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList />
            </div>
            <div className={sidebar.content}>
                {post ? (
                    <div>
                        <Card className={styles.reportedPostCard} elevation={3}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: 'gray', marginBottom: 2 }}>
                                    [신고된 게시글]
                                </Typography>
                                
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                    {post.title}
                                </Typography>
                                
                                <Typography variant="body2" sx={{ color: 'gray', marginBottom: 1 }}>
                                    작성자: {post.username}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'gray', marginBottom: 3 }}>
                                    등록 날짜: {new Date(post.createdAt).toLocaleString()}
                                </Typography>
                                
                                <Typography variant="body1" component="p" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                                    {post.content}
                                </Typography>
                            </CardContent>
                        </Card>

                        <br />

                        <Card className={styles.reportedPostCard} elevation={3}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            신고 사유 :
                                        </Typography>
                                        <Typography variant="body1">
                                            {post.reason}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            신고자 :
                                        </Typography>
                                        <Typography variant="body1">
                                            {post.reporterName}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ marginY: 2 }} />

                                <Typography variant="body2" sx={{ color: 'gray', marginBottom: 3 }}>
                                    게시글 신고 날짜: {new Date(post.reportedAt).toLocaleString()}
                                </Typography>

                                <div className={styles.reportedPostDetailsButtonContainer}>
                                    <Button className={styles.reportedPostDetailsDeleteButton} onClick={handleDelete}>
                                        게시글 영구삭제
                                    </Button>
                                    <Button className={styles.reportedPostDetailsHideButton} onClick={handleRestore}>
                                        게시글 복구
                                    </Button>
                                    <Button className={styles.reportedPostDetailsBackButton} onClick={handleBack}>
                                        목록
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <p>게시글을 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
}
