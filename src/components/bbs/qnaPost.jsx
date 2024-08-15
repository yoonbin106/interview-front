import React from "react";
import "@/styles/bbs/qnaPost.module.css";

const QnAPost = () => {
  return (
    <div className="qna-post">
      <h1 className="title">질문이요</h1>
      <div className="meta-info">
        <span className="author">홍길동</span>
        <span className="date">2024.07.23</span>
        <span className="views">조회 0</span>
      </div>
      <hr />
      <div className="question-section">
        <h3 className="question-title">질문?</h3>
        <hr/> 
        <textarea className="answer-box" placeholder="답글" />
        <button className="submit-button">답글 등록</button>
      </div>
      <div className="navigation">
        <div className="nav-text">이전글</div>
        <div className="nav-text">다음글</div>
      </div>
      <div className="footer-buttons">
        <button className="footer-button">수정</button>
        <button className="footer-button">삭제</button>
        <button className="footer-button">목록</button>
      </div>
    </div>
  );
};

export default QnAPost;
