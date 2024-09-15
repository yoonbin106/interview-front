import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/adminPage/adminDeletedPostDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminDeletedPostDetailsPage() {
    const router = useRouter();
    const { bbsId } = router.query;  // bbsId 동적 라우팅
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    // 게시글과 댓글 데이터를 가져오는 함수
    useEffect(() => {
        if (bbsId) {
            // 삭제된 게시글과 댓글을 함께 가져오는 API 호출
            axios.get(`http://localhost:8080/api/admindeleted/deleted/${bbsId}/with-comments`)
                .then(response => {
                    const { post, comments } = response.data;
                    setPost(post);  // 게시글 정보 설정
                    setComments(comments);  // 댓글 정보 설정
                })
                .catch(error => {
                    console.error('Error fetching post and comments data:', error);
                });
        }
    }, [bbsId]);

    // 게시글과 댓글을 삭제하는 함수
    const handleDelete = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글과 댓글을 완전히 삭제하시겠습니까?")) {
                // 게시글 삭제 요청 (댓글도 함께 삭제)
                axios.delete(`http://localhost:8080/api/admindeleted/deleted/${bbsId}`)
                    .then(() => {
                        alert("게시글과 댓글 삭제가 완료되었습니다.");
                        router.push('/adminPage/adminDeletedPostPage');
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
            if (window.confirm("게시글을 복구하시겠습니까?")) {
                // 게시글 복구 요청
                axios.post(`http://localhost:8080/api/admindeleted/restorepost/${bbsId}`)
                    .then(() => {
                        alert("게시글이 복구되었습니다.");
                        router.push('/adminPage/adminDeletedPostPage');
                    })
                    .catch(error => {
                        console.error('Error restoring post:', error);
                        alert('복구 중 오류가 발생했습니다.');
                    });
            }
        }
    };

    // 목록으로 돌아가기 함수
    const handleBack = () => {
        router.push('/adminPage/adminDeletedPostPage');
    };

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList />
            </div>
            <div className={sidebar.content}>
                {post ? (
                    <div className={styles.deletedPostDetailsWrapper}>
                        <h4><strong>{post.title}</strong></h4>
                        <p className={styles.deletedPostDetailsDate}>{new Date(post.deletedAt).toLocaleString()}</p>
                        <hr />
                        <div className={styles.deletedPostDetailsContent}>
                            <p><strong>작성자:</strong> {post.username}</p><br />
                            <hr />
                            <p><strong>글 내용:</strong> {post.content}</p>
                            <br />
                            <hr />
                            <p><strong>게시글 삭제 날짜:</strong>  {post.deletedAt ? new Date(post.deletedAt).toLocaleString() : '삭제 날짜 없음'}</p>
                            <br />
                            <hr />
                        </div>
                            
                        {/* 댓글 목록 표시 */}
                        <div className={styles.commentsSection}>
                            <h3><strong>댓글 목록:</strong></h3>
                            <br />
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.commentId} className={styles.comment}>
                                       <p><strong>{comment.user ? comment.user.username : 'Unknown'}:</strong> {comment.content}</p>                                        
                                       <p className={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>댓글이 없습니다.</p>
                            )}
                        </div>

                        <div className={styles.deletedPostDetailsButtonContainer}>
                            <button className={styles.deletedPostDetailsDeleteButton} onClick={handleDelete}>게시글 영구삭제</button>
                            <button className={styles.deletedPostDetailsRestoreButton} onClick={handleRestore}>게시글 복구</button>
                            <button className={styles.deletedPostDetailsBackButton} onClick={handleBack}>목록</button>
                        </div>
                    </div>
                ) : (
                    <p>게시글을 불러오는 중입니다...</p>
                )}
                
            </div>
        </div>
    );
}
