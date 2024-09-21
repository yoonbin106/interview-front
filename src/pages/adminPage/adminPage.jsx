//adminMainPage.jsx

import React from 'react';
import AdminMain from '@/components/adminPage/adminMain'; // AdminMain 컴포넌트를 불러옵니다.
import {withAdminAuth} from '@/utils/withAdminAuth';

const AdminMainPage = () => {
    return (
        <div>
            {/* AdminMain 컴포넌트를 사용합니다. */}
            <AdminMain />
        </div>
    );
};

export default withAdminAuth(AdminMainPage);