// adminNoticePage.jsx

import React from 'react';
import AdminNotice from 'components/adminPage/adminNotice';
import {withAdminAuth} from '@/utils/withAdminAuth';

const AdminNoticePage = () => {
    return (
        <div>
            {/* AdminNotice 컴포넌트를 사용하여 공지사항 페이지 전체를 렌더링 */}
            <AdminNotice />
        </div>
    );
};

export default withAdminAuth(AdminNoticePage);