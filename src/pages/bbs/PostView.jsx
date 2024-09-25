import styles from '@/styles/bbs/postView.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import userStore from 'stores/userStore';
import ReportModal from '@/pages/bbs/reportModal';
import { Typography, Divider, Box, Card, CardContent } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

const PostView = () => {
  const [comments, setComments] = useState([]); // 댓글 리스트 상태 관리
  const [post, setPost] = useState({}); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [isReportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 열림 상태
  const router = useRouter();
  const { id, increment } = router.query; // URL 파라미터에서 게시글 ID 및 조회수 증가 여부 가져오기

  // 게시글과 댓글 데이터를 서버에서 가져오는 함수
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const incrementValue = increment === 'false' ? 'false' : 'true';
          const response = await axios.get(`http://localhost:8080/bbs/${id}?increment=${incrementValue}`);

          // 게시글 데이터와 날짜 포맷 설정
          const postData = response.data;
          const formattedDate = new Date(postData.createdAt).toLocaleTimeString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24시간 형식
          });

          setPost({ ...postData, formattedDate }); // 게시글 데이터 설정

          // 댓글 데이터 가져오기
          const commentResponse = await axios.get(`http://localhost:8080/bbs/${id}/comments`);
          setComments(commentResponse.data); // 댓글 데이터 설정
        } catch (error) {
          console.error('Failed to fetch post:', error); // 오류 처리
        } finally {
          setLoading(false); // 로딩 상태 종료
        }
      };
      fetchPost();
    }
  }, [id, increment]);

  // 로딩 중일 때 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 게시글이 없을 때 처리
  if (!post || Object.keys(post).length === 0) {
    return <div>No post found</div>;
  }

  // 신고 모달 열기
  const openReportModal = () => {
    setReportModalOpen(true);
  };

  // 신고 모달 닫기
  const closeReportModal = () => {
    setReportModalOpen(false);
  };

  return (
    <div className={styles.content}>
      <div className={styles.postView}>
        {/* 게시글 본문 */}
        <PostContent post={post} openReportModal={openReportModal} />

        {/* 구분선 */}
        <Divider sx={{ marginY: 2, Color: '#bebcbc', borderWidth: 1 }} />

        {/* 댓글 섹션 */}
        <Card variant="outlined" sx={{ marginBottom: 2, border: 'none', boxShadow: 'none' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <CommentIcon sx={{ marginRight: 1, fontSize: 30, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                댓글
              </Typography>
            </Box>
            <CommentList comments={comments} setComments={setComments} /> {/* 댓글 리스트 */}
          </CardContent>
        </Card>

        {/* 구분선 */}
        <Divider sx={{ marginY: 2, Color: '#bebcbc', borderWidth: 1 }} />

        {/* 댓글 쓰기 섹션 */}
        <Card variant="outlined" sx={{ marginBottom: 2, border: 'none', boxShadow: 'none' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <CommentIcon sx={{ marginRight: 1, fontSize: 30, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                댓글 쓰기
              </Typography>
            </Box>
            <CommentInput post={post} postId={id} setComments={setComments} /> {/* 댓글 입력 */}
          </CardContent>
        </Card>
      </div>

      {/* 신고 모달 */}
      <ReportModal
        open={isReportModalOpen}
        onClose={closeReportModal}
        postId={id}
        postAuthor={post.username}
        postContent={post.content}
      />
    </div>
  );
};

// 게시글 본문 컴포넌트
const PostContent = ({ post, openReportModal }) => {
  const router = useRouter();
  const { id } = router.query;
  const [anchorEl, setAnchorEl] = useState(null); // 메뉴 버튼 상태
  const postOwnerId = Number(post.userId?.id) || 0; // 게시글 작성자의 ID
  const currentUserId = Number(userStore.id) || 0; // 현재 로그인된 사용자의 ID

  // 신고된 게시글에 대한 처리
  if (post.deletedReason === 1) {
    return (
      <div className={styles.reportedContainer}>
        <span className={styles.reportedIcon}>⚠️</span>
        신고 접수된 게시글, 현재 관리자의 검토가 진행 중입니다.
      </div>
    );
  }

  // 메뉴 버튼 클릭 핸들러
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기 핸들러
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 게시글 수정 핸들러
  const handleEdit = () => {
    router.push(`/bbs/editPost?id=${id}&increment=false`);
    handleClose();
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/bbs/${id}`, {
          params: { userId: userStore.id },
        });

        if (response.status === 200) {
          router.push('/bbs'); // 삭제 후 게시판 목록으로 이동
        } else {
          alert('삭제를 실패하였습니다');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('삭제를 실패하였습니다');
      }
    }
    handleClose();
  };

  // 게시글 신고 핸들러
  const handleReport = () => {
    openReportModal(); // 신고 모달 열기
    handleClose();
  };

  // 메뉴 아이템 (게시글 작성자는 수정/삭제 가능, 다른 사용자는 신고 가능)
  const menuItems = postOwnerId === currentUserId ? [
    <MenuItem key="edit" onClick={handleEdit}>수정</MenuItem>,
    <MenuItem key="delete" onClick={handleDelete}>삭제</MenuItem>
  ] : [
    <MenuItem key="report" onClick={handleReport}>신고</MenuItem>
  ];

  return (
    <div className={styles.postContainer}>
      <h2>{post.title}</h2>
      <div className={styles.postMeta}>
        <div className={styles.author}>
          {post.username}
          <span className={styles.postTime}>{post.formattedDate}</span>
        </div>
        <div className={styles.postInfo}>
          <span>조회 {post.hitCount || 0}</span>
          
          <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
            style={{ color: 'black', fontSize: '24px' }}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {menuItems}
          </Menu>
        </div>
      </div>
      <hr className={styles.divider} />
      <p>{post.content}</p>

      {/* 첨부 파일 목록 */}
      <div className={styles.files}>
        {post.files && Object.keys(post.files).length > 0 ? (
          Object.keys(post.files).map((fileName, index) => (
            <div key={index} className={styles.fileItem}>
              <a
                href={`http://localhost:8080/bbs/${id}/files/${fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fileLink}
              >
                <div className={styles.fileName}>📄{fileName}</div>
              </a>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

// 댓글 목록 컴포넌트
const CommentList = ({ comments, setComments }) => {
  // 작성일자에 따라 댓글 정렬 (오름차순)
  const sortedComments = [...comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className={styles.commentList}>
      {sortedComments.map((comment, index) => (
        <CommentItem key={`${comment.commentId}-${index}`} comment={comment} setComments={setComments} />
      ))}
    </div>
  );
};

// 댓글 아이템 컴포넌트 (댓글 수정, 삭제, 신고 처리 포함)
const CommentItem = ({ comment, setComments }) => {
  const [isEditing, setIsEditing] = useState(false); // 댓글 수정 모드 상태
  const [newContent, setNewContent] = useState(comment.content); // 수정된 댓글 내용 상태
  const [anchorEl, setAnchorEl] = useState(null); // 메뉴 버튼 상태
  const [isReportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 열림 상태

  const commentOwnerId = Number(comment.user?.id) || 0;
  const currentUserId = Number(userStore.id) || 0;

  // 신고된 댓글에 대한 처리
  if (comment.deletedReason === 1) {
    return (
      <div className={styles.reportedCommentContainer}>
        <span className={styles.commentIcon}>⚠️</span>
        신고 접수된 댓글, 현재 관리자의 검토가 진행 중입니다.
      </div>
    );
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 댓글 수정 버튼 클릭 시
  const handleEditClick = () => {
    setIsEditing(true);
    handleClose();
  };

  // 댓글 수정 저장 처리
  const handleSaveClick = async () => {
    try {
      const commentId = comment.commentId;
      const response = await axios.put(`http://localhost:8080/bbs/comments/${commentId}`, {
        content: newContent,
      });

      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.commentId === commentId ? { ...c, content: newContent } : c
          )
        );
        setIsEditing(false); // 수정 모드 종료
      } else {
        console.error("Failed to update comment:", response.statusText);
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  // 댓글 삭제 처리
  const handleDeleteClick = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/bbs/comments/${comment.commentId}`);
        if (response.status === 200) {
          setComments(prevComments => prevComments.filter(c => c.commentId !== comment.commentId));
        }
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
    handleClose();
  };

  // 댓글 신고 모달 열기
  const openReportModal = () => {
    setReportModalOpen(true);
    handleClose();
  };

  // 댓글 신고 모달 닫기
  const closeReportModal = () => {
    setReportModalOpen(false);
  };

  return (
    <div className={styles.commentItem}>
      <strong>{comment.username}</strong>
      {isEditing ? (
        <div style={{ marginTop: '10px' }}> {/* 작성자 밑에 댓글 수정 필드 배치 */}
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }} // 댓글 입력 필드 스타일
          />
          <div>
            <button onClick={handleSaveClick} style={{ marginRight: '10px' }}>
              저장
            </button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        </div>
      ) : (
        <div className={styles.commentContainer}>
          <p className={styles.commentContent}>{comment.content}</p>
          <p className={styles.commentTime}>
            {new Date(comment.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </p>
          <IconButton size="small" aria-label="more actions" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {commentOwnerId === currentUserId ? (
              <>
                <MenuItem onClick={handleEditClick}>수정</MenuItem>
                <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
              </>
            ) : (
              <MenuItem onClick={openReportModal}>신고</MenuItem>
            )}
          </Menu>
        </div>
      )}

      <ReportModal
        open={isReportModalOpen}
        onClose={closeReportModal}
        commentId={comment.commentId}
        commentAuthor={comment.username}
        commentContent={comment.content}
      />
    </div>
  );
};

// 댓글 입력 컴포넌트
const CommentInput = ({ post, postId, setComments }) => {
  const [content, setContent] = useState('');
  const userId = userStore.id;

  // 댓글 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      try {
        const response = await axios.post(`http://localhost:8080/bbs/${postId}/comments`, {
          userId: userId,
          content: content,
        });

        const newComment = response.data;
        setComments((prevComments) => [...prevComments, newComment]); // 새 댓글 추가
        setContent(''); // 입력 필드 초기화
      } catch (error) {
        console.error('Failed to add comment:', error);
      }

      // 알림 전송을 위한 메시지 데이터 준비
      const messageData = {
        text: content,
        bbsId: post.bbsId.toString(),
        bbsTitle: post.title,
        sender: userStore.username,
        senderId: userStore.id.toString(),
        receiverId: post.userId.id.toString(),
        contentId: postId.toString(),
        timestamp: new Date().toISOString(),
        type: 'bbs'
      };

      try {
        await axios.post('http://192.168.0.137:8000/sendComment', messageData); // 댓글 알람 전송
      } catch (error) {
        console.error("댓글 알람 전송 중 오류 발생:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentInput}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력해주세요"
      />
      <button type="submit">등록</button>
    </form>
  );
};

export default PostView;
