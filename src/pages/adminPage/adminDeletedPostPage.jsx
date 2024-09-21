// adminDeletedPostPage.jsx

import React from 'react';
import DeletedPost from 'components/adminPage/adminDeletedPost';
import { withAdminAuth } from '@/utils/withAdminAuth';

const AdminDeletedPostPage = () => {
    return (
        <div>
          
            <DeletedPost />
        </div>
    );
};

export default withAdminAuth(AdminDeletedPostPage);