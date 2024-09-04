import React from 'react';

import BoardTable from '@/pages/bbs/bbsPage';
import styles from '@/styles/bbs/bbsPage.module.css';


const BbsPage = () => {

  return <>
    
      <div className={styles.BbsPage}> 
       
        <BoardTable />
      </div>
    
    </>
};

export default BbsPage;