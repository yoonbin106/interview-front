import React from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminUser from '@/components/adminPage/adminUser'; // 방금 만든 adminUser 컴포넌트 임포트

const AdminUserPage = () => {
    // 더미 데이터를 AdminUser 컴포넌트로 전달
    const data = [
        { name: '최미지', gender: '여', birth: '1995.11.07', phone: '010-2790-7021', email: 'meezi_@naver.com' },
        { name: '지미초이', gender: '여', birth: '1995.77.77', phone: '010-7777-7021', email: 'jimichoi77@naver.com' },
        { name: '윤성빈', gender: '남', birth: '1995.01.01', phone: '010-1111-1111', email: 'tjdqls@naver.com' },
        { name: '최가흔', gender: '여', birth: '2001.08.14', phone: '010-7777-7777', email: 'rkgms@naver.com' },
        { name: '여진수', gender: '남', birth: '1995.11.08', phone: '010-8888-8888', email: 'wlstn@naver.com' },
        { name: '추인철', gender: '남', birth: '1995.12.23', phone: '010-0000-0000', email: 'dlscjf@naver.com' },
        { name: '정주원', gender: '남', birth: '1997.11.04', phone: '010-1234-1234', email: 'wndnjs@naver.com' },
        { name: '장이준', gender: '여', birth: '1999.99.99', phone: '010-9999-9999', email: 'dlwns@naver.com' },
        { name: '김지선', gender: '여', birth: '1998.22.21', phone: '010-6464-4123', email: 'wltjs@naver.com' },
        { name: '윤지은', gender: '여', birth: '1998.12.46', phone: '010-3333-3333', email: 'wldms@naver.com' },
        { name: '조현석', gender: '남', birth: '1996.01.01', phone: '010-1111-1111', email: 'gustjr@naver.com' },
        { name: '이규림', gender: '여', birth: '2000.12.23', phone: '010-7777-7777', email: 'rbfla@naver.com' },
        { name: '노시은', gender: '여', birth: '2001.11.08', phone: '010-8888-8888', email: 'tldms@naver.com' },
        { name: '이수경', gender: '여', birth: '1998.12.23', phone: '010-0000-0000', email: 'tnrud@naver.com' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <AdminUser allData={data} /> {/* AdminUser 컴포넌트 사용 */}
            </div>
        </div>
    );
};

export default AdminUserPage;