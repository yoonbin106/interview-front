import React from 'react';
import '@/styles/bbs/boardHeader.module.css';

const BoardHeader = () => {
  return (
    
    <div className="board-header">
      <h1>000키워드로쓴 글</h1>
      <h2>1,338개의 글</h2>
      <div className="board-header-controls">
        <input type="checkbox" id="pinned" name="pinned" />
        <label htmlFor="pinned">공지사항 숨기기</label>
        <select>
          <option value="15">15개씩</option>
          <option value="30">30개씩</option>
          <option value="50">50개씩</option>
        </select>
      </div>
    </div>
  );
};

export default BoardHeader;