import React, { useEffect, useState } from 'react';
import '@/styles/bbs/boardTable.module.css';
import axios from 'axios';

const BoardTable = () => {
  
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get('http://localhost:8080/bbs/board');
          setPosts(response.data);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, []);
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    };
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
    /*
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    */
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    //const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    //const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  return (
    <div className="board-container">
      <div className="board">
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
              <th>❤️</th>
            </tr>
          </thead>
           <tbody>
            {posts.map((post, index) => (
              <tr key={post.bbs_id}>
                <td>
                  <a href={`/post/${post.bbs_id}`}>
                    {index === 0 && <span className="notice">[공지]</span>}
                    {post.title}
                  </a>
                </td>
                <td>{post.user_id}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="board-footer">
        <div className="button-container">
          <a href="@/components/bbs/createPost" className="createPost-button">글 등록</a>
        </div>

        <div className="pagination-container">
          
          {/* 페이지 번호 버튼 추가 */}
          <button>1</button>
          <button>2</button>
          <button>3</button>
          {/* 더 많은 페이지 버튼들... */}
        </div>

        <div className="search-container">
          <input type="text" placeholder="검색..." className="search-input" />
          <button className="search-button">검색</button>
        </div>
      </div>
    </div>
  );
};

export default BoardTable;