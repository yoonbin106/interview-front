import React from 'react';

const ResultsList = ({ results }) => {
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
