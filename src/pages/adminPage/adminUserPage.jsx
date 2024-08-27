import React, { useEffect, useState } from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminUser from '@/components/adminPage/adminUser';
import { getAllUsers } from 'api/user';

const AdminUserPage = () => {
    const [processedData, setProcessedData] = useState([]); // 상태로 processedData를 정의

    const handleUserList = async () => {
        const userList = await getAllUsers();
        
        const data = userList.data.map(user => ({
            name: user.username || '이름이 없습니다',
            gender: user.gender === "men" ? "남" : user.gender === "women" ? "여" : "미정",
            phone: user.phone ? user.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '핸드폰번호가 없습니다', // 핸드폰 번호 형식을 '010-XXXX-XXXX'로 변환
            email: user.email || '이메일이 없습니다',
            birth: user.birth || '생일이 없습니다'
        }));
    
        setProcessedData(data); // 상태 업데이트
    };

    useEffect(() => {
        handleUserList();
    }, []);
    
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <AdminUser allData={processedData} /> {/* AdminUser 컴포넌트에 데이터 전달 */}
            </div>
        </div>
    );
};

export default AdminUserPage;