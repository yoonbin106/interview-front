import * as React from 'react';
import { useRouter } from 'next/router'; // Next.js의 useRouter 사용
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import ArticleIcon from '@mui/icons-material/Article';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CampaignSharpIcon from '@mui/icons-material/CampaignSharp';
import WarningSharpIcon from '@mui/icons-material/WarningSharp';
import HomeIcon from '@mui/icons-material/Home';
import styles from '@/styles/adminPage/adminSideMenu.module.css'; // CSS 모듈 임포트
import DeleteIcon from '@mui/icons-material/Delete';

export default function NestedList() {
  const router = useRouter(); // Next.js의 페이지 이동을 위한 useRouter 훅
  const [openItems, setOpenItems] = React.useState({
    home: false,
    inquiry: false,
    members: false,
    reports: false,
    payments: false,
    posts: false,
  });

  // 리스트 아이템을 클릭했을 때 해당 아이템의 열림/닫힘 상태를 토글
  const handleClick = (item) => {
    setOpenItems((prevState) => ({ ...prevState, [item]: !prevState[item] }));
  };

  // 지정된 경로로 페이지 이동
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <List
      className={styles.list} // 스타일 적용
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          className={styles.subheader} // 스타일 적용
          onClick={() => handleNavigation('/adminPage')} // 홈 아이콘 클릭 시 메인 페이지로 이동
        >
          <HomeIcon />
          {/* 관리자 페이지 홈으로 이동 */}
          　관리자 페이지
        </ListSubheader>
      }
    >
      {/* 공지사항 섹션 */}
      <ListItemButton onClick={() => handleClick('home')} className={styles.cursorPointer}>
        <ListItemIcon>
          <CampaignSharpIcon /> {/* 공지사항 아이콘 */}
        </ListItemIcon>
        <ListItemText primary="공지사항" />
        {openItems.home ? <ExpandLess /> : <ExpandMore />} {/* 아이템 열림/닫힘 상태에 따라 아이콘 변경 */}
      </ListItemButton>
      <Collapse in={openItems.home} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 전체 공지사항 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminNoticePage')}>
            <ListItemText primary="　전체 공지사항" />
          </ListItemButton>
          {/* 관리자 공지사항 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminAdminNoticePage')}>
            <ListItemText primary="　관리자 공지사항" />
          </ListItemButton>
           {/* 기업별 공지사항 페이지로 이동 */}
           <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminCompanyNoticePage')}>
            <ListItemText primary="　기업별 공지사항" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 문의 관리 섹션 */}
      <ListItemButton onClick={() => handleClick('inquiry')} className={styles.cursorPointer}>
        <ListItemIcon>
          <QuestionAnswerIcon /> {/* 문의 관리 아이콘 */}
        </ListItemIcon>
        <ListItemText primary="문의관리" />
        {openItems.inquiry ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.inquiry} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 자주 묻는 질문 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminFaqPage')}>
            <ListItemText primary="　자주 묻는 질문" />
          </ListItemButton>
          {/* 문의내역 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminQnaPage')}>
            <ListItemText primary="　문의내역" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 회원 관리 섹션 */}
      <ListItemButton onClick={() => handleClick('members')} className={styles.cursorPointer}>
        <ListItemIcon>
          <PeopleIcon /> {/* 회원 관리 아이콘 */}
        </ListItemIcon>
        <ListItemText primary="회원관리" />
        {openItems.members ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.members} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 회원 조회 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminUserPage')}>
            <ListItemText primary="　회원조회" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 신고 관리 섹션 */}
      <ListItemButton onClick={() => handleClick('reports')} className={styles.cursorPointer}>
        <ListItemIcon>
          <WarningSharpIcon /> {/* 신고 관리 아이콘 */}
        </ListItemIcon>
        <ListItemText primary="신고관리" />
        {openItems.reports ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.reports} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 게시글 신고 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminReportedPostPage')}>
            <ListItemText primary="　게시글 신고" />
          </ListItemButton>
          {/* 댓글 신고 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminReportedCommentPage')}>
            <ListItemText primary="　댓글 신고" />
          </ListItemButton>
          {/* 완료 처리된 게시글 관리 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminReportedFinPostPage')}>
            <ListItemText primary="　완료처리-게시글" />
          </ListItemButton>
          {/* 완료 처리된 댓글 관리 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminReportedFinCommentPage')}>
            <ListItemText primary="　완료처리-댓글" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 결제 관리 섹션 */}
      <ListItemButton onClick={() => handleClick('payments')} className={styles.cursorPointer}>
        <ListItemIcon>
          <PaymentIcon /> {/* 결제 관리 아이콘 */}
        </ListItemIcon>
        <ListItemText primary="결제관리" />
        {openItems.payments ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.payments} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 결제 내역 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminPaymentPage')}>
            <ListItemText primary="　결제내역" />
          </ListItemButton>
          {/* 환불 내역 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminRefundPage')}>
            <ListItemText primary="　환불내역" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 게시글 관리 섹션 */}
      <ListItemButton onClick={() => handleClick('posts')} className={styles.cursorPointer}>
        <ListItemIcon>
          <DeleteIcon /> {/* 게시글 관리 아이콘 */}
        </ListItemIcon>
        <ListItemText primary="삭제관리" />
        {openItems.posts ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.posts} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 삭제된 글 관리 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminDeletedPostPage')}>
            <ListItemText primary="　삭제된 글" />
          </ListItemButton>
          {/* 삭제된 댓글 관리 페이지로 이동 */}
          <ListItemButton className={`${styles.nestedListItemButton} ${styles.cursorPointer}`} onClick={() => handleNavigation('/adminPage/adminDeletedCommentPage')}>
            <ListItemText primary="　삭제된 댓글" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
    </List>
  );
}