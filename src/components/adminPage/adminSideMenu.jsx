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

export default function NestedList() {
  const router = useRouter();
  const [openItems, setOpenItems] = React.useState({
    home: false,
    inquiry: false,
    members: false,
    reports: false,
    payments: false,
    posts: false,
  });

  const handleClick = (item) => {
    setOpenItems((prevState) => ({ ...prevState, [item]: !prevState[item] }));
  };

  const handleNavigation = (path) => {
    router.push(path); // 지정된 경로로 이동
  };

  const nestedListItemButtonStyle = { pl: 4 };

  return (
    <List
      sx={{ width: '100%', maxWidth: 240, bgcolor: '#ffffff' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          sx={{ fontSize: '1.3rem', textAlign: 'center' }} // 가운데 정렬 추가
          onClick={() => handleNavigation('/adminPage/adminMainPage')} // 홈 아이콘 클릭 시 메인 페이지로 이동
        >
          <HomeIcon />
          　관리자 페이지
        </ListSubheader>
      }
    >
      {/* 공지사항 */}
      <ListItemButton onClick={() => handleClick('home')}>
        <ListItemIcon>
          <CampaignSharpIcon />
        </ListItemIcon>
        <ListItemText primary="공지사항" />
        {openItems.home ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.home} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminNoticePage')}>
            <ListItemText primary="전체 공지사항" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminAdminNoticePage')}>
            <ListItemText primary="관리자 공지사항" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 문의관리 */}
      <ListItemButton onClick={() => handleClick('inquiry')}>
        <ListItemIcon>
          <QuestionAnswerIcon />
        </ListItemIcon>
        <ListItemText primary="문의관리" />
        {openItems.inquiry ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.inquiry} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminQnaPage')}>
            <ListItemText primary="문의내역" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminFaqPage')}>
            <ListItemText primary="자주 묻는 질문" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 회원관리 */}
      <ListItemButton onClick={() => handleClick('members')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="회원관리" />
        {openItems.members ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.members} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminUserPage')}>
            <ListItemText primary="회원조회" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 신고관리 */}
      <ListItemButton onClick={() => handleClick('reports')}>
        <ListItemIcon>
          <WarningSharpIcon />
        </ListItemIcon>
        <ListItemText primary="신고관리" />
        {openItems.reports ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.reports} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminReportedPostPage')}>
            <ListItemText primary="게시글 신고" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminReportedCommentPage')}>
            <ListItemText primary="댓글 신고" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminReportedFinPostPage')}>
            <ListItemText primary="완료처리-게시글" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminReportedFinCommentPage')}>
            <ListItemText primary="완료처리-댓글" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 결제관리 */}
      <ListItemButton onClick={() => handleClick('payments')}>
        <ListItemIcon>
          <PaymentIcon />
        </ListItemIcon>
        <ListItemText primary="결제관리" />
        {openItems.payments ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.payments} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminPaymentPage')}>
            <ListItemText primary="결제내역" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminRefundPage')}>
            <ListItemText primary="환불내역" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />

      {/* 게시글관리 */}
      <ListItemButton onClick={() => handleClick('posts')}>
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="게시글관리" />
        {openItems.posts ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems.posts} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminDeletedPostPage')}>
            <ListItemText primary="삭제된 글" />
          </ListItemButton>
          <ListItemButton sx={nestedListItemButtonStyle} onClick={() => handleNavigation('/adminPage/adminDeletedCommentPage')}>
            <ListItemText primary="삭제된 댓글" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
    </List>
  );
}