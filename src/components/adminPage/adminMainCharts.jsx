import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// 날짜 포맷팅 함수
const formatDate = (date, isToday = false) => {
  const day = date.getDate().toString().padStart(2, '0'); // 일자 (2자리)
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (2자리)

  return isToday ? `오늘(${month}.${day})` : `${month}.${day}`;
};

// 현재 시간을 기준으로 시간을 생성하는 함수
const generateTimeLabels = () => {
  const labels = [];
  const now = new Date();

  for (let i = 4; i >= 0; i--) { // 현재 시간부터 4시간 전까지 (총 5시간)
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // 1시간 간격으로 시간 생성
    const hours = time.getHours().toString().padStart(2, '0'); // 시간
    const minutes = time.getMinutes().toString().padStart(2, '0'); // 현재 분을 그대로 유지
    labels.push(`${hours}:${minutes}`); // 생성된 시간을 배열의 뒤에 추가
  }

  return labels;
};

const AdminMainCharts = ({ chartType }) => {
  let content;

  const chartHeight = 200;

  if (chartType === 'signup') {
    const today = new Date();
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const chartData = {
      options: {
        chart: {
          id: 'signup-bar-chart',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        xaxis: {
          categories: [
            formatDate(twoDaysAgo),      // 이틀 전
            formatDate(oneDayAgo),       // 하루 전
            formatDate(today, true)      // 오늘
          ], // X축에 실제 날짜를 표시
        },
        plotOptions: {
          bar: {
            distributed: true, // 각 막대를 개별적으로 스타일링
          }
        },
        colors: ['#2C3E50', '#2C3E50', '#5A8AF2'], // 막대 색상
        legend: {
          show: false,
        },
      },
      series: [
        {
          name: '가입회원 수',
          data: [70, 85, 100], // 하드코딩된 데이터 (이틀 전, 하루 전, 오늘)
        },
      ],
    };

    content = (
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={chartHeight} // 3/4로 줄인 높이
        style={{ width: '100%' }} // 인라인 스타일로 너비 설정
      />
    );
  } else if (chartType === 'activeUsers') {
    const labels = generateTimeLabels();

    const chartData = {
      options: {
        chart: {
          id: 'active-users-line-chart',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        xaxis: {
          categories: labels, // X축에 시간 표시
        },
        colors: ['#5A8AF2'], // 선 색상
        stroke: {
          curve: 'smooth', // 선을 부드럽게
        },
        markers: {
          size: 5, // 각 데이터 포인트에 표시되는 점 크기
        },
        legend: {
          show: false,
        },
      },
      series: [
        {
          name: '접속자 수',
          data: [23, 56, 34, 22, 38], // 하드코딩된 데이터 (최근 5시간 동안의 접속자 수)
        },
      ],
    };

    content = (
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={chartHeight} // 3/4로 줄인 높이
        style={{ width: '100%' }} // 인라인 스타일로 너비 설정
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '10px', padding: '10px' }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
        {chartType === 'signup' ? '최근 3일간 가입회원 수' : '현재 사이트 접속자 수 (최근 5시간)'}
      </div>
      {content}
    </div>
  );
};

export default AdminMainCharts;