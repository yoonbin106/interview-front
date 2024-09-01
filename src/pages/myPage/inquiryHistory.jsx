import InquiryHistory from "@/components/myPage/inquiryHistory";
import styles from '@/styles/myPage/myPage.module.css';
import SideMenu from '@/components/myPage/sideMenu';
import BbsQnaList from "@/components/bbs/bbsQnaList";
const Index = () => {
    return <>
    <div className={styles.myPageContainer}>
        <div className={styles.myPageSidebar}>
          <SideMenu/>
        </div>
        <div className={styles.myPageContent}>
          <BbsQnaList />
        </div>
    </div>
</>
};

export default Index;
