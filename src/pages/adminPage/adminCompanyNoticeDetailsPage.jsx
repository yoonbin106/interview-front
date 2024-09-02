//adminCompanyNoticeDetailsPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import AdminCompanyNoticeDetails from 'components/adminPage/adminCompanyNoticeDetails';
import NestedList from '@/components/adminPage/adminSideMenu';
import styles from '@/styles/adminPage/adminPage.module.css';

const AdminCompanyNoticeDetailsPage = () => {
    const router = useRouter();

    // 하드코딩된 공지사항 내용
    const noticeData = {
        title: '2024년 하반기 공휴일 안내',
        content: `안녕하세요.\n\n2024년 하반기 공휴일 일정을 안내드립니다.\n\n` +
            `1. 8월 15일 (목) : 광복절\n` +
            `2. 9월 13일 (금) ~ 9월 15일 (일) : 추석 연휴\n` +
            `3. 10월 3일 (목) : 개천절\n` +
            `4. 10월 9일 (수) : 한글날\n` +
            `5. 12월 25일 (수) : 성탄절\n\n` +
            `위 공휴일 동안 서비스 운영에 변동 사항이 있을 시 추가 공지를 통해 안내드리겠습니다.\n` +
            `고객 여러분의 많은 양해 부탁드리며, 행복한 휴일 보내시길 바랍니다.\n\n감사합니다.`,
        date: '2024-07-15',
    };

    // 공지사항 저장 핸들러
    const handleSave = (updatedNotice) => {
        console.log('저장된 공지사항:', updatedNotice);
        alert('공지사항이 저장되었습니다.');
    };

    // 공지사항 삭제 핸들러
    const handleDelete = () => {
        console.log('공지사항이 삭제되었습니다.');
        alert('공지사항이 삭제되었습니다.');
        router.push('/adminPage/adminCompanyNoticePage');
    };

    // 공지사항 수정 핸들러
    const handleEdit = () => {
        console.log('공지사항이 수정되었습니다.');
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList/>
            </div>
            <div className={styles.content}>
        <AdminCompanyNoticeDetails
            noticeData={noticeData}
            onSave={handleSave}
            onDelete={handleDelete}
            onEdit={handleEdit}
        />
          </div>
          </div>
    );
};

export default AdminCompanyNoticeDetailsPage;