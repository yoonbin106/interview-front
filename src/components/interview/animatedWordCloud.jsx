import React, { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud';

const AnimatedWordCloudComponent = ({ data, width = '100%', height = 400 }) => {
  const [key, setKey] = useState(0);

  // 애니메이션 효과를 위해 주기적으로 컴포넌트를 리렌더링
  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prevKey => prevKey + 1);
    }, 2000); // 2초마다 리렌더링

    return () => clearInterval(interval);
  }, []);

  const options = {
    luminosity: 'light',
    hue: 'blue',
  };
    // 데이터 형식 변환: { text, value } 형식으로 변경
    const cloudData = data.map(item => ({
      value: item.text,
      count: item.value
    }));
  

    return (
      <div style={{ width, height, overflow: 'hidden' }}>
        <TagCloud
          key={key}
          minSize={10}
          maxSize={35}
          tags={cloudData}
          onClick={tag => console.log(`'${tag.value}' was selected!`)}
          colorOptions={options}
          rotationAngles={[-270, 270]}
          spiral="rectangular"
          transitionDuration={1000}
          shuffle={true}
        />
      </div>
    );
  };

export default AnimatedWordCloudComponent;