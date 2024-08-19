import React from 'react';
import AdminNoticeDetails from '@/components/adminPage/adminNoticeDetails';
import { useRouter } from 'next/router';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const AdminAdminNoticeDetailsPage = () => {
    const router = useRouter();

    // 하드코딩된 공지사항 내용
    const noticeData = {
        title: '시스템 유지보수 안내 (9/30)',
        content: `안녕하세요. 9월 30일(월) 오전 2시부터 4시까지 시스템 유지보수가 진행될 예정입니다.\n`+
        `이 기간 동안 서비스가 일시적으로 중단될 수 있으니, 업무에 참고하시기 바랍니다.\n`+ 
        `유지보수가 완료되는 즉시 정상적으로 서비스가 재개됩니다.`,
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
        router.push('/adminPage/adminAdminNoticePage');
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
        <AdminNoticeDetails
            noticeData={noticeData}
            onSave={handleSave}
            onDelete={handleDelete}
            onEdit={handleEdit}
        />
        </div>
        </div>
    );
};

export default AdminAdminNoticeDetailsPage;