import React from 'react';
import styles from '@/styles/myPage/sidebar.module.css';
import { useRouter } from 'next/router';

function Sidebar() {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push(item.href);
  };
  const isActive = router.pathname === item.href;
  const menuItems = [
    { label: "회원 정보", href: "/myPage" },
    { label: "개인 정보 관리", href: "/myPage/editUserInfo" },
    { label: "개인 정보 수정", href: "/myPage/editUserInfo" }, //editUserInfo
    { label: "비밀번호 변경", href: "/myPage/passwordChange" },
    { label: "회원탈퇴", href: "/myPage/deleteAccount" },
    { label: "이력서 관리", href: "/resume/resumeEdit" },
    { label: "이력서 현황", href: "/resume/resumeList" },
    { label: "이력서 등록", href: "/resume" },
    { label: "모의면접 내역", href: "/myPage/interviewHistory" },
    { label: "설문조사 내역", href: "/myPage/surveyHistory" },
    { label: "게시판 작성 내역", href: "/myPage/boardPosts" },
    { label: "문의 현황", href: "/myPage/inquiryHistory" },
    { label: "Q&A 내역", href: "/myPage/inquiryHistory" }, //qaHistory
    { label: "신고 내역", href: "/myPage/reportHistory" },
    { label: "결제 내역", href: "/myPage/paymentHistory" }
    // ,{ label: "채팅 설정", href: "/mypage/chatSettings" }
  ];

  return <>
    <br/>
    <aside className={styles.customSidebar}>
      
      <nav className={styles.customNav}>
        <h2 className={styles.customTitle}>
          마이페이지
        </h2>
        <ul className={styles.customList}>
          {menuItems.map((item, index) => (
            
            // <React.Fragment key={index}>
            //   <li className={styles.customListItem}>
            //     <a href={item.href} className={styles.customLink}>
            //       {item.label}
            //     </a>
            //   </li>
            //   <div className={styles.customDivider} />
            // </React.Fragment>
            // <NavLink
            // className={styles.customListItem}
            //   exact="true"
            //   style={{color: "gray", textDecoration: "none"}}
            //   to={item.href}
            //   key={index}
            //   activestyle={{color: "black"}}
            // >
            //   {item.label}
            //   <div className={styles.customDivider} />
            // </NavLink>
            <a
            className={styles.customListItem}
            style={{
              color: isActive ? 'black' : 'gray',
              textDecoration: 'none',
            }}
            href={item.href}
            key={index}
            onClick={handleClick}
          >
            {item.label}
            <div className={styles.customDivider} />
          </a>
          ))}
        </ul>
      </nav>
    </aside>
  </>
}

export default Sidebar;