import React from 'react';
import '@/styles/bbs/qnaHeader.module.css';

const QnaHeader = () => {
  return (
    
    <div className="qna-header">
      <h1>000키워드로쓴 글</h1>
      <h2>1,338개의 글</h2>
      <div className="qna-header-controls">
        <input type="checkbox" id="pinned" name="pinned" />
        
        <select>
          <option value="15">15개씩</option>
          <option value="30">30개씩</option>
          <option value="50">50개씩</option>
        </select>
      </div>
    </div>
  );
};

export default QnaHeader;