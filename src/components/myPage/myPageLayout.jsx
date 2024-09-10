import SideMenu from '@/components/myPage/sideMenu';
import styles from '@/styles/myPage/myPage.module.css';

const MyPageLayout = ({ children }) => {
  return (
    <div className={styles.myPageContainer}>
      <div className={styles.myPageSidebarFrame}>
        <div className={styles.myPageSidebar}>
          <SideMenu />
        </div>
      </div>
      <div className={styles.myPageContent}>
        {children}
      </div>
    </div>
  );
};

export default MyPageLayout;