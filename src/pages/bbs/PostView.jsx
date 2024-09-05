import styles from '@/styles/bbs/postView.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import userStore from 'stores/userStore';
import ReportModal from '@/pages/bbs/reportModal';


const PostView = () => {
  const [comments, setComments] = useState([
    { id: 1, author: '까떼메야', content: '좋아요!나~ 놀러오세요!나~', date: '2024.07.24' },
    { id: 2, author: '까떼메야', content: '1빠', date: '2024.07.24' },
  ]);
  const router = useRouter();
  const { id } = router.query;  // URL 파라미터에서 ID를 가져옴
  const [post, setPost] = useState({}); // 포스트 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isReportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 상태 추가
  
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/bbs/${id}`);
          setPost(response.data);
          // 댓글을 가져오는 부분 수정
          const commentResponse = await axios.get(`http://localhost:8080/bbs/${id}/comments`);  // 변수명 수정
          setComments(commentResponse.data);  // 서버에서 받은 댓글 데이터를 설정
        } catch (error) {
          console.error('Failed to fetch post:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPost();
    }
  }, [id]);
  

  if (loading) {
    console.log("Loading...");  // 로딩 중 상태 로그로 출력
    return <div>Loading...</div>;
  }

  if (!post || Object.keys(post).length === 0) {
    console.log("No post found");  // 게시물이 없는 경우 로그 출력
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
        <CommentList comments={comments} setComments={setComments} />  {/* 수정한부분 쪼아욧 */}
        <div className={styles.divider}></div>
        <h3>댓글 쓰기</h3>
        <CommentInput postId={id} setComments={setComments} /> {/* 수정한부분 쪼아욧 */}
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

  const userId = post.userId?.username || 'Anonymous';  // 사용자 아이디 또는 Anonymous

  const postOwnerId = Number(post.userId?.id) || 0;
  const currentUserId = Number(userStore.id) || 0; // 현재 로그인한 사용자의 ID를 userStore에서 가져옵니다.

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log(`Editing post with ID: ${id}`);  // 수정 기능 로그 출력
    router.push(`/bbs/editPost?id=${id}`);
    handleClose();
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        console.log(`Deleting post with ID: ${id}, userId: ${userId}`); // 삭제 요청 전 로그 출력
        
        const response = await axios.delete(`http://localhost:8080/bbs/${id}`, {
          params: { userId: userStore.id },  // userId를 query parameter로 전달
        });
  
        if (response.status === 200) {
          console.log("Post deleted successfully.");
          router.push('/bbs');
        } else {
          console.error('Failed to delete post:', response.statusText);
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

  const menuItems = postOwnerId === currentUserId ? [
    <MenuItem key="edit" onClick={handleEdit}>수정</MenuItem>,
    <MenuItem key="delete" onClick={handleDelete}>삭제</MenuItem>,
    <MenuItem key="report" onClick={handleReport}>신고</MenuItem>  // 신고 클릭 시 모달 열기
  ] : [
    <MenuItem key="report" onClick={handleReport}>신고</MenuItem>  // 신고 클릭 시 모달 열기
  ];

  return (
    <div className={styles.postContainer}>
      <h2>{post.title}</h2>
      <div className={styles.postMeta}>
        <div className={styles.author}>{userId}</div>
        <div className={styles.postInfo}>
          <span>❤️ 5</span>
          <span>조회 13</span>
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
const CommentList = ({ comments }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment, index) => (
        <CommentItem key={`${comment.id}-${index}`} comment={comment} />  // 고유 키 생성
      ))}
    </div>
  );
};
const CommentItem = ({ comment }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.commentItem}>
        {/* author 대신 username으로 수정 */}
        <strong>{comment.username}</strong> {/* 수정한 부분 */}
      <IconButton
        size="small"
        aria-label="display more actions"
        edge="end"
        color="inherit"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>수정</MenuItem>
        <MenuItem>삭제</MenuItem>
        <MenuItem>신고</MenuItem>
      </Menu>
      <p>{comment.content}</p>
      <span>{comment.date}</span>
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
