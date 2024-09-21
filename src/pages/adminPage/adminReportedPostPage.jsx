//adminReportedPostPage.jsx

import React from 'react';
import ReportedPost from '@/components/adminPage/adminReportedPost';
import {withAdminAuth} from '@/utils/withAdminAuth';
const AdminReportedPostPage = () => {
    return <ReportedPost />;
};

export default withAdminAuth(AdminReportedPostPage);