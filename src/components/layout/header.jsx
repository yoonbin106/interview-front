import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/header.module.css';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import { Avatar } from '@mui/material';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import IconButton from '@mui/joy/IconButton';
import ListItemButton from '@mui/joy/ListItemButton';
import Badge from '@mui/joy/Badge';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import { logout } from '@/api/user';  // 로그아웃 API 임포트
import { useEffect } from 'react';

const Header = observer(() => {
  const [hover, setHover] = useState(false);
  const { authStore, userStore } = useStores();
  const router = useRouter(); // useRouter 훅 사용
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      authStore.checkLoggedIn();
    }
  }, []);

  if (!isClient) {
    return null; // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
  };

  const handleLogout = async () => {
    try {
      await logout(authStore, userStore); // 로그아웃 API 호출
      router.push('/'); // 홈 페이지로 리다이렉트
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <div className={styles.header}>
        <div className={styles.headerin}>
          <div>
            <div
              className={styles.logo}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              모의면접
            </div>
          </div>
          <nav
            className={styles.navLinks}
            onMouseEnter={() => setHover(true)}
          >
            <a href="#" className={styles.navLink}>소개</a>
            <a href="#" className={styles.navLink}>회사 검색</a>
            <a href="#" className={styles.navLink}>모의 면접</a>
            <a href="#" className={styles.navLink}>게시판</a>
            <a href="#" className={styles.navLink}>고객센터</a>
          </nav>
          <div>
            <div className={styles.userMenu}>
              <div className={styles.userMenuMyPage} >
                <Dropdown>
                  <MenuButton
                    sx={{ height: 50 }}
                    slots={{ root: ListItemButton }}
                  >
                    <Avatar src={userStore.profile} sx={{ width: 30, height: 30 }} />
                    <div className={styles.userName}>
                      {authStore.loggedIn ? userStore.username : '로그인 필요'}
                    </div>
                  </MenuButton>
                  <Menu placement="bottom-end" sx={{ width: 129 }}>
                    {!authStore.loggedIn && (
                      <MenuItem onClick={() => router.push('/auth')}>로그인</MenuItem>
                    )}
                    {authStore.loggedIn && <MenuItem onClick={() => router.push('/myPage')}>마이페이지</MenuItem>}
                    <ListDivider />
                    {authStore.loggedIn && (
                      <MenuItem variant="soft" color="danger" onClick={handleLogout}>
                        로그아웃
                      </MenuItem>
                    )}
                  </Menu>
                </Dropdown>
              </div>
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
                  sx={{ borderRadius: 40, width: 50, height: 50 }}
                >
                  <Badge badgeContent={999} color="danger" variant="solid" size="sm">
                    <NotificationsNoneTwoToneIcon color="action" />
                  </Badge>
                </MenuButton>
                <Menu placement="bottom-start" sx={{ width: 400 }}>
                  <MenuItem>알림</MenuItem>
                  <ListDivider />
                  <MenuItem>채팅 : 안읽은 메시지 1개</MenuItem>
                  <MenuItem>고객센터 : 안읽은 메시지 1개</MenuItem>
                </Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* 내려오는 메뉴바 */}
        {hover && (
          <div
            className={styles.dropMenuFrame}
            onMouseLeave={() => setHover(false)}
          >
            <div>
              <div className={styles.dropMenu}>
                <div className={styles.emptyMenuFrame}></div>
                <div className={styles.subMenusFrame}>
                  <div className={styles.subMenus}>
                    <a href="#" className={styles.subMenu}>시스템 소개</a>
                    <a href="#" className={styles.subMenu}>이용권</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/search" className={styles.subMenu}>회사 검색</a>
                    <a href="/survey" className={styles.subMenu}>설문조사</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/resume" className={styles.subMenu}>이력서</a>
                    <a href="/interview" className={styles.subMenu}>모의면접</a>
                    <a href="/interview/interviewResult" className={styles.subMenu}>면접결과</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/bbs" className={styles.subMenu}>면접자 게시판</a>
                    <a href="/bbs/noticePage" className={styles.subMenu}>공지사항</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="#" className={styles.subMenu}>고객센터</a>
                  </div>
                </div>
                <div className={styles.emptyMenuFrame}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;