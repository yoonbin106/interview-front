// adminAdminNoticePage.jsx

import React from 'react';
import AdminAdminNotice from 'components/adminPage/adminAdminNotice';
import {withAdminAuth} from '@/utils/withAdminAuth';

const AdminAdminNoticePage = () => {
    return (
        <div>
            {/* AdminNotice 컴포넌트를 사용하여 공지사항 페이지 전체를 렌더링 */}
            <AdminAdminNotice />
        </div>
    );
};

export default withAdminAuth(AdminAdminNoticePage);