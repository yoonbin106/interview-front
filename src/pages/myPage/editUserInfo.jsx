import EditUserInfo from "@/components/myPage/editUserInfo";
import styles from '@/styles/myPage/myPage.module.css';
import SideMenu from '@/components/myPage/sideMenu';
const Index = () => {
    return <>
        <div className={styles.myPageContainer}>
            <div className={styles.myPageSidebar}>
              <SideMenu/>
            </div>
            <div className={styles.myPageContent}>
                <EditUserInfo/>
            </div>
        </div>
    </>
};

export default Index;
