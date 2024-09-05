import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Card, CardContent, Typography } from '@mui/material';

// 차트 컴포넌트
const AdminPaymentCharts = () => {
  // Dummy data for the charts
  const basicCount = 40;
  const premiumCount = 60;
  const dailySales = [120, 150, 180, 170, 130, 200, 210]; // Example daily sales data
  const targetSales = 160; // Target sales for annotations

  // Gradient Donut Chart data
  const donutChartOptions = {
    series: [basicCount, premiumCount],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Basic', 'Premium'],
      colors: ['#F2F5FF', '#5A8AF2'],
      plotOptions: {
        pie: {
          donut: {
            size: '50%',
            background: 'transparent',
          },
        },
      },
      legend: {
        position: 'bottom',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          gradientToColors: ['#5A8AF2', '#5A8AF2'],
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: true,
      },
    },
  };

  // Line Chart with Annotations data
  const lineChartOptions = {
    series: [
      {
        name: 'Daily Sales',
        data: dailySales,
        color: '#5A8AF2',
      },
    ],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          tools: {
            download: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: targetSales,
            borderColor: '#FF4560',
            label: {
              borderColor: '#FF4560',
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: 'Target Sales',
            },
          },
        ],
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Days of the week
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <Card sx={{ width: '100%', height: '350px', border: '1px solid black', boxShadow: 'none' }}>
      <CardContent sx={{ height: '100%' }}>
        {/* 두 차트를 나란히 배치 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
          
          {/* Gradient Donut Chart */}
          <Box sx={{ width: '48%', height: '95%' }}>
            <ReactApexChart options={donutChartOptions.options} series={donutChartOptions.series} type="donut" height="100%" />
            <Typography align="center" >
                요금제 결제 비율
            </Typography>
          </Box>

          {/* 두 차트 사이에 검은색 구분선 추가 */}
          <Box sx={{ width: '1px', backgroundColor: 'black', height: '100%' }}></Box>
          
          {/* Line Chart with Annotations */}
          <Box sx={{ width: '48%', height: '95%' }}>
            <ReactApexChart options={lineChartOptions.options} series={lineChartOptions.series} type="line" height="100%" />
            <Typography align="center" >
                일 별 매출 변화
            </Typography>
          </Box>
        
        </Box>
      </CardContent>
    </Card>
  );
}

export default AdminPaymentCharts;
