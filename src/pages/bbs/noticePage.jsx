import React from 'react';
import  BoardHeader from '@/components/bbs/boardHeader';
import '@/styles/bbs/noticePage.module.css';
import NoticeBoard from '@/components/bbs/noticeBoard';
import Sidebar from '@/components/bbs/bbsSidebar';

const NoticePage = () => {

  return <>
    <Sidebar />
      <div className="notice-page"> 
        <BoardHeader />
        <NoticeBoard />
      </div>
  </>
};

export default NoticePage;