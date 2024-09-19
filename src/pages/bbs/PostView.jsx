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
  const [post, setPost] = useState(null); // 포스트 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isReportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 상태 추가
  const [liked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const incrementValue = increment === 'false' ? 'false' : 'true';
          const response = await axios.get(`http://localhost:8080/bbs/${id}?increment=${incrementValue}`);
          setPost(response.data);

          // 댓글을 가져오는 부분 수정
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

  if (!post) {
    return <div>No post found</div>;
  }

  // 신고된 게시물일 경우 해당 메시지 출력
  if (post.deletedReason === 1) {
    return <div>신고된 게시글입니다.</div>;
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
        <CommentList comments={comments} setComments={setComments} />
        <div className={styles.divider}></div>
        <h3>댓글 쓰기</h3>
        <CommentInput postId={id} setComments={setComments} />
      </div>

      {/* 신고 모달 컴포넌트 추가 */}
      <ReportModal 
        open={isReportModalOpen} 
        onClose={closeReportModal} 
        postId={id}
        postAuthor={post.username}  // 작성자 이름 전달
        postContent={post.content}  // 게시글 내용 전달
      />
    </div>
  );
};

const PostContent = ({ post, openReportModal }) => {
  const router = useRouter();
  const { id } = router.query;
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setIsLiked] = useState(false);
  const userId = userStore.id || 'Anonymous';  // 사용자 아이디 또는 Anonymous
  const [postData, setPost] = useState(post); 
  const postOwnerId = Number(post.userId?.id) || 0;
  const currentUserId = Number(userStore.id) || 0; // 현재 로그인한 사용자의 ID를 userStore에서 가져옴

  
  
  
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
          params: { userId: userStore.id },  // userId를 query parameter로 전달
        });
  
        if (response.status === 200) {
          router.push('/bbs');
        } else {
          alert('삭제를 실패하였습니다');
        }
      } catch (error) {
        console.error('Error deleting post:', error); // 오류 발생 시 콘솔에 상세 정보 출력
        alert('삭제를 실패하였습니다');
      }
    }
    handleClose();
  };

  const handleReport = () => {
    openReportModal();  // 신고 모달 열기
    handleClose();  // 메뉴 닫기
  };

  // 내 게시물에서는 수정/삭제 버튼만, 다른 사람의 게시물에서는 신고 버튼만 보이도록 조건 처리
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
        <div className={styles.author}>{post.username}</div>
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

const CommentItem = ({ comment, setComments }) => {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [newContent, setNewContent] = useState(comment.content); // 수정할 댓글 내용
  const [anchorEl, setAnchorEl] = useState(null);
  const [isReportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 상태
  
  const commentOwnerId = Number(comment.user?.id) || 0;  // 댓글 작성자의 ID를 숫자로 변환하여 처리
  const currentUserId = Number(userStore.id) || 0;  // 현재 로그인한 사용자 ID를 숫자로 변환하여 처리

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true); // 수정 모드로 전환
    handleClose();
  };

  const handleSaveClick = async () => {
    try {
      const commentId = comment.commentId;  // 수정할 댓글의 ID
      const response = await axios.put(`http://localhost:8080/bbs/comments/${commentId}`, {
        content: newContent,  // 수정된 내용
      });
  
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.map((c) => 
            c.commentId === commentId ? { ...c, content: newContent } : c // 특정 commentId에 맞는 댓글만 수정
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
    setReportModalOpen(true);  // 신고 모달 열기
    handleClose();
  };

  const closeReportModal = () => {
    setReportModalOpen(false);  // 신고 모달 닫기
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

      {/* 신고 모달 */}
      <ReportModal 
        open={isReportModalOpen} 
        onClose={closeReportModal} 
        commentId={comment.commentId}  // 댓글 ID 전달
        commentAuthor={comment.username}  // 댓글 작성자 전달
        commentContent={comment.content}  // 댓글 내용 전달
      />
    </div>
  );
};

// 댓글 입력 컴포넌트 (서버로 등록 요청)
const CommentInput = ({ postId, setComments }) => {
  const [content, setContent] = useState('');
  const userId = userStore.id; // 현재 로그인한 사용자 ID 가져오기

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
        setContent('');  // 입력 필드 초기화
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
