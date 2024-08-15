import React from 'react';
import styles from '@/styles/myPage/myPage.module.css';
import SideMenu from '@/components/myPage/sideMenu';
import UserInfo from '@/components/myPage/userInfo';
const Index =()=>{
    return <>
        <div className={styles.myPageContainer}>
            <div className={styles.myPageSidebar}>
              <SideMenu/>
            </div>
            <div className={styles.myPageContent}>
              <UserInfo />
            </div>
        </div>
    </>
};

export default Index;