// adminQnaDetailsPage.jsx

import React from 'react';
import NestedList from '@/components/adminPage/adminSideMenu'; // 사이드 메뉴 컴포넌트
import AdminQnaDetails from '@/components/adminPage/adminQnaDetails'; // QnA 상세 컴포넌트
import sidebar from '@/styles/adminPage/adminPage.module.css'; // 스타일 임포트

const AdminQnaDetailsPage = () => {
    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList /> {/* 사이드 메뉴 컴포넌트 */}
            </div>
            <div className={sidebar.content}>
                <AdminQnaDetails /> {/* QnA 상세 컴포넌트 */}
            </div>
        </div>
    );
};

export default AdminQnaDetailsPage;
