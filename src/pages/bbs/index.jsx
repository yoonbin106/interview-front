import React from 'react';

import BoardTable from '@/components/bbs/boardTable';
import styles from '@/styles/bbs/bbsPage.module.css';


const BbsPage = () => {

  return <>
    
      <div className={styles.BbsPage}> 
       
        <BoardTable />
      </div>
    
    </>
};

export default BbsPage;