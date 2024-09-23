import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostView from '@/pages/bbs/postView'; // 경로가 맞는지 확인

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/bbs/${id}`);
          setPost(response.data);
        } catch (error) {
          setError('Failed to fetch post data');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  

  return (
    <div>
      <PostView post={post} />
    </div>
  );
};

export default PostPage;
