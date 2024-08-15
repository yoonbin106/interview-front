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

export default function SideMenu() {
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
      sx={{ width: '100%', maxWidth: 240, bgcolor: '#FFFFFF' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
        component="div"
        id="nested-list-subheader"
        sx={{ fontSize: '1.8rem', textAlign: 'center', mb: 5, fontWeight: 1000}}
      >
        마이페이지
      </ListSubheader>
    }
  >
      <a href="/myPage" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="회원정보" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[800] }}/>

      <ListItemButton onClick={() => handleClick('infoManagement')}>
        <ListItemText primary="개인 정보 관리" />
        {openItems.infoManagement ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.infoManagement} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <a href="/myPage/editUserInfo" style={{ textDecoration: 'none', color: 'inherit' }}>
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

      <Divider sx={{ borderColor: grey[800] }} />

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

      <Divider sx={{ borderColor: grey[800] }} />

      <a href="/myPage/interviewHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="모의 면접 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[800] }} />

      <a href="/myPage/surveyHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="설문조사 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[800] }} />

      <a href="/myPage/boardPosts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="게시판 작성 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[800] }} />

      <ListItemButton onClick={() => handleClick('inquiry')}>
        <ListItemText primary="문의 현황" />
        {openItems.inquiry ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.inquiry} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <a href="/myPage/inquiryHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="Q&A 내역" />
            </ListItemButton>
          </a>
          <a href="/myPage/reportHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={nestedListItemButtonStyle}>
              <ListItemText primary="신고 내역" />
            </ListItemButton>
          </a>
        </List>
      </Collapse>

      <Divider sx={{ borderColor: grey[800] }} />

      <a href="/myPage/paymentHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          <ListItemText primary="결제 내역" />
        </ListItemButton>
      </a>

      <Divider sx={{ borderColor: grey[800] }} />
    </List>
  );
}