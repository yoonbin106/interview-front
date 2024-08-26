import React, { useState, useEffect } from 'react';
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
import { logout2 } from 'api/user';

const Header = observer(() => {
  const [hover, setHover] = useState(false);
  const { authStore, userStore } = useStores();
  const router = useRouter(); // useRouter 훅 사용
  const [isClient, setIsClient] = useState(false);

  const smoothScroll = (targetPosition, duration) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  // const storeReset = () => {
  //   localStorage.clear(); // 로컬 스토리지 비우기
  //   authStore.setLoggedIn(false);
  //   userStore.setEmail('');
  //   userStore.setUsername('');
  //   userStore.setAddress('');
  //   userStore.setGender('');
  //   userStore.setBirth('');
  //   userStore.setPhone('');
  //   userStore.setProfile('');
  //   userStore.setId('');
  // }

  const handleTicketClick = (e, sectionId) => {
    e.preventDefault();

    // 현재 페이지가 메인 페이지가 아니라면 메인 페이지로 이동 후 스크롤
    if (router.pathname !== '/') {
      router.push({
        pathname: '/',
        query: { scrollTo: sectionId }
      });
    } else {
      // 메인 페이지일 때 부드럽게 스크롤
      const section = document.getElementById(sectionId);
      if (section) {
        const targetPosition = section.offsetTop;
        smoothScroll(targetPosition, 1000); // 1000ms (1초)에 걸쳐 부드럽게 스크롤
      }
    }
  };
  useEffect(() => {
    const handleMouseMove = (event) => {
      const dropMenu = document.querySelector(`.${styles.dropMenuFrame}`);
      const navLinks = document.querySelector(`.${styles.navLinks}`);

      // 마우스가 dropMenuFrame 또는 navLinks 내부에 있지 않으면 hover를 false로 설정
      if (dropMenu && navLinks && !dropMenu.contains(event.target) && !navLinks.contains(event.target)) {
        setHover(false);
      }
    };

    const handleMouseLeaveWindow = () => {
      setHover(false); // 마우스가 창을 벗어나면 hover를 false로 설정
    };

    // 전역적으로 마우스 움직임을 감지
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeaveWindow);

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      authStore.checkLoggedIn();
    }

    // 쿼리 파라미터 확인 후 해당 섹션으로 스크롤
    if (router.query.scrollTo) {
      const section = document.getElementById(router.query.scrollTo);

      if (section) {
        const targetPosition = section.offsetTop;
        smoothScroll(targetPosition, 1000); // 부드럽게 스크롤
      }
    }
  }, [router.query.scrollTo]);

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
    <>
      <header>
        <div className={styles.header}>
          <div className={styles.headerin}>
            <div>
              <div
                className={styles.logo}
                onClick={() => router.push('/')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.mainLogo}></div>
              </div>
            </div>
            <nav
              className={styles.navLinks}
              onMouseEnter={() => setHover(true)}
            >
              <a href="#" className={styles.navLink}>소개</a>
              <a href="#" className={styles.navLink}>회사 검색</a>
              <a href="#" className={styles.navLink}>AI 서비스</a>
              <a href="#" className={styles.navLink}>커뮤니티</a>
              <a href="#" className={styles.navLink}>고객센터</a>
              {/* <button href="#" onClick={storeReset()} className={styles.navLink}>스토어초기화</button> */}
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
          {/* {hover && ( */}
          <div
            className={`${styles.dropMenuFrame} ${hover ? styles.show : ''}`}
            onMouseLeave={() => setHover(false)}
          >
            <div>
              <div className={styles.dropMenu}>
                <div className={styles.emptyMenuFrame}></div>
                <div className={styles.subMenusFrame}>
                  <div className={styles.subMenus}>
                    <a href="#systemInfo" className={styles.subMenu}
                      onClick={(e) => handleTicketClick(e, 'systemInfo')}>서비스 소개</a>
                    {/* <a href="#systemInfo" className={styles.subMenu}
                      onClick={(e) => handleTicketClick(e, 'news')}>뉴스</a> */}
                    <a href="/payment" className={styles.subMenu}
                    >이용권 구매</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/search" className={styles.subMenu}>상세 검색</a>
                    <a href="/survey" className={styles.subMenu}>설문조사</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/resume/resumeList" className={styles.subMenu}>이력서</a>
                    <a href="/interview" className={styles.subMenu}>모의면접</a>
                    <a href="/interview/interviewResult" className={styles.subMenu}>면접결과</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/bbs" className={styles.subMenu}>자유게시판</a>
                    <a href="/bbs/noticePage" className={styles.subMenu}>공지사항</a>
                  </div>
                  <div className={styles.subMenus}>
                    <a href="/bbs/bbsFaqPage" className={styles.subMenu}>고객센터</a>
                  </div>
                </div>
                <div className={styles.emptyMenuFrame}></div>
              </div>
            </div>
          </div>
          {/* )} */}
        </div>
      </header>
      {/* 어두운 배경 추가 */}
      <div className={`${styles.overlay} ${hover ? styles.showOverlay : ''}`}></div>
    </>
  );
});

export default Header;
