import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  LinearProgress, IconButton, Fade, useTheme, CircularProgress, 
  Modal, Paper, Grid, Tooltip, Menu, MenuItem,Popover
} from '@mui/material';
import { Help, SettingsBackupRestore, Mic } from '@mui/icons-material';
import { setInterviewData, loadQuestions } from '../../redux/slices/interviewSlice';
import styles from '@/styles/interview/interviewRecordPage.module.css';
import { useSpeechSynthesis } from "react-speech-kit";
// 음성 분석을 위한 가상의 API
const speechAnalysisAPI = {
  analyze: (audioData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          speed: Math.random() > 0.5 ? 'normal' : 'slow',
          volume: Math.random() > 0.5 ? 'good' : 'low'
        });
      }, 1000);
    });
  }
};

const InterviewRecordPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [interviewType, setInterviewType] = useState(null);
  const [mockQuestions, setMockQuestions] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState(null);  // 추가된 변수 선언
  const [candidateData, setCandidateData] = useState(null);  // 추가된 변수 선언
  useEffect(() => {
    if (router.isReady) {
      const { interviewType, mockQuestions } = router.query;
      setInterviewType(interviewType);
      setMockQuestions(mockQuestions ? JSON.parse(mockQuestions) : null);
    }
  }, [router.isReady, router.query]);

  const questions = useSelector(state => state.interview.questions);

  const [status, setStatus] = useState('generating');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stream, setStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [countdownTime, setCountdownTime] = useState(3);
  const [showScript, setShowScript] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [speechFeedback, setSpeechFeedback] = useState({ speed: 'normal', volume: 'good' });
  const [backgroundAnchorEl, setBackgroundAnchorEl] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState('office');
  const [isAnalyzing, setIsAnalyzing] = useState(false);const [recordingStartTime, setRecordingStartTime] = useState(null);
  
  const [showWarning, setShowWarning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintAnchorEl, setHintAnchorEl] = useState(null);
  const [warningAnchorEl, setWarningAnchorEl] = useState(null);


  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted", { interviewType, selectedQuestions, candidateData });
  
    const loadInterviewQuestions = async () => {
      console.log("Loading interview questions...");
      setStatus('generating');
      try {
        const result = await dispatch(loadQuestions({ 
          interviewType, 
          selectedQuestions: interviewType === 'mock' ? selectedQuestions : undefined,
          candidateData: interviewType === 'real' ? candidateData : undefined
        })).unwrap();
        console.log("Questions loaded:", result);
        
        if (result && result.length > 0) {
          setStatus('pending');
        } else {
          setStatus('error');
          console.error("No questions loaded");
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
        setStatus('error');
      }
    };
  
    loadInterviewQuestions();
  }, [dispatch, interviewType, selectedQuestions, candidateData]);
  
  useEffect(() => {
    console.log("Status or questions changed:", { status, questionsLength: questions.length });
  }, [status, questions]);

  const getMediaPermission = useCallback(async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(videoStream);
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (err) {
      console.error("미디어 접근 에러:", err);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!stream) return;
    setRecordedChunks([]);
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    setIsRecording(true);
    setTimeLeft(60);
    setShowStartButton(false);
    setRecordingStartTime(Date.now());
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleDataAvailable = useCallback((event) => {
    if (event.data && event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  }, []);
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setTimeout(() => {
        setIsSubmitEnabled(true);
      }, 10000); // 10초 후 활성화
    } else {
      setIsSubmitEnabled(false);
    }

    return () => clearTimeout(timer);
  }, [isRecording]);

  const handleStartAnswer = useCallback(() => {
    setShowModal(true);
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      setCountdownTime(countdown);
      countdown -= 1;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        setShowModal(false);
        setStatus('recording');
        startRecording();
        setRecordingStartTime(Date.now());
        if (questions[currentQuestionIndex]?.question) {
          speak({ text: questions[currentQuestionIndex].question, lang: 'ko-KR' });
        }
      }
    }, 1000);
  }, [startRecording, speak, questions, currentQuestionIndex]);

  const handleSubmitAnswer = useCallback(() => {
    const currentTime = Date.now();
    if (recordingStartTime && currentTime - recordingStartTime < 10000) {
      setWarningAnchorEl(event.currentTarget);
      setShowWarning(true);
    } else {
    stopRecording();
    setStatus('uploading');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setStatus('pending');
        setTimeLeft(60);
        setShowStartButton(true);
      } else {
        setStatus('ending');
      }
    }, 3000);
  }  
}, [stopRecording, currentQuestionIndex, questions.length, recordingStartTime]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setStatus('pending');
      setTimeLeft(60);
      setShowStartButton(true);
    } else {
      setStatus('ending');
      router.push('/interview/interviewResult');
    }
  }, [currentQuestionIndex, questions.length, router]);
  const handleCloseWarning = () => {
    setShowWarning(false);
    setWarningAnchorEl(null);
  };
  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopRecording();
      setStatus('uploading');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleNextQuestion();
      }, 3000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, timeLeft, stopRecording, handleNextQuestion]);

  useEffect(() => {
    if (!stream) {
      getMediaPermission();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, getMediaPermission]);

  useEffect(() => {
    if (recordedChunks.length > 0 && status === 'uploading') {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      dispatch(setInterviewData({
        questionIndex: currentQuestionIndex,
        videoBlob: blob,
      }));
    }
  }, [recordedChunks, status, currentQuestionIndex, dispatch]);

  const analyzeSpeech = useCallback(async () => {
    if (!isRecording) return;
    
    setIsAnalyzing(true);
    try {
      const audioData = new Blob(recordedChunks, { type: 'audio/webm' });
      const result = await speechAnalysisAPI.analyze(audioData);
      setSpeechFeedback(result);
    } catch (error) {
      console.error('Speech analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isRecording, recordedChunks]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(analyzeSpeech, 10000);
      return () => clearInterval(interval);
    }
  }, [isRecording, analyzeSpeech]);
  
  const handleHintRequest = useCallback(() => {
    setShowScript((prev) => !prev);
  }, []);

  const handleCloseHint = () => {
    setShowHint(false);
    setHintAnchorEl(null);
  };
  const handleGuideClose = () => setShowGuide(false);

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Typography variant="h4" component="h1" gutterBottom align="center" className={styles.title}>
        {interviewType === 'mock' ? '모의 면접' : '실전 면접'}
      </Typography>
      
      {status === 'generating' && (
        <Box className={styles.loadingBox}>
          <CircularProgress />
          <Typography>질문을 생성 중입니다...</Typography>
        </Box>
      )}
  
      {status === 'error' && (
        <Typography color="error">질문을 불러오는데 실패했습니다. 다시 시도해주세요.</Typography>
      )}
  
      {(status !== 'generating' && status !== 'error') && (
        <Grid container spacing={3} className={styles.mainContent}>
          <Grid item xs={12} md={8}>
            <Box className={styles.videoSection} style={{backgroundImage: `url(/backgrounds/${selectedBackground}.jpg)`}}>
              <video ref={videoRef} autoPlay muted className={styles.video} />
              {isRecording && (
                <Box className={styles.recordingIndicator}>
                  REC
                </Box>
              )}
              <Fade in={true}>
                <Box className={styles.questionOverlay}>
                  <Typography variant="h6">
                    Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex]?.question}
                  </Typography>
                </Box>
              </Fade>
             
            </Box>
            <Box className={styles.controlsSection}>
              <Tooltip title="힌트 요청">
                <IconButton onClick={handleHintRequest} className={styles.controlButton}>
                  <Help />
                </IconButton>
              </Tooltip>
              <Tooltip title="음성 분석">
                <IconButton onClick={analyzeSpeech} className={styles.controlButton} disabled={!isRecording || isAnalyzing}>
                  <Mic />
                </IconButton>
              </Tooltip>
  
            </Box>
          
            <Fade in={showScript}>
              <Paper elevation={3} className={styles.scriptSection}>
                <Typography variant="h6" gutterBottom>스크립트 및 키워드</Typography>
                <Typography variant="body2">{questions[currentQuestionIndex]?.script}</Typography>
                <Typography variant="body2" className={styles.keywords}>
                  키워드: {questions[currentQuestionIndex]?.keywords?.join(', ')}
                </Typography>
              </Paper>
            </Fade>
            </Grid>
          <Grid item xs={12} md={4}>
            <Card className={styles.timerCard}>
              <CardContent>
                <Box className={styles.timerBox}>
                  <Typography variant="h2" className={styles.timerText}>
                    {timeLeft}
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={(timeLeft / 60) * 100} className={styles.timerProgress} />
                <Box mt={3}>
                  {status === 'pending' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleStartAnswer}
                      fullWidth
                      size="large"
                      className={styles.actionButton}
                    >
                      답변 시작
                    </Button>
                  )}
                  {status === 'recording' && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmitAnswer}
                      fullWidth
                      size="large"
                      className={styles.actionButton}
                    >
                      답변 제출
                    </Button>
                  )}
                  
                  <Popover
                      open={showWarning}
                      anchorEl={warningAnchorEl}
                      onClose={handleCloseWarning}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                    <Box className={styles.warningPopover}>
                      <Typography>
                        답변 시간이 10초 이상 되어야 제출 가능합니다.
                      </Typography>
                      <Button onClick={handleCloseWarning} color="primary">
                        확인
                      </Button>
                    </Box>
                  </Popover>
                  {(status === 'uploading' || status === 'ending') && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNextQuestion}
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                      className={styles.actionButton}
                    >
                      {status === 'ending' ? '결과 보기' : '다음 문제'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
            
            <Paper elevation={3} className={styles.feedbackSection}>
              <Typography variant="h6" gutterBottom>음성 피드백</Typography>
              <Typography>말하기 속도: {speechFeedback.speed}</Typography>
              <Typography>음량: {speechFeedback.volume}</Typography>
            </Paper>

            <Paper elevation={3} className={styles.progressSection}>
              <Typography variant="h6" gutterBottom>면접 진행 상황</Typography>
              <Box display="flex" alignItems="center">
                <LinearProgress 
                  variant="determinate" 
                  value={(currentQuestionIndex + 1) / questions.length * 100} 
                  className={styles.progressBar}
                />
                <Typography variant="body2" className={styles.progressText}>
                  {currentQuestionIndex + 1} / {questions.length}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
  
  <Modal
        open={status === 'generating' || showModal || isSubmitting}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className={styles.modal}>
          {status === 'generating' && (
            <>
              <Typography id="modalTitle" variant="h6" component="h2">
                면접 문제를 생성중입니다
              </Typography>
              <CircularProgress className={styles.modalProgress} />
            </>
          )}
          {showModal && (
            <>
              <Typography id="modalTitle" variant="h6" component="h2">
                {countdownTime}초 후에 면접이 시작됩니다
              </Typography>
              <Typography id="modalDescription" className={styles.modalDescription}>
                면접 답변을 준비해주세요
              </Typography>
            </>
          )}
          {isSubmitting && (
            <>
              <Typography id="modal-title" variant="h6" component="h2">
                답변을 제출중입니다
              </Typography>
              <CircularProgress className={styles.modalProgress} />
            </>
          )}
        </Box>
      </Modal>

      <Modal open={showGuide} onClose={handleGuideClose}>
        <Box className={styles.guideModal}>
          <Typography variant="h6" gutterBottom>면접 가이드</Typography>
          <Typography variant="body1">
            1. 카메라와 마이크를 확인하세요.<br />
            2. 질문을 주의 깊게 듣고 생각한 후 답변하세요.<br />
            3. 명확하고 간결하게 답변하세요.<br />
            4. 긍정적인 태도를 유지하세요.<br />
            5. 시간을 잘 관리하세요.
          </Typography>
          <Button onClick={handleGuideClose} variant="contained" color="primary" style={{marginTop: '1rem'}}>
            이해했습니다
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default InterviewRecordPage;