// bbsCompanyNoticePage.jsx

import React from 'react';
import BbsCompanyNotice from 'components/bbs/bbsCompanyNotice';

const BbsCompanyNoticePage = () => {
    return (
        <div>
            {/* AdminCompanyNotice 컴포넌트를 사용하여 공지사항 페이지 전체를 렌더링 */}
            <BbsCompanyNotice />
        </div>
    );
};

export default BbsCompanyNoticePage;