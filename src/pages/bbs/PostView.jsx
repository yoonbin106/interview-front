
import styles from '@/styles/bbs/postView.module.css';

import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import axios from 'axios';
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
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/bbs/${id}`); // 서버의 포스트 API 호출
          console.log("리스폰스 찍기",response);
          
          setPost(response.data);
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
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  if (!post) {
    return <div>No post found</div>; // 포스트가 없는 경우
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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    router.push(`/bbs/editPost?id=${id}`);
    handleClose();
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`http://localhost:8080/bbs/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          router.push('/bbs'); // 게시글 삭제 후 게시판으로 이동
        } else {
          console.error('error:', response.statusText);
          alert('삭제를 실패하였습니다');
        }
      } catch (error) {
        console.error('error:', error);
        alert('삭제를 실패하였습니다');
      }
    }
    handleClose();
  };
  

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
                <MenuItem onClick={handleEdit}>수정</MenuItem>
                <MenuItem onClick={handleDelete}>삭제</MenuItem>
                <MenuItem>신고</MenuItem>
            </Menu>
            </div>
          </div>
          <hr className={styles.divider} />
          <p>
            {post.content}
          </p>
          <div className={styles.files}>
            {post.files && post.files.length > 0 ? (
              post.files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <a href={`http://localhost:8080/bbs/${id}/files/${file.fileIndex}`} target="_blank" rel="noopener noreferrer">
                    {file.fileName || `파일 ${index + 1}`}
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
                <MenuItem >수정</MenuItem>
                <MenuItem >삭제</MenuItem>
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
