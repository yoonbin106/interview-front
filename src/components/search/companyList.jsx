import React from 'react';

const CompanyList = ({ companies, onCompanyClick, onMarkerClick }) => {
    return (
        <div>
            {companies.map((company, index) => (
                <div 
                    key={index} 
                    id={company.corpNm}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer', 
                        margin: '10px 0', 
                        padding: '10px', 
                        border: '1px solid #ccc', 
                        borderRadius: '5px', 
                        backgroundColor: '#fff', 
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.border = '1px solid blue'}
                    onMouseLeave={(e) => e.currentTarget.style.border = '1px solid #ccc'}
                >
                    <div onClick={() => {
                        console.log(`Company clicked: ${company.corpNm}`);
                        onCompanyClick(company);
                    }} style={{ flex: 1, wordWrap: 'break-word', whiteSpace: 'normal' }}>
                        <strong>{company.corpNm}</strong>
                        <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{company.enpBsadr}</p>
                    </div>
                    <div 
                        onClick={(e) => {
                            e.stopPropagation(); // 부모 요소의 클릭 이벤트 중단
                            console.log(`Marker icon clicked: ${company.corpNm}`);
                            onMarkerClick(company);
                        }} 
                        style={{ width: '30px', height: '30px', background: 'url(/images/marker-icon.png) no-repeat center/contain' }}
                    ></div>
                </div>
            ))}
        </div>
    );
};

export default CompanyList;
