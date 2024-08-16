import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  LinearProgress, IconButton, Fade, useTheme, CircularProgress, 
  Modal, Paper, Grid, Tooltip, Menu, MenuItem,Popover
} from '@mui/material';
import { Help, Mic } from '@mui/icons-material';
import { setInterviewData, loadQuestions, setStatus } from '../../redux/slices/interviewSlice';
import styles from '@/styles/interview/interviewRecordPage.module.css';

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
  const [selectedQuestions, setSelectedQuestions] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  
  const { questions, status, error } = useSelector(state => state.interview);

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
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [speechFeedback, setSpeechFeedback] = useState({ speed: 'normal', volume: 'good' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  
  const [showWarning, setShowWarning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintAnchorEl, setHintAnchorEl] = useState(null);
  const [warningAnchorEl, setWarningAnchorEl] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { interviewType, selectedQuestions, candidateData } = router.query;
      console.log("Router query:", { interviewType, selectedQuestions, candidateData });
      setInterviewType(interviewType);
      setSelectedQuestions(selectedQuestions ? JSON.parse(selectedQuestions) : null);
      setCandidateData(candidateData ? JSON.parse(candidateData) : null);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (interviewType) {
      console.log("Loading questions for interview type:", interviewType);
      dispatch(setStatus('loading'));
      dispatch(loadQuestions({ 
        interviewType, 
        selectedQuestions: interviewType === 'mock' ? selectedQuestions : undefined,
        candidateData: interviewType === 'real' ? candidateData : undefined
      }));
    }
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

  const speakQuestion = useCallback((text) => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      speechSynthesisRef.current.speak(utterance);
    }
  }, []);

  const handleStartAnswer = useCallback(() => {
    setShowModal(true);
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      setCountdownTime(countdown);
      countdown -= 1;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        setShowModal(false);
        dispatch(setStatus('recording'));
        startRecording();
        setRecordingStartTime(Date.now());
        if (questions[currentQuestionIndex]?.question) {
          speakQuestion(questions[currentQuestionIndex].question);
        }
      }
    }, 1000);
  }, [dispatch, startRecording, speakQuestion, questions, currentQuestionIndex]);
  //수정 09:56
  const handleSubmitAnswer = useCallback(() => {
    const currentTime = Date.now();
    if (recordingStartTime && currentTime - recordingStartTime < 10000) {
      setWarningAnchorEl(event.currentTarget);
      setShowWarning(true);
    } else {
      stopRecording();
      dispatch(setStatus('uploading'));
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          dispatch(setStatus('pending'));
          setTimeLeft(60);
          setShowStartButton(true);
          // 다음 질문을 준비하기 위해 상태 초기화
          setRecordedChunks([]);
          setIsRecording(false);
        } else {
          dispatch(setStatus('ending'));
        // 모든 질문이 끝났을 때의 처리
        }
      }, 3000);
    }  
  }, [dispatch, stopRecording, currentQuestionIndex, questions.length, recordingStartTime, router]);
//수정 09:56
const handleNextQuestion = useCallback(() => {
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    dispatch(setStatus('pending'));
    setTimeLeft(60);
    setShowStartButton(true);
    // 다음 질문을 준비하기 위해 상태 초기화
    setRecordedChunks([]);
    setIsRecording(false);
  } else {
    dispatch(setStatus('ending'));
    router.push('/interview/interviewResult');
  }
}, [currentQuestionIndex, questions.length, dispatch, router]);
// useEffect 내에서 questions 상태 변화 감지
useEffect(() => {
  console.log("Questions updated:", questions);
  if (questions && questions.length > 0) {
    dispatch(setStatus('pending'));
  }
}, [questions, dispatch]);
useEffect(() => {
  console.log("Current question index:", currentQuestionIndex);
  console.log("Current status:", status);
}, [currentQuestionIndex, status]);

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
      dispatch(setStatus('uploading'));
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleNextQuestion();
      }, 3000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, timeLeft, stopRecording, handleNextQuestion, dispatch]);

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
  if (!interviewType) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Typography variant="h4" component="h1" gutterBottom align="center" className={styles.title}>
        {interviewType === 'mock' ? '모의 면접' : '실전 면접'}
      </Typography>
      
      {status === 'loading' && (
        <Box className={styles.loadingBox}>
          <CircularProgress />
          <Typography>면접 정보를 불러오는 중입니다...</Typography>
        </Box>
      )}

      {status === 'failed' && (
        <Typography color="error">오류 발생: {error}</Typography>
      )}
  
      {['pending', 'recording', 'uploading', 'ending'].includes(status) && (
        <Grid container spacing={3} className={styles.mainContent}>
          <Grid item xs={12} md={8}>
            <Box className={styles.videoSection}>
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
              <Typography id="modal-title" variant="h6" component="h2">
                {countdownTime}초 후에 면접이 시작됩니다
              </Typography>
              <Typography id="modal-description" className={styles.modalDescription}>
                60초 이내에 답변하셔야 합니다.
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
};

export default InterviewRecordPage;