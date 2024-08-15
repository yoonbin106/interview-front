import React, { useState, useEffect } from 'react';

const PostPage = ({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    // 데이터베이스에서 게시글 데이터를 가져오는 함수 (예: API 호출)
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`); // 예: API 엔드포인트
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>게시글 데이터를 불러오는 중입니다...</div>;
  }

  return <PostContent post={post} />;
};

export default PostPage;
