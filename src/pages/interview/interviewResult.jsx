//src\pages\interview\interviewResult.jsx
import React, { useEffect, useState } from "react";
import { toJS } from 'mobx';
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
import { getPayInfoByUserId } from "api/user";

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
  const [activeTab, setActiveTab] = useState(0);
  const { interviewStore, userStore } = useStores();
  const [interviewResult, setInterviewResult] = useState(null); // 상태로 interviewResult를 관리

  // useEffect(() => {
  //     const fetchPaymentInfo = async () => {
  //         try {
  //             const paymentInfo = await getPayInfoByUserId(userStore.id);
  //             console.log('결제정보: ', paymentInfo);
  //         } catch (error) {
  //             console.error('결제 정보를 가져오는 중 오류가 발생했습니다:', error);
  //         }
  //     };
  //     fetchPaymentInfo();
  // }, [userStore]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
      const fetchPaymentInfo = async () => {
        try {
            const paymentInfo = await getPayInfoByUserId(userStore.id);
            console.log('결제정보: ', paymentInfo);
        } catch (error) {
            console.error('결제 정보를 가져오는 중 오류가 발생했습니다:', error);
        }
    };
    fetchPaymentInfo();
    const fetchedInterview = toJS(interviewStore.fetchedInterview);
    console.log('fetchedInterview', fetchedInterview);


    // 잘못된 백틱 문자를 포함한 contentData에서 백틱을 제거하고 JSON 파싱
    let contentData = fetchedInterview.claudeAnalyses[0].analysisData.content;

    // 백틱 및 "```json" 같은 텍스트를 제거
    contentData = contentData.replace(/```json/g, '').replace(/```/g, '');

    // JSON 파싱을 진행
    let parsedContentData;
    try {
        parsedContentData = JSON.parse(contentData);
        console.log(parsedContentData);
    } catch (error) {
        console.error('JSON 파싱 중 오류 발생:', error);
    }


    // 유니코드로 저장된 keywords를 변환
    const encodedKeywords = fetchedInterview.claudeAnalyses[0].keywords;
    // JSON 문자열을 배열로 변환
    let keywordsArray;
    try {
      keywordsArray = JSON.parse(encodedKeywords);
    } catch (error) {
      console.error("JSON 파싱 중 오류 발생:", error);
    }

    // 유니코드 문자열을 변환하는 함수
    const decodeUnicodeString = (str) => {
      return unescape(str.replace(/\\u/g, '%u'));
    };

    // 각 키워드를 변환
    const decodedKeywords = keywordsArray.map(decodeUnicodeString);
    console.log('decodedKeywords', decodedKeywords);
    
    const randomAdjust = (value) => {
      // -10에서 10 사이의 소수점 값을 랜덤으로 더하거나 뺌
      const randomValue = (Math.random() * 10).toFixed(1); // 0 ~ 10 사이의 소수점 첫째 자리까지 랜덤 값
      return value + (Math.random() < 0.5 ? -randomValue : +randomValue); // 랜덤하게 더하거나 뺌
    };
    const randomBdjust = (value) => {
      // -5에서 5 사이의 랜덤한 소수점 값을 더하거나 뺌
      const randomValue = (Math.random() * 5).toFixed(1); // 0 ~ 5 사이의 소수점 첫째 자리까지 랜덤 값
      return value + (Math.random() < 0.5 ? -randomValue : +randomValue); // 랜덤하게 더하거나 뺌
    };
    const positive = Number(fetchedInterview.videoSpeechAnalyses[0].sentimentConfidence.toFixed(2));
    const remaining = 100 - positive; // 100에서 positive를 뺀 값

    // remaining 값을 neutral과 negative가 랜덤하게 나눠 갖게 함
    const neutral = Number((Math.random() * remaining).toFixed(2)); // 랜덤으로 나눔
    const negative = Number((remaining - neutral).toFixed(2)); // 남은 값
    // 면접 결과 데이터를 상태로 업데이트
    const result = {
      aiEvaluation: {
        grade: (() => {
          const score = parsedContentData.overall_quality;
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
        overallScore: parsedContentData.overall_quality,
        recommendationScore: (() => {
          const logicScore = parsedContentData.content_analysis.logic_score || 0;
          const creativityScore = parsedContentData.insight_analysis.creativity_score || 0;
          const problemSolvingScore = parsedContentData.insight_analysis.problem_solving_score || 0;
          const grammarStructureScore = parsedContentData.language_pattern_analysis.grammar_structure_score || 0;
          const professionalVocabScore = parsedContentData.language_pattern_analysis.professional_vocab_score || 0;
          const confidenceScore = parsedContentData.sentiment_analysis.confidence_score || 0;
          const consistencyScore = parsedContentData.content_analysis.consistency_score || 0;
          
          const score = logicScore + creativityScore + problemSolvingScore + grammarStructureScore + professionalVocabScore + confidenceScore + consistencyScore;
          return ((score / 7) * 10).toFixed(1);
        })(),
        evaluationItems: [
          { name: '논리성', score: parsedContentData.content_analysis.logic_score * 10 },
          { name: '자신감', score: parsedContentData.sentiment_analysis.confidence_score * 10 },
          { name: '적절성', score: parsedContentData.language_pattern_analysis.grammar_structure_score * 10 },
          { name: '일관성', score: parsedContentData.content_analysis.consistency_score * 10 },
          { name: '창의성', score: parsedContentData.insight_analysis.creativity_score * 10 },
          { name: '문제해결능력', score: parsedContentData.insight_analysis.problem_solving_score * 10 },
        ],
        aiFeedback: "AI 종합 평가:\n" + parsedContentData.improvement_suggestions
      },
      personalityTraits: fetchedInterview.videos[0].filePath,
      personalityAnalysis: fetchedInterview.videoAnalyses[0].analyzedFilePath,
      gazeData: [
        { 
          time: 0, 
          gaze: Number(fetchedInterview.videoAnalyses[0].eyeScore.toFixed(2)) // 소수점 둘째 자리까지 반올림
        },
        { 
          time: 1, 
          gaze: Number(randomBdjust(fetchedInterview.videoAnalyses[0].eyeScore).toFixed(2)) // 랜덤 조정 후 소수점 둘째 자리까지 반올림
        },
        { 
          time: 2, 
          gaze: Number(randomBdjust(fetchedInterview.videoAnalyses[0].eyeScore).toFixed(2))
        },
        { 
          time: 3, 
          gaze: Number(randomBdjust(fetchedInterview.videoAnalyses[0].eyeScore).toFixed(2))
        },
        { 
          time: 4, 
          gaze: Number(fetchedInterview.videoAnalyses[0].eyeScore.toFixed(2)) // 소수점 둘째 자리까지 반올림
        },
      ],
      expressionData: {
        positive: positive,
        neutral: neutral,
        negative: negative,
      },
      gazeAnalysis: {
        averageGaze: Number(fetchedInterview.videoAnalyses[0].eyeScore.toFixed(2)),
        evaluation: '양호',
        feedback: '전반적으로 좋은 눈맞춤을 유지했지만, 일부 순간에 개선이 필요합니다.',
      },
      expressionAnalysis: {
        dominantExpression: '긍정',
        evaluation: '우수',
        feedback: '면접 동안 대부분 긍정적인 표정을 유지했습니다. 이는 열정과 자신감을 잘 표현한 것으로 보입니다.',
      },
      voiceData: [
        { 
          time: 0, 
          pitch: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
          volume: Math.floor(fetchedInterview.videoAnalyses[0].audioVolume * 1000),
          speed: Math.floor(fetchedInterview.videoAnalyses[0].audioTempo)
        },
        { 
          time: 1, 
          pitch: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10)),
          volume: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioVolume * 1000)),
          speed: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioTempo))
        },
        { 
          time: 2, 
          pitch: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10)),
          volume: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioVolume * 1000)),
          speed: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioTempo))
        },
        { 
          time: 3, 
          pitch: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10)),
          volume: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioVolume * 1000)),
          speed: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioTempo))
        },
        { 
          time: 4, 
          pitch: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
          volume: Math.floor(fetchedInterview.videoAnalyses[0].audioVolume * 1000),
          speed: Math.floor(fetchedInterview.videoAnalyses[0].audioTempo)
        },
      ],
      voiceAnalysis: {
        averagePitch: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
        averageVolume: Math.floor(fetchedInterview.videoAnalyses[0].audioVolume * 1000),
        averageSpeed: Math.floor(fetchedInterview.videoAnalyses[0].audioTempo),
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
        // { question: '응답시간(초)', time: parsedContentData.answer_duration_analysis.duration },
        { question: '응답시간점수', time: parsedContentData.answer_duration_analysis.pace_score * 10 },
        { question: 'Situation', time: parsedContentData.star_analysis.situation_score * 10 },
        { question: 'Task', time: parsedContentData.star_analysis.task_score * 10 },
        { question: 'Action', time: parsedContentData.star_analysis.action_score * 10 },
        { question: 'Results', time: parsedContentData.star_analysis.result_score * 10 },
      ],
      answerTimeAnalysis: {
        averageTime: parsedContentData.answer_duration_analysis.duration,
        evaluation: parsedContentData.answer_duration_analysis.duration,
        feedback: parsedContentData.answer_duration_analysis.comment,
      },
    };

  
    setInterviewResult(result); // 상태 업데이트
  }, [userStore]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
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

  if (!interviewResult) {
    return <div>Loading...</div>; // 데이터를 불러오기 전 로딩 표시
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom align="center"  className={styles.title}>
          AI 면접 결과 분석
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange} centered className={styles.tabs}>
          <Tab label="AI종합평가" className={styles.tab} />
          <Tab label="영상복기" className={styles.tab}/>
          <Tab label="음성 및 시선분석" className={styles.tab}/>
          <Tab label="키워드 및 시간&STAR 분석" className={styles.tab}/>
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
                    {interviewResult.aiEvaluation.aiFeedback}
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
                  {/* 비디오 추가 */}
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom>면접 영상</Typography>
                    <video width="100%" controls>
                      <source src={interviewResult.personalityTraits} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className={styles.card}>
                <CardContent>
                  {/* 비디오 추가 */}
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom>분석 영상</Typography>
                    <video width="100%" controls>
                      <source src={interviewResult.personalityAnalysis} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
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
                  <Typography variant="subtitle1" gutterBottom>답변시간: {interviewResult.answerTimeAnalysis.evaluation}초</Typography>
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
