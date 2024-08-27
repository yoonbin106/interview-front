import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function ThreeDPentagonIcon(props) {
    const { mainColor = '#FFD700', shadowColor = '#B8860B', ...otherProps } = props;

    return (
        <SvgIcon {...otherProps} viewBox="0 0 64 64" style={{ position: 'relative', fill: 'none' }}>
            <defs>
                <linearGradient id="main-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: mainColor, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: shadowColor, stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="shadow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: shadowColor, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <polygon points="32,2 58,18 58,46 32,62 6,46 6,18" fill="url(#main-gradient)" />
            <polygon points="32,6 52,18 52,42 32,54 12,42 12,18" fill="url(#shadow-gradient)" />
            <polygon points="32,10 46,18 46,38 32,46 18,38 18,18" fill={mainColor} />

            {/* Sequential Sparkle Effects */}
            <image 
                href="/images/shingeffect.png" 
                x="12" 
                y="10" 
                width="44" 
                height="44" 
                style={{ animation: 'sparkle1 3s infinite', pointerEvents: 'none' }} 
            />
            <image 
                href="/images/shingeffect.png" 
                x="12" 
                y="10" 
                width="44" 
                height="44" 
                style={{ animation: 'sparkle2 3s infinite', pointerEvents: 'none' }} 
            />
            <image 
                href="/images/shingeffect.png" 
                x="12" 
                y="10" 
                width="44" 
                height="44" 
                style={{ animation: 'sparkle3 3s infinite', pointerEvents: 'none' }} 
            />

            <style jsx>{`
                @keyframes sparkle1 {
                    0% { opacity: 0; }
                    25% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes sparkle2 {
                    0% { opacity: 0; }
                    25% { opacity: 0; }
                    50% { opacity: 1; }
                    75% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes sparkle3 {
                    0% { opacity: 0; }
                    50% { opacity: 0; }
                    75% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </SvgIcon>
    );
}

export default ThreeDPentagonIcon;
