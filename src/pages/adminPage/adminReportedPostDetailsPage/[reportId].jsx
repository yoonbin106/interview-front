import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/adminPage/adminReportedPostDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

export default function AdminReportedPostDetailsPage() {
    const router = useRouter();
    const { reportId } = router.query;  // reportId 동적 라우팅 값 추출
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        if(reportId){
            axios.get(`http://localhost:8080/api/adminreported/reportedposts/${reportId}`)
                .then(response => {
                    console.log(response.data); // 응답 데이터 확인용 로그
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
            if (window.confirm("게시글을 완전히 삭제하시겠습니까?")) {
                    // 게시글 삭제 요청 
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
            if (window.confirm("게시글을 복구하시겠습니까?")) {
                // 게시글 복구 요청
            axios.post(`http://localhost:8080/api/adminreported/restorepost/${reportId}`)
            .then(() => {
            alert('게시글이 복구되었습니다.');
            router.push('/adminPage/adminReportedPostPage');
        }) 
        .catch (error => {
            console.error('Error restoring post:', error);
            alert('게시글 복구 중 오류가 발생했습니다.');
        });
    }
}
    };

    // 목록으로 돌아가기 함수
    const handleBack = () => {
        router.push('/adminPage/adminDeletedPostPage');
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
                    <div className={styles.reportedPostDetailsWrapper}>
                        <h4><strong>글 제목:</strong>　{post.title}</h4>
                        <br />
                        <hr />
                        <div className={styles.reportedPostDetailsContent}>
                            <p><strong>작성자:　</strong> {post.username}</p><br />
                            <hr />
                            <p><strong>글 내용:　</strong> {post.content}</p>
                            <br />
                            <hr />
                            <p><strong>신고 사유:　</strong> {post.reason}</p>
                          <br />
                          <hr />
                          <p><strong>신고자:　</strong> {post.reporterName}</p>
                            <br />
                            <hr />
                            <p><strong>게시글 신고 날짜:　</strong> {new Date(post.reportedAt).toLocaleString()}</p>
                            <br />
                            <hr />
                        </div>
                            
                       

                        <div className={styles.reportedPostDetailsButtonContainer}>
                            <button className={styles.reportedPostDetailsDeleteButton} onClick={handleDelete}>게시글 영구삭제</button>
                            <button className={styles.reportedPostDetailsHideButton} onClick={handleRestore}>게시글 복구</button>
                            <button className={styles.reportedPostDetailsBackButton} onClick={handleBack}>목록</button>
                        </div>
                    </div>
                ) : (
                    <p>게시글을 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
}
