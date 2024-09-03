import styles from '@/styles/bbs/postView.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import userStore from 'stores/userStore';

const PostView = () => {
  const [comments, setComments] = useState([
    { id: 1, author: '까떼메야', content: '좋아요!나~ 놀러오세요!나~', date: '2024.07.24' },
    { id: 2, author: '까떼메야', content: '1빠', date: '2024.07.24' },
  ]);
  const router = useRouter();
  const { id } = router.query;  // URL 파라미터에서 ID를 가져옴
  const [post, setPost] = useState({}); // 포스트 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  
  useEffect(() => {
    console.log("Router query ID:", id);  // ID 값 로그로 출력
    if (id) {
      const fetchPost = async () => {
        try {
          console.log(`Fetching post with ID: ${id}`);  // API 호출 전 ID 출력
          const response = await axios.get(`http://localhost:8080/bbs/${id}`); // 서버의 포스트 API 호출
          console.log("API Response:", response.data);  // API 응답 로그로 출력
          setPost(response.data);
        } catch (error) {
          console.error('Failed to fetch post:', error);  // 오류 발생 시 로그 출력
        } finally {
          setLoading(false);  // 로딩 상태 해제
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

  return (
    <div className={styles.content}>
      <div className={styles.postView}>
        <PostContent post={post}/>
        <div className={styles.divider}></div>
        <h3>댓글</h3>
        <CommentList comments={comments} />
        <div className={styles.divider}></div>
        <h3>댓글 쓰기</h3>
        <CommentInput onAddComment={(newComment) => setComments([...comments, newComment])} />
      </div>
    </div>
  );
};

const PostContent = ({ post }) => {
  const router = useRouter();
  const { id } = router.query;
  const [anchorEl, setAnchorEl] = useState(null);

  const userId = userStore.id; // 현재 로그인한 사용자 ID 가져오기

  const postOwnerId = Number(post.userId?.id) || 0;
  const currentUserId = Number(userId) || 0;
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
        console.log(`Deleting post with ID: ${id}`);  // 삭제 기능 로그 출력
        const response = await fetch(`http://localhost:8080/bbs/${id}?userId=${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log("Post deleted successfully.");  // 성공적으로 삭제된 경우 로그 출력
          router.push('/bbs');
        } else {
          console.error('Failed to delete post:', response.statusText);
          alert('삭제를 실패하였습니다');
        }
      } catch (error) {
        console.error('Error deleting post:', error);  // 삭제 중 오류 발생 시 로그 출력
        alert('삭제를 실패하였습니다');
      }
    }
    handleClose();
  };

  const menuItems = postOwnerId === currentUserId ? [
    <MenuItem key="edit" onClick={handleEdit}>수정</MenuItem>,
    <MenuItem key="delete" onClick={handleDelete}>삭제</MenuItem>,
    <MenuItem key="report">신고</MenuItem>
  ] : [
    <MenuItem key="report">신고</MenuItem>
  ];

  return (
    <div className={styles.postContainer}>
      <h2>{post.title}</h2>
      <div className={styles.postMeta}>
        <div className={styles.author}>{post.username}</div>
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


const CommentList = ({ comments }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
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
      <strong>{comment.author}</strong>
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

const CommentInput = ({ onAddComment }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      console.log("Adding comment:", content);  // 댓글 추가 로그 출력
      onAddComment({
        id: Date.now(),
        author: '용김동',
        content: content,
        date: new Date().toLocaleDateString(),
      });
      setContent('');
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
