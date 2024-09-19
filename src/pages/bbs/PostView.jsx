import styles from '@/styles/bbs/postView.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import userStore from 'stores/userStore';
import ReportModal from '@/pages/bbs/reportModal';

const PostView = () => {
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id, increment } = router.query;  // URL 파라미터에서 ID를 가져옴
  const [post, setPost] = useState({}); // 포스트 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isReportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 상태 추가
  
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const incrementValue = increment === 'false' ? 'false' : 'true';
          const response = await axios.get(`http://localhost:8080/bbs/${id}?increment=${incrementValue}`);
         
          // 포맷팅된 날짜를 추가하여 상태 업데이트
          const postData = response.data;
          const formattedDate = new Date(postData.createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
          });

          setPost({ ...postData, formattedDate });
          
          // 댓글 가져오기
          const commentResponse = await axios.get(`http://localhost:8080/bbs/${id}/comments`);
          setComments(commentResponse.data);  // 서버에서 받은 댓글 데이터를 설정

          
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id, increment]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post || Object.keys(post).length === 0) {
    return <div>No post found</div>;
  }

  const openReportModal = () => {
    setReportModalOpen(true); // 신고 모달 열기
  };

  const closeReportModal = () => {
    setReportModalOpen(false); // 신고 모달 닫기
  };

  return (
    <div className={styles.content}>
      <div className={styles.postView}>
        <PostContent post={post} openReportModal={openReportModal} />
        <div className={styles.divider}></div>
        <h3>댓글</h3>
        <CommentList comments={comments} setComments={setComments} />  {/* 댓글 리스트 */}
        <div className={styles.divider}></div>
        <h3>댓글 쓰기</h3>
        <CommentInput postId={id} setComments={setComments} />  {/* 댓글 입력 */}
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

const PostContent = ({ post, openReportModal }) => {
  const router = useRouter();
  const { id } = router.query;
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setIsLiked] = useState(post.userLiked || false);
  const userId = userStore.id || 'Anonymous';  // 사용자 아이디 또는 Anonymous
  const [postData, setPost] = useState(post); 
  const postOwnerId = Number(post.userId?.id) || 0;
  const currentUserId = Number(userStore.id) || 0; 

  // 신고된 게시글 처리
  if (post.deletedReason === 1) {
    return (
      <div className={styles.reportedContainer}>
        <span className={styles.icon}>⚠️</span>
        신고 접수된 게시글, 현재 관리자의 검토가 진행 중입니다.
      </div>
    );
  }

  
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    router.push(`/bbs/editPost?id=${id}&increment=false`);
    handleClose();
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/bbs/${id}`, {
          params: { userId: userStore.id },
        });

        if (response.status === 200) {
          router.push('/bbs');
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

  const handleReport = () => {
    openReportModal();
    handleClose();
  };

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
            {post.username} <span className={styles.postTime}>({post.formattedDate})</span>
        </div>
        <div className={styles.postInfo}>
          
          <span>조회 {post.hitCount || 0}</span>
          <span>{post.date}</span>
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {menuItems}
          </Menu>
        </div>
      </div>
      <hr className={styles.divider} />
      <p>{post.content}</p>
      <div className={styles.files}>
        {post.files && Object.keys(post.files).length > 0 ? (
          Object.keys(post.files).map((fileName, index) => (
            <div key={index} className={styles.fileItem}>
              <a 
                href={`http://localhost:8080/bbs/${id}/files/${fileName}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {fileName}
              </a>
            </div>
          ))
        ) : (
          <p>파일이 없습니다.</p>
        )}
      </div>
    </div>
  );
};


// 댓글 목록 컴포넌트
const CommentList = ({ comments, setComments }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment, index) => (
        <CommentItem key={`${comment.commentId}-${index}`} comment={comment} setComments={setComments} />
      ))}
    </div>
  );
};

// 신고된 댓글 처리 추가
const CommentItem = ({ comment, setComments }) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [newContent, setNewContent] = useState(comment.content); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [isReportModalOpen, setReportModalOpen] = useState(false); 
  
  const commentOwnerId = Number(comment.user?.id) || 0;  
  const currentUserId = Number(userStore.id) || 0;  

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

  const handleEditClick = () => {
    setIsEditing(true);
    handleClose();
  };

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
        setIsEditing(false); 
      } else {
        console.error("Failed to update comment:", response.statusText);
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

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

  const openReportModal = () => {
    setReportModalOpen(true);
    handleClose();
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
  };
  
  return (
    <div className={styles.commentItem}>
      <strong>{comment.username}</strong>
      {isEditing ? (
        <>
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={handleSaveClick}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </>
      ) : (
        <>
          <div className={styles.commentContainer}>
            <p className={styles.commentContent}>{comment.content}</p>
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
        </>
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
const CommentInput = ({ postId, setComments }) => {
  const [content, setContent] = useState('');
  const userId = userStore.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      try {
        const response = await axios.post(`http://localhost:8080/bbs/${postId}/comments`, {
          userId: userId,
          content: content,
        });

        const newComment = response.data;
        setComments((prevComments) => [...prevComments, newComment]);
        setContent(''); 
      } catch (error) {
        console.error('Failed to add comment:', error);
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
