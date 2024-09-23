import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FaBell, FaBuilding } from 'react-icons/fa';
import { useRouter } from 'next/router'; // Next.js에서 라우팅을 처리하기 위해 사용
import StyleSheet from '@/styles/bbs/bbsSidebar.module.css';

const NestedList = () => {
  const router = useRouter();

  // 페이지 이동 함수
  const handleNavigation = (path) => {
    router.push(path); // 클릭 시 지정된 경로로 이동
  };

  return (
    <div className={StyleSheet.sidebar}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        공지사항
      </Typography>
      <List>
        {/* 전체 공지사항으로 이동 */}
        <ListItem button onClick={() => handleNavigation('/bbs/noticePage')}>
          <ListItemIcon sx={{ minWidth: '30px' }}>
            <FaBell />
          </ListItemIcon>
          <ListItemText primary="전체 공지사항" sx={{marginLeft: '-6px'}}/>
        </ListItem>
        {/* 기업별 공지사항으로 이동 */}
        <ListItem button onClick={() => handleNavigation('/bbs/bbsCompanyNoticePage')}>
          <ListItemIcon sx={{ minWidth: '30px' }}>
            <FaBuilding />
          </ListItemIcon>
          <ListItemText primary="기업별 공지사항"  sx={{ marginLeft: '-8px' }}/>
        </ListItem>
      </List>
    </div>
  );
};

export default NestedList;
