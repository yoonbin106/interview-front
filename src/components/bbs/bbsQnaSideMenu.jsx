import * as React from 'react';
import { useRouter } from 'next/router'; // Next.js의 useRouter 사용
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import styles from '@/styles/bbs/bbsQnaSideMenu.module.css'; // CSS 모듈 임포트
import HelpSharpIcon from '@mui/icons-material/HelpSharp';

export default function BbsQnaSideMenu() {
  const router = useRouter(); // Next.js의 페이지 이동을 위한 useRouter 훅
  const [openItems, setOpenItems] = React.useState({
    qna: false,
    notice: false,
  
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
      className={styles.BbsQnaSideMenuList} // 스타일 적용
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          className={styles.BbsQnaSideMenuHeader} // 스타일 적용
        >
          <HelpSharpIcon />
          　고객센터
        </ListSubheader>
      }
    >
      {/* FAQ 섹션 */}
      <ListItemButton className={`${styles.BbsQnaSideMenuItemButton} ${styles.BbsQnaSideMenuCursorPointer}`} onClick={() => handleNavigation('/bbs/bbsFaqPage')}>
        <ListItemText primary="　자주 묻는 질문" />
      </ListItemButton>
      <Divider />

      {/* 1:1문의 섹션 */}
      <ListItemButton onClick={() => handleClick('qna')} className={styles.BbsQnaSideMenuCursorPointer}>
        <ListItemText primary="　1:1 문의관리" />
        {openItems.qna ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.qna} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 문의내역 페이지로 이동 */}
          <ListItemButton className={`${styles.BbsQnaSideMenuItemButton} ${styles.BbsQnaSideMenuCursorPointer}`} onClick={() => handleNavigation('/bbs/bbsQnaListPage')}>
            <ListItemText primary="　　문의 내역" />
          </ListItemButton>
          {/* 자주 묻는 질문 페이지로 이동 */}
          <ListItemButton className={`${styles.BbsQnaSideMenuItemButton} ${styles.BbsQnaSideMenuCursorPointer}`} onClick={() => handleNavigation('/bbs/bbsQnaRegisterPage')}>
            <ListItemText primary="　　문의 작성" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
            {/*공지사항 페이지 관련*/}
      <ListItemButton onClick={() => handleClick('notice')} className={styles.BbsQnaSideMenuCursorPointer}>
        <ListItemText primary="　공지사항" />
        {openItems.notice ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.notice} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* 전체 공지사항 페이지로 이동 */}
          <ListItemButton className={`${styles.BbsQnaSideMenuItemButton} ${styles.BbsQnaSideMenuCursorPointer}`} onClick={() => handleNavigation('/bbs/noticePage')}>
            <ListItemText primary="　　전체 공지사항" />
          </ListItemButton>
          {/* 기업별 공지사항 페이지로 이동 */}
          <ListItemButton className={`${styles.BbsQnaSideMenuItemButton} ${styles.BbsQnaSideMenuCursorPointer}`} onClick={() => handleNavigation('/bbs/')}>
            <ListItemText primary="　　기업별 공지사항" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
    </List>
  );
}