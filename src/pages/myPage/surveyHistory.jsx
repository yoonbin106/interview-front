import SurveyHistory from "@/components/myPage/surveyHistory";
import styles from '@/styles/myPage/myPage.module.css';
import SideMenu from '@/components/myPage/sideMenu';
const Index = () => {
    return <>
    <div className={styles.myPageContainer}>
        <div className={styles.myPageSidebar}>
          <SideMenu/>
        </div>
        <div className={styles.myPageContent}>
            <SurveyHistory/>
        </div>
    </div>
</>
};

export default Index;
