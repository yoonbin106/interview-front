import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import Cloud from "react-d3-cloud";

// 스타일드 컴포넌트 정의
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  backgroundColor: "#f5f5f5",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiTab-root": {
    minWidth: "auto",
    padding: "6px 16px",
    borderRadius: "20px",
    margin: "0 8px",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

const ResultPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 면접 결과 데이터 (각 탭별로 다른 데이터 사용)
  const interviewResult = {
    aiEvaluation: {
      grade: 2,
      overallScore: 86,
      recommendationScore: 92,
      evaluationItems: [
        { name: '목소리', score: 50 },
        { name: '눈맞춤', score: 32 },
        { name: '상냥함', score: 23 },
        { name: '몸가짐', score: 88 },
        { name: '침착성', score: 43 },
      ],
    },
    personalityTraits: [
      { name: '개방성', score: 75 },
      { name: '성실성', score: 88 },
      { name: '외향성', score: 62 },
      { name: '친화성', score: 79 },
      { name: '신경성', score: 45 },
    ],
    personalityAnalysis: {
      suitableJobs: ['마케팅 전문가', '영업 관리자', '인사 컨설턴트'],
      strengths: ['창의적 문제 해결', '팀 협업 능력', '높은 적응력'],
      improvements: ['스트레스 관리', '세부사항 주의'],
    },
    gazeData: [
      { time: 0, gaze: 50 },
      { time: 1, gaze: 70 },
      { time: 2, gaze: 60 },
      { time: 3, gaze: 80 },
      { time: 4, gaze: 75 },
    ],
    expressionData: {
      positive: 60,
      neutral: 20,
      negative: 20,
    },
    gazeAnalysis: {
      averageGaze: 67,
      evaluation: '양호',
      feedback: '전반적으로 좋은 눈맞춤을 유지했지만, 일부 순간에 개선이 필요합니다.',
    },
    expressionAnalysis: {
      dominantExpression: '긍정',
      evaluation: '우수',
      feedback: '면접 동안 대부분 긍정적인 표정을 유지했습니다. 이는 열정과 자신감을 잘 표현한 것으로 보입니다.',
    },
    voiceData: [
      { time: 0, pitch: 50, volume: 60, speed: 70 },
      { time: 1, pitch: 55, volume: 65, speed: 75 },
      { time: 2, pitch: 60, volume: 70, speed: 80 },
      { time: 3, pitch: 65, volume: 75, speed: 85 },
      { time: 4, pitch: 70, volume: 80, speed: 90 },
    ],
    voiceAnalysis: {
      averagePitch: 60,
      averageVolume: 70,
      averageSpeed: 80,
      evaluation: '양호',
      feedback: '말하기 속도가 약간 빠른 편입니다. 중요한 부분에서는 속도를 조금 줄이는 것이 좋겠습니다.',
    },
    keywords: [
      { text: '열정', value: 64 },
      { text: '팀워크', value: 55 },
      { text: '창의성', value: 48 },
      { text: '책임감', value: 47 },
      { text: '전문성', value: 44 },
      { text: '의사소통', value: 42 },
      { text: '리더십', value: 40 },
      { text: '혁신', value: 38 },
      { text: '분석력', value: 36 },
      { text: '문제해결', value: 35 },
      { text: '적응력', value: 33 },
      { text: '성실성', value: 32 },
      { text: '도전정신', value: 30 },
      { text: '목표지향', value: 29 },
      { text: '유연성', value: 28 },
      { text: '협업', value: 27 },
      { text: '자기주도', value: 26 },
      { text: '긍정적', value: 25 },
      { text: '전략적사고', value: 24 },
      { text: '시간관리', value: 23 },
      { text: '고객중심', value: 22 },
      { text: '세부지향', value: 21 },
      { text: '비판적사고', value: 20 },
      { text: '네트워킹', value: 19 },
      { text: '성과지향', value: 18 },
      { text: '윤리의식', value: 17 },
      { text: '글로벌마인드', value: 16 },
      { text: '멀티태스킹', value: 15 },
      { text: '프로젝트관리', value: 14 },
      { text: '기획력', value: 13 },
      { text: '실행력', value: 12 },
      { text: '품질관리', value: 11 },
      { text: '위기관리', value: 10 },
      { text: '데이터분석', value: 9 },
      { text: '협상력', value: 8 },
      { text: '비전제시', value: 7 },
      { text: '조직이해', value: 6 },
      { text: '학습능력', value: 5 },
      { text: '프레젠테이션', value: 4 },
      { text: '동기부여', value: 3 },
      { text: '창의력', value: 2 },
      { text: '정보수집', value: 1 },
      { text: '의사결정', value: 1 },
      { text: '목표설정', value: 1 },
      { text: '자기개발', value: 1 },
      { text: '비즈니스통찰력', value: 1 },
      { text: '감성지능', value: 1 },
      { text: '체계적사고', value: 1 },
      { text: '유머감각', value: 1 },
    ],
    keywordAnalysis: {
      topKeywords: ['열정', '팀워크', '창의성'],
      evaluation: '우수',
      feedback: '주요 키워드가 직무와 잘 연관되어 있습니다. 특히 "열정"과 "팀워크"를 강조한 점이 인상적입니다.',
    },
    answerTimes: [
      { question: '자기소개', time: 120 },
      { question: '지원동기', time: 90 },
      { question: '직무역량', time: 150 },
      { question: '장단점', time: 100 },
      { question: '목표', time: 110 },
    ],
    answerTimeAnalysis: {
      averageTime: 114,
      evaluation: '양호',
      feedback: '대부분의 질문에 적절한 시간을 사용했습니다. 다만, "직무역량" 질문에 대한 답변 시간이 다소 길었습니다.',
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const fontSizeMapper = word => Math.log2(word.value) * 4;
  const rotate = word => word.value % 150;
  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom align="center" style={{ color: '#0D47A1', fontWeight: 'bold' }}>
          AI 면접 결과 분석
        </Typography>
        <StyledTabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="AI종합평가" />
          <Tab label="성격특성" />
          <Tab label="음성 및 시선분석" />
          <Tab label="키워드 및 시간" />
        </StyledTabs>
      </StyledPaper>

      <Grid container spacing={4}>
        {/* AI 종합평가 탭 */}
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    전체 등급
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={150}
                  >
                    <Typography
                      variant="h2"
                      style={{ color: "#1976D2", fontWeight: "bold" }}
                    >
                      {interviewResult.aiEvaluation.grade}
                    </Typography>
                    <Typography variant="h6" style={{ marginLeft: 8 }}>
                      / 5등급 중
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    종합 평가
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={150}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={interviewResult.aiEvaluation.overallScore}
                      size={120}
                      thickness={5}
                    />
                    <Box
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="h4"
                        style={{ fontWeight: "bold", color: "#1976D2" }}
                      >
                        {interviewResult.aiEvaluation.overallScore}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    추천 지수
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={150}
                  >
                    <Typography
                      variant="h2"
                      style={{ color: "#00C853", fontWeight: "bold" }}
                    >
                      {interviewResult.aiEvaluation.recommendationScore}
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    평가 항목별 점수
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={interviewResult.aiEvaluation.evaluationItems}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCard>
            </Grid>
          </>
        )}

        {/* 성격 특성 탭 */}
        {activeTab === 1 && (
          <>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>성격 특성</Typography>
                  {interviewResult.personalityTraits.map((trait) => (
                    <Box key={trait.name} mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">{trait.name}</Typography>
                        <Typography variant="body2">{trait.score}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={trait.score} 
                        style={{height: 10, borderRadius: 5}} 
                      />
                    </Box>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>성격 분석</Typography>
                  <Typography variant="subtitle1">적합한 직종:</Typography>
                  <ul>
                    {interviewResult.personalityAnalysis.suitableJobs.map((job, index) => (
                      <li key={index}>{job}</li>
                    ))}
                  </ul>
                  <Typography variant="subtitle1">강점:</Typography>
                  <ul>
                    {interviewResult.personalityAnalysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                  <Typography variant="subtitle1">개선점:</Typography>
                  <ul>
                    {interviewResult.personalityAnalysis.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </CardContent>
              </StyledCard>
            </Grid>
          </>
        )}

        {/* 음성 및 시선분석 탭 */}
        {activeTab === 2 && (
          <>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>시선 처리</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={interviewResult.gazeData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="gaze" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <Typography variant="subtitle1" gutterBottom>평가: {interviewResult.gazeAnalysis.evaluation}</Typography>
                  <Typography variant="body2">{interviewResult.gazeAnalysis.feedback}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>표정 분석</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '긍정', value: interviewResult.expressionData.positive },
                          { name: '중립', value: interviewResult.expressionData.neutral },
                          { name: '부정', value: interviewResult.expressionData.negative },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography variant="subtitle1" gutterBottom>평가: {interviewResult.expressionAnalysis.evaluation}</Typography>
                  <Typography variant="body2">{interviewResult.expressionAnalysis.feedback}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>음성 분석</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={interviewResult.voiceData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="pitch" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="volume" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="speed" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <Typography variant="subtitle1" gutterBottom>평가: {interviewResult.voiceAnalysis.evaluation}</Typography>
                  <Typography variant="body2">{interviewResult.voiceAnalysis.feedback}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </>
        )}

        {/* 키워드 및 시간 탭 */}
        {activeTab === 3 && (
          <>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>키워드 분석</Typography>
                  <div style={{ height: 400 }}>
                    <Cloud
                      data={interviewResult.keywords}
                      fontSizeMapper={fontSizeMapper}
                      rotate={rotate}
                      width={150}
                      height={120}
                    />
                  </div>
                  <Typography variant="subtitle1" gutterBottom>평가: {interviewResult.keywordAnalysis.evaluation}</Typography>
                  <Typography variant="body2">{interviewResult.keywordAnalysis.feedback}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>답변 시간 분석</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={interviewResult.answerTimes}>
                      <XAxis dataKey="question" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="time" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Typography variant="subtitle1" gutterBottom>평가: {interviewResult.answerTimeAnalysis.evaluation}</Typography>
                  <Typography variant="body2">{interviewResult.answerTimeAnalysis.feedback}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </>
        )}
      </Grid>

      {/* 버튼 섹션 */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => {
            window.location.href = '/interview';
          }}
        >
          다시 연습하기
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          메인으로 돌아가기
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default ResultPage;
