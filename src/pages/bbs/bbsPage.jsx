import React from 'react';
import '@/styles/bbs/bbsPage.module.css';
import Sidebar from '@/components/bbs/bbsSidebar';
import BoardHeader from '@/components/bbs/boardHeader';
import BoardTable from '@/components/bbs/boardTable';

const BbsPage = () => {

  return <>
    <Sidebar />
      <div className="bbs-page"> 
        <BoardHeader />
        <BoardTable />
      </div>
  </>
};

export default BbsPage;