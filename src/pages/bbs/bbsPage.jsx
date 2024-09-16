// bbsPage.jsx

import React from 'react';
import Bbs from 'components/bbs/Bbs';

const bbsPage = () => {
    return (
        <div>
            {/* notice 컴포넌트를 사용하여 공지사항 페이지 전체를 렌더링 */}
            <Bbs />
        </div>
    );
};

export default bbsPage;