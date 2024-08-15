import React from 'react';
import QnaTable from '@/components/bbs/qnaTable';
import QnaHeader from '@/components/bbs/qnaHeader';
import '@/styles/bbs/adminBbsPage.module.css';
import Sidebar from '@/components/bbs/bbsSidebar';

const AdminBbsPage = () => {

  return <>
    <Sidebar />
      <div className="adminBbs-page"> 
        <QnaHeader />
        <QnaTable />
      </div>
    
    </>
};

export default AdminBbsPage;
