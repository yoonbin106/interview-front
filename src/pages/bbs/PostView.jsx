
import styles from '@/styles/bbs/PostView.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import NestedList from '@/components/bbs/bbsSidebar';
const PostView = () => {
  const [comments, setComments] = useState([
    { id: 1, author: '까떼메야', content: '좋아요!나~ 놀러오세요!나~', date: '2024.07.24' },
    { id: 2, author: '까떼메야', content: '1빠', date: '2024.07.24' },
  ]);
  const [post, setPost] = useState(null)
  return (
    <div className={styles.postView}>
      <PostContent post={post}/>
      <div className={styles.divider}></div>
      <h3>댓글</h3>
      <CommentList comments={comments} />
      <div className={styles.divider}></div>
      <h3>댓글 쓰기</h3>
      <CommentInput onAddComment={(newComment) => setComments([...comments, newComment])} />
    </div>
  );
};
  const PostContent = ({ post }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 

  return (
    <div className={styles.container}>
       <div className={styles.sidebar}>
          <NestedList/>
      </div>
      <div className={styles.postContent}>
       
      
        <h2>제목입니다. 중앙보단 왼쪽이 좀 더 나아보여요</h2>
        <div className={styles.postMeta}>
          <div className={styles.author}>용김동</div>
          <div className={styles.postInfo}>
            
            <span>❤️ 5</span>
            <span>조회 13</span>
            <span>2024.07.23</span>
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
              
            >
              <MenuItem >수정</MenuItem>
              <MenuItem >삭제</MenuItem>
              <MenuItem>신고</MenuItem>
          </Menu>
          </div>
        </div>
        <hr className={styles.divider} />
        <p>
          리더십을 발휘했던 경험은 대학교 프로젝트팀 팀 리더로 활동했던 것입니다.
          저는 5명의 팀원들과 함께 역할 분배하여 프로젝트를 맡았습니다. 역할을 분담하고,
          정기적인 미팅을 통해 진행 상황을 점검했습니다. 처음에는 여러 문제로 어려움을 겪었지만,
          저는 팀원들의 역량을 지극적으로 수용하여 조율하고, 일정 관리를 철저히 하며 프로젝트를 성공적으로 마무리 지을 수 있었습니다.
          이 경험에서 저는 팀워크 향상, 의사소통 능력, 그리고 문제 해결 능력을 기를 수 있었습니다.
        </p>
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
  return (
    <div className={styles.commentItem}>
      <strong>{comment.author}</strong>
      <IconButton
          size="small"
          aria-label="display more actions"
          edge="end"
          color="inherit"
          // 추가적인 클릭 핸들러를 여기에 넣을 수 있습니다
        >
          <MoreVertIcon />
        </IconButton>
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
