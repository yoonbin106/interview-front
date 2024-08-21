import React from 'react';

const ResultsList = ({ results }) => {
    // 결과가 0건이면 컴포넌트 전체를 렌더링하지 않음
    if (results.length === 0) {
        return null;
    }

    return (
        <div>
            <h3>검색 결과 {results.length}개</h3>
            <ul>
                {results.map((company, index) => (
                    <li key={index}>
                        <h4>{company.corpNm}</h4>
                        <p>{company.enpBsadr}</p>
                        <p>{company.telno}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResultsList;
