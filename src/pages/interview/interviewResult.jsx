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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
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
import { fetchInterviewResult, minusBasicPlanPayment, minusPremiumPlanPayment } from "api/interview";
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
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [blurSections, setBlurSections] = useState([2, 3]); // 2: 음성 및 시선분석, 3: 키워드 및 시간&STAR 분석
  const [previousTab, setPreviousTab] = useState(0); // 이전 탭 정보를 저장
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleTabChange = (event, newValue) => {
    setPreviousTab(activeTab); // 현재 탭을 이전 탭으로 저장
    setActiveTab(newValue);
    if (blurSections.includes(newValue)) {
      setIsOverlayVisible(true);  // 배경 덮개 보이도록 설정
      setShowPaymentDialog(true); // 블러 처리된 탭 클릭 시 팝업 띄움
    }
  };
  // 팝업 창이 닫힐 때 이전 탭으로 이동
  const handleDialogClose = () => {
    setShowPaymentDialog(false);
    setIsOverlayVisible(false);
    setActiveTab(previousTab); // 팝업 닫을 때 이전 탭으로 이동
  };
  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };
  const handlePaymentSubmit = async () => {
    if (selectedPlan === "베이직플랜") {
      if(activeTab === 3){
        setActiveTab(previousTab); // 팝업 닫을 때 이전 탭으로 이동
        setBlurSections([2, 3]);
      }else{
        await minusBasicPlanPayment(userStore.id);
        const paymentInfo = await getPayInfoByUserId(userStore.id);
        setPaymentInfo(paymentInfo.data); // 결제 정보를 배열로 설정
        setBlurSections([3]); // 베이직 플랜 선택 시 키워드 및 시간&STAR 분석만 블러 처리
      }
      setIsOverlayVisible(false);
    } else if (selectedPlan === "프리미엄플랜") {
      await minusPremiumPlanPayment(userStore.id);
      const paymentInfo = await getPayInfoByUserId(userStore.id);
      setPaymentInfo(paymentInfo.data); // 결제 정보를 배열로 설정
      setBlurSections([]); // 프리미엄 플랜 선택 시 블러 처리 해제
      setIsOverlayVisible(false);
    }
    setShowPaymentDialog(false);
    
  };
  const isBlurred = (tabIndex) => blurSections.includes(tabIndex);
  // 결제 플랜을 라디오 버튼으로 선택 가능하게 렌더링
  // 결제 플랜을 라디오 버튼으로 선택 가능하게 렌더링
  const renderPaymentOptions = () => {
    if (paymentInfo.length === 0) {
      return <Typography>결제된 플랜이 없습니다.</Typography>;
    }

    return (
      <FormControl component="fieldset">
        <RadioGroup
          name="paymentPlans"
          value={selectedPlan || ""}
          onChange={(e) => handlePlanSelection(e.target.value)}
        >
          {paymentInfo.map((payment, index) => (
            <FormControlLabel
              key={index}
              value={payment.orderName}
              control={<Radio />}
              label={`${payment.orderName} / 남은횟수: ${payment.useCount}회`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  };

  useEffect(() => {
      const fetchPaymentInfo = async () => {
        try {
            const paymentInfo = await getPayInfoByUserId(userStore.id);
            console.log('결제정보: ', paymentInfo);
            setPaymentInfo(paymentInfo.data); // 결제 정보를 배열로 설정
        } catch (error) {
            console.error('결제 정보를 가져오는 중 오류가 발생했습니다:', error);
        }
    };
    fetchPaymentInfo();
    const fetchedInterview = toJS(interviewStore.fetchedInterview);
    console.log('fetchedInterview', fetchedInterview);



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
    const keywords = decodedKeywords.map((word, index) => ({
      text: word,
      value: word.length * 10 + index // 임의로 단어 길이에 인덱스를 더한 값으로 설정
    }));

    // 피드백 데이터를 변수로 선언
    let encodedFeedback = fetchedInterview.videoSpeechAnalyses[0].feedback;

    // JSON 데이터를 파싱하기 전에 인코딩된 부분을 디코딩
    let decodedFeedback = decodeURIComponent(encodedFeedback);

    // 디코딩된 데이터를 JSON으로 파싱
    let feedbackObj = JSON.parse(decodedFeedback);

    // 결과 확인
    console.log(feedbackObj);


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
    const positive = Number(fetchedInterview.videoSpeechAnalyses[0].sentimentConfidence / 100);
    const remaining = 100 - positive; // 100에서 positive를 뺀 값

    // remaining 값을 neutral과 negative가 랜덤하게 나눠 갖게 함
    const neutral = Number((Math.random() * remaining).toFixed(2)); // 랜덤으로 나눔
    const negative = Number((remaining - neutral).toFixed(2)); // 남은 값
    // 면접 결과 데이터를 상태로 업데이트
    const result = {
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
        recommendationScore: (() => {
          const logicScore = fetchedInterview.claudeAnalyses[0].analysisData.content_analysis.logic_score || 0;
          const creativityScore = fetchedInterview.claudeAnalyses[0].analysisData.insight_analysis.creativity_score || 0;
          const problemSolvingScore = fetchedInterview.claudeAnalyses[0].analysisData.insight_analysis.problem_solving_score || 0;
          const grammarStructureScore = fetchedInterview.claudeAnalyses[0].analysisData.language_pattern_analysis.grammar_structure_score || 0;
          const professionalVocabScore = fetchedInterview.claudeAnalyses[0].analysisData.language_pattern_analysis.professional_vocab_score || 0;
          const confidenceScore = fetchedInterview.claudeAnalyses[0].analysisData.sentiment_analysis.confidence_score || 0;
          const consistencyScore = fetchedInterview.claudeAnalyses[0].analysisData.content_analysis.consistency_score || 0;
          
          const score = logicScore + creativityScore + problemSolvingScore + grammarStructureScore + professionalVocabScore + confidenceScore + consistencyScore;
          return ((score / 7) * 10).toFixed(1);
        })(),
        evaluationItems: [
          { name: '논리성', score: fetchedInterview.claudeAnalyses[0].analysisData.content_analysis.logic_score * 10 },
          { name: '자신감', score: fetchedInterview.claudeAnalyses[0].analysisData.sentiment_analysis.confidence_score * 10 },
          { name: '적절성', score: fetchedInterview.claudeAnalyses[0].analysisData.language_pattern_analysis.grammar_structure_score * 10 },
          { name: '일관성', score: fetchedInterview.claudeAnalyses[0].analysisData.content_analysis.consistency_score * 10 },
          { name: '창의성', score: fetchedInterview.claudeAnalyses[0].analysisData.insight_analysis.creativity_score * 10 },
          { name: '문제해결능력', score: fetchedInterview.claudeAnalyses[0].analysisData.insight_analysis.problem_solving_score * 10 },
        ],
        aiFeedback: "AI 종합 평가:\n" + fetchedInterview.claudeAnalyses[0].improvementSuggestions
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
        evaluation: (() => {
          const gazeScore = fetchedInterview.videoAnalyses[0].eyeScore;
          if (gazeScore >= 85) return '우수';
          if (gazeScore >= 70) return '양호';
          if (gazeScore >= 55) return '보통';
          if (gazeScore >= 30) return '미흡';
          return '취약';
        })(),
        feedback: fetchedInterview.videoAnalyses[0].headEyeFeedback,
      },
      expressionAnalysis: {
        dominantExpression: '긍정',
        evaluation: (() => {
          const expressionScore = positive;
          if (expressionScore >= 85) return '우수';
          if (expressionScore >= 70) return '양호';
          if (expressionScore >= 55) return '보통';
          if (expressionScore >= 30) return '미흡';
          return '취약';
        })(),
        feedback: feedbackObj.summary_feedback,
      },
      voiceData: [
        { 
          time: 0, 
          pitch: Math.floor(fetchedInterview.videoAnalyses[0].audioPitch / 10),
          spectralCentroid: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
          speed: Math.floor(fetchedInterview.videoAnalyses[0].audioTempo)
        },
        { 
          time: 1, 
          pitch: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioPitch / 10)),
          spectralCentroid: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10)),
          speed: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioTempo))
        },
        { 
          time: 2, 
          pitch: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioPitch / 10)),
          spectralCentroid: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10)),
          speed: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioTempo))
        },
        { 
          time: 3, 
          pitch: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioPitch / 10)),
          spectralCentroid: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10)),
          speed: randomAdjust(Math.floor(fetchedInterview.videoAnalyses[0].audioTempo))
        },
        { 
          time: 4, 
          pitch: Math.floor(fetchedInterview.videoAnalyses[0].audioPitch / 10),
          spectralCentroid: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
          speed: Math.floor(fetchedInterview.videoAnalyses[0].audioTempo)
        },
      ],
      voiceAnalysis: {
        averagePitch: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
        averageVolume: Math.floor(fetchedInterview.videoAnalyses[0].audioSpectralCentroid / 10),
        averageSpeed: Math.floor(fetchedInterview.videoAnalyses[0].audioTempo),
        evaluation: '음정과 스펙트럼은 나누기 10 한 값이 그래프에 표시됩니다',
        feedback: fetchedInterview.videoAnalyses[0].audioFeedback,
      },
      keywords: keywords,
      answerTimes: [
        // { question: '응답시간(초)', time: parsedContentData.answer_duration_analysis.duration },
        { question: '응답시간점수', time: fetchedInterview.claudeAnalyses[0].analysisData.answer_duration_analysis.pace_score * 10 },
        { question: 'Situation', time: fetchedInterview.claudeAnalyses[0].analysisData.star_analysis.situation_score * 10 },
        { question: 'Task', time: fetchedInterview.claudeAnalyses[0].analysisData.star_analysis.task_score * 10 },
        { question: 'Action', time: fetchedInterview.claudeAnalyses[0].analysisData.star_analysis.action_score * 10 },
        { question: 'Results', time: fetchedInterview.claudeAnalyses[0].analysisData.star_analysis.result_score * 10 },
      ],
      answerTimeAnalysis: {
        averageTime: fetchedInterview.claudeAnalyses[0].analysisData.answer_duration_analysis.duration,
        evaluation: fetchedInterview.claudeAnalyses[0].analysisData.answer_duration_analysis.duration,
        feedback: fetchedInterview.claudeAnalyses[0].analysisData.answer_duration_analysis.comment,
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
      {isOverlayVisible && setBlurSections !== null &&(
        <div className={styles.overlay} />
      )}
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

      {/* Dialog for Payment Plan Selection */}
      <Dialog open={showPaymentDialog} onClose={handleDialogClose}>
        <DialogTitle className={styles.dialogTitle}>사용하실 결제 플랜을 선택해주세요</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          {renderPaymentOptions()}
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handlePaymentSubmit} className={styles.paymentButton} disabled={!selectedPlan}>
            다음
          </Button>
        </DialogActions>
      </Dialog>

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
            <Grid item xs={12} md={6} className={isBlurred(2) ? styles.blurred : ""}>
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
                      <Line type="monotone" dataKey="spectralCentroid" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="speed" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <Typography variant="subtitle1" gutterBottom>주의: {interviewResult.voiceAnalysis.evaluation}</Typography>
                  <Typography variant="body2">{interviewResult.voiceAnalysis.feedback}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* 키워드 및 시간 탭 */}
        {activeTab === 3 && (
          <>
            <Grid item xs={12} md={6} className={isBlurred(3) ? styles.blurred : ""}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>키워드 분석</Typography>
                <AnimatedWordCloud
                  data={interviewResult.keywords}
                  width="100%"
                  height={350}
                />
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
      {/* 다음과 같은 blur 스타일을 적용 */}
      <style jsx>{`
        .blurred {
          filter: blur(5px);
          pointer-events: none;
        }
      `}</style>
    </Container>
  );
});

export default ResultPage;
