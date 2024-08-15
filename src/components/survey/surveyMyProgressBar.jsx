import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const SurveyMyProgressBar = ({ Percentage }) => {
    const [style, setStyle] = useState({ opacity: 0, width: '0px' });

    useEffect(() => {
        const newStyle = {
            opacity: 1,
            width: '1140px',
            zIndex: 1, // z-index를 낮은 값으로 설정
            position: 'relative', // position 설정
        };

        setStyle(newStyle);
    }, []);

    return (
        <div className="component-progress-container" style={{ width: '1140px', margin: '0 auto', position: 'relative' }}>
            <div className="progress-bar" style={style}>
                <LinearProgress
                    variant="determinate"
                    value={Percentage}
                    sx={{
                        borderRadius: '8px',
                        '--LinearProgress-radius': '8px',
                        '--LinearProgress-thickness': '20px', // 진행 바 세로 길이 설정
                        height: '20px', // 진행 바 세로 길이 설정
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#2F72E3', // 파란색
                        },
                    }}
                />
                {/* 퍼센트 값을 진행 바 중앙에 위치 */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black', // 텍스트 색상
                        fontWeight: 'bold',
                        fontSize: '12px', // 폰트 크기
                    }}
                >
                    {Percentage}%
                </div>
            </div>
        </div>
    );
};

export default SurveyMyProgressBar;
