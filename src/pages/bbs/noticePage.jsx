// noticePage.jsx

import React from 'react';
import Notice from 'components/bbs/notice';

const noticePage = () => {
    return (
        <div>
            {/* notice 컴포넌트를 사용하여 공지사항 페이지 전체를 렌더링 */}
            <Notice />
        </div>
    );
};

export default noticePage;