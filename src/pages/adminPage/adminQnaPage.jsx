//adminQnaPage.jsx

import React from 'react';
import AdminQna from '@/components/adminPage/adminQna';
import {withAdminAuth} from '@/utils/withAdminAuth';

const AdminQnaPage = () => {
    return <AdminQna />;
};

export default withAdminAuth(AdminQnaPage);