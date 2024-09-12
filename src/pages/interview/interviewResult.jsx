//src\pages\interview\interviewResult.jsx
import React, { useEffect, useState } from "react";
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
import AnimatedWordCloud from "components/interview/animatedWordCloud";
import styles from "styles/interview/InterviewResult.module.css";
import { observer } from "mobx-react-lite";
import { useStores } from "contexts/storeContext";
import { fetchInterviewResult } from "api/interview";
import { useRouter } from "next/router";

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

const ResultPage = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { interviewStore, userStore } = useStores();
  const { videoId } = router.query; // URL에서 videoId 추출
  const [fetchedInterview, setInterviewResult] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    // 비동기 데이터를 가져오는 함수 정의
    const fetchData = async () => {
      try {
        if (videoId) {
          const data = await fetchInterviewResult(videoId); // videoId가 있을 때만 데이터 가져오기
  
          // claudeAnalyses가 존재하고, 0번 방의 analysisData가 JSON 문자열이면 파싱
          if (data.claudeAnalyses && data.claudeAnalyses.length > 0) {
            const parsedAnalysisData = JSON.parse(data.claudeAnalyses[0].analysisData);
            data.claudeAnalyses[0].analysisData = parsedAnalysisData;
          }
  
          setInterviewResult(data);
          console.log("가져온 면접 데이터입니다: ", data); // 상태를 업데이트한 후 data 직접 출력
        }
      } catch (error) {
        console.error("데이터 가져오는 중 오류 발생: ", error);
      }
    };
  
    // 정의한 비동기 함수 즉시 호출
    fetchData();
  }, [videoId]); // videoId가 변경될 때마다 호출

  // 면접 결과 데이터 (각 탭별로 다른 데이터 사용)
  const interviewResult = {
    aiEvaluation: {
      grade: (() => {
        const score = fetchedInterview.claudeAnalyses[0].overallScore;
        if (score >= 90) {
          return 1;
        } else if (score >= 80) {
          return 2;
        } else if (score >= 70) {
          return 3;
        } else if (score >= 60) {
          return 4;
        } else {
          return 5;
        }
      })(),
      overallScore: fetchedInterview.claudeAnalyses[0].overallScore,
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
  // AI 종합평가 분석 및 피드백
  const generateAIFeedback = (scores) => {
    let feedback = "AI 종합 평가:\n";
    scores.forEach(item => {
      if (item.score >= 90) {
        feedback += `${item.name}: 탁월한 수준입니다. 계속해서 이 강점을 발휘하세요.\n`;
      } else if (item.score >= 80) {
        feedback += `${item.name}: 우수한 수준입니다. 조금만 더 노력하면 탁월해질 수 있습니다.\n`;
      } else if (item.score >= 70) {
        feedback += `${item.name}: 양호한 수준입니다. 개선의 여지가 있으니 더 노력해보세요.\n`;
      } else {
        feedback += `${item.name}: 개선이 필요한 영역입니다. 집중적인 노력이 요구됩니다.\n`;
      }
    });
    return feedback;
  };

  // 성격 특성 분석
  const analyzePersonality = (data) => {
    let analysis = "성격 특성 분석:\n";
    data.forEach(trait => {
      if (trait.score > 80) {
        analysis += `${trait.name}: 매우 높음. `;
      } else if (trait.score > 60) {
        analysis += `${trait.name}: 높음. `;
      } else if (trait.score > 40) {
        analysis += `${trait.name}: 보통. `;
      } else {
        analysis += `${trait.name}: 낮음. `;
      }
    });
    analysis += "\n\n요약: ";
    if (data.find(t => t.name === '외향성').score > 70) {
      analysis += "외향적이고 ";
    } else {
      analysis += "내향적이며 ";
    }
    if (data.find(t => t.name === '개방성').score > 70) {
      analysis += "새로운 경험을 즐기는 ";
    }
    if (data.find(t => t.name === '성실성').score > 70) {
      analysis += "책임감 있고 조직적인 ";
    }
    if (data.find(t => t.name === '친화성').score > 70) {
      analysis += "협조적이고 타인을 배려하는 ";
    }
    if (data.find(t => t.name === '신경성').score < 30) {
      analysis += "정서적으로 안정된 ";
    }
    analysis += "성격입니다.";
    return analysis;
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom align="center"  className={styles.title}>
          AI 면접 결과 분석
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange} centered className={styles.tabs}>
          <Tab label="AI종합평가" className={styles.tab} />
          <Tab label="성격특성" className={styles.tab}/>
          <Tab label="음성 및 시선분석" className={styles.tab}/>
          <Tab label="키워드 및 시간" className={styles.tab}/>
        </Tabs>
      </Paper>

      <Grid container spacing={4}>
        {/* AI 종합평가 탭 */}
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={4}>
              <Card className={styles.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    전체 등급
                  </Typography>
                  <Box className={styles.gradeBox}>
                    <Typography variant="h2" className={styles.gradeNumber}>
                      {interviewResult.aiEvaluation.grade}
                    </Typography>
                    <Typography variant="h6" className={styles.gradeText}>
                      / 5등급 중
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={styles.card}>
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
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={styles.card}>
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
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={styles.card}>
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
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                    {generateAIFeedback(interviewResult.aiEvaluation.evaluationItems)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* 성격 특성 탭 */}
        {activeTab === 1 && (
          <>
            <Grid item xs={12} md={6}>
              <Card className={styles.card}>
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
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className={styles.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>성격 분석</Typography>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                    {analyzePersonality(interviewResult.personalityTraits)}
                  </Typography>
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
              </Card>
            </Grid>
          </>
        )}

        {/* 음성 및 시선분석 탭 */}
        {activeTab === 2 && (
          <>
            <Grid item xs={12} md={6}>
              <Card className={styles.card}>
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
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className={styles.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>표정 분석</Typography>
                  <ResponsiveContainer width="100%" height={250}>
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
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={styles.card}>
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
              </Card>
            </Grid>
          </>
        )}

        {/* 키워드 및 시간 탭 */}
        {activeTab === 3 && (
          <>
            <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>키워드 분석</Typography>
                <AnimatedWordCloud
                  data={interviewResult.keywords}
                  width="100%"
                  height={300}
                />
                <Typography variant="subtitle1" gutterBottom>
                  평가: {interviewResult.keywordAnalysis.evaluation}
                </Typography>
                <Typography variant="body2">
                  {interviewResult.keywordAnalysis.feedback}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
            <Grid item xs={12} md={6}>
              <Card className={styles.card}>
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
              </Card>
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
    </Container>
  );
});

export default ResultPage;
