import React from 'react';
import BoardHeader from '@/components/bbs/boardHeader';
import BoardTable from '@/components/bbs/boardTable';
import '@/styles/bbs/bbsPage.module.css';
import Sidebar from '@/components/bbs/bbsSidebar';

const BbsPage = () => {

  return <>
    <Sidebar/>
      <div className="bbs-page"> 
        <BoardHeader />
        <BoardTable />
      </div>
    
    </>
};

export default BbsPage;