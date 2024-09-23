import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';
import styles from '@/styles/myPage/sideMenu.module.css'

export default function SideMenu(theme) {
  const [openItems, setOpenItems] = React.useState({
    infoManagement: false,
    resumeManagement: false,
    inquiry: false,
    reports: false,
    payments: false,
    posts: false,
  });
  const handleClick = (item) => {
    setOpenItems((prevState) => ({ ...prevState, [item]: !prevState[item] }));
  };
  const nestedListItemButtonStyle = { pl: 4 };
  return (
    <List
      sx={{ width: '100%', maxWidth: 240, bgcolor: '#FFFFFF', fontFamily: '"Noto Sans KR", sans-serif' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <div className={styles.myPageTitleIndex}> {/* className을 올바르게 사용 */}
          마이페이지
        </div>
      }
    >

      <a href="/myPage" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="회원정보" sx={{ fontFamily: 'Noto Sans KR' }} />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[400] }} />

      <ListItemButton onClick={() => handleClick('infoManagement')}>
        <ListItemText primary="개인 정보 관리" />
        {openItems.infoManagement ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.infoManagement} timeout="auto" unmountOnExit >
        <List component="div" disablePadding>
          <a href="/myPage/editUserInfo" style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'Noto Sans KR' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="개인 정보 수정" />
            </ListItemButton>
          </a>
          <a href="/myPage/passwordChange" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="비밀번호 변경" />
            </ListItemButton>
          </a>
          <a href="/myPage/deleteAccount" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="회원 탈퇴" />
            </ListItemButton>
          </a>
        </List>
      </Collapse>

      <Divider sx={{ borderColor: grey[400] }} />

      <ListItemButton onClick={() => handleClick('resumeManagement')}>
        <ListItemText primary="이력서 관리" />
        {openItems.resumeManagement ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.resumeManagement} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <a href="/resume/resumeList" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="이력서 현황" />
            </ListItemButton>
          </a>
          <a href="/resume" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="이력서 등록" />
            </ListItemButton>
          </a>
        </List>
      </Collapse>

      <Divider sx={{ borderColor: grey[400] }} />

      {/* <a href="/myPage/interviewHistory" style={{ textDecoration: 'none', color: 'inherit' }}> */}
      <a href="/interview/interviewResultList" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="모의 면접 내역" />
        </ListItemButton>
      </a>

      {/* <Divider sx={{ borderColor: grey[400] }} />

      <a href="/myPage/surveyHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="적성 탐색 내역" />
        </ListItemButton>
      </a> */}

      <Divider sx={{ borderColor: grey[400] }} />

      <a href="/myPage/boardPosts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="게시판 작성 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[400] }} />

      
      <a href="/myPage/reportHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="신고 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[400] }} />

      <a href="/myPage/paymentHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="결제 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[400] }} />
    </List>
  );
}