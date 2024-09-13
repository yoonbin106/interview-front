import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  LinearProgress, IconButton, Fade, useTheme, CircularProgress, 
  Modal, Paper, Grid, Tooltip, Popover, Stepper, Step, StepLabel
} from '@mui/material';
import { Help, Mic, VolumeUp } from '@mui/icons-material';
import { setInterviewData, setStatus } from '../../redux/slices/interviewSlice';
import styles from '@/styles/interview/interviewRecordPage.module.css';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/contexts/storeContext';
import { getInterviewQuestions, uploadInterviewVideo } from '@/api/interview';
import userStore from '@/stores/userStore';

const InterviewRecordPage = observer(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [interviewType, setInterviewType] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const { status, error } = useSelector(state => state.interview);

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
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  
  const [showWarning, setShowWarning] = useState(false);
  const [warningAnchorEl, setWarningAnchorEl] = useState(null);
  const [audioData, setAudioData] = useState([]);
  const theme = useTheme();

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const { interviewStore } = useStores();

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speakText(`${userStore.username}님 AI ${interviewStore.type == 'mock'?'모의':'실전'} 면접을 시작합니다. 면접 가이드 내용 확인하시고, 준비되시면 답변 시작 버튼을 눌러주세요.`);
  }, []);

  useEffect(() => {
    const fetchInterviewData = async () => {
      if (router.isReady) {
        const interviewType = interviewStore.type;
        if(interviewType === 'mock'){
          const selectedQuestions = interviewStore.selectedQuestions;
          const questionIds = selectedQuestions.map(question => question);
          try {
            const fetchedQuestions = await getInterviewQuestions(questionIds);
            setInterviewType(interviewType);
            setQuestions(fetchedQuestions);
          } catch (error) {
            console.error("Failed to fetch questions:", error);
          }
        } else {
          setInterviewType(interviewType);
          setQuestions(interviewStore.realQuestions.resumeQuestions);
        }
      }
    };
  
    fetchInterviewData();
    if (status || questions.length > 0) {
      console.log("Status or questions changed:", { status, questionsLength: questions.length });
    }
  }, [router.isReady]);

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const tryGetMedia = async () => {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(videoStream);
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
        }
      } catch (err) {
        console.error("미디어 접근 에러:", err);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryGetMedia, 1000);
        }
      }
    };
    
    if (!stream) {
      tryGetMedia();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (isRecording) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioData = () => {
        analyser.getByteFrequencyData(dataArray);
        setAudioData([...dataArray]);
        if (isRecording) {
          requestAnimationFrame(updateAudioData);
        }
      };

      updateAudioData();
    }
  }, [isRecording, stream]);

  const startRecording = useCallback(() => {
    if (!stream) {
      console.error('Stream is not available');
      return;
    }
  
    setRecordedChunks([]);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        console.log('Received data chunk:', event.data);
        setRecordedChunks((prev) => [...prev, event.data]);
      } else {
        console.error('No data available');
      }
    };
  
    mediaRecorder.start(1000);
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setTimeLeft(60);
    setShowStartButton(false);
  }, [stream]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("Recording stopped");
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setTimeout(() => {
        setIsSubmitEnabled(true);
      }, 10000);
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

  // const handleStartAnswer = useCallback(() => {
  //   let countdown = 3;
  //   setShowModal(true);
    
  //   const countdownInterval = setInterval(() => {
  //     setCountdownTime(countdown);
  //     countdown -= 1;
  //     if (countdown < 0) {
  //       clearInterval(countdownInterval);
  //       setShowModal(false);
  //       dispatch(setStatus('recording'));
  //       startRecording();
  //       setRecordingStartTime(Date.now());
  //       if (questions[currentQuestionIndex]?.question) {
  //         speakQuestion(questions[currentQuestionIndex].question);
  //       }
  //     }
  //   }, 1000);
  // }, [dispatch, startRecording, speakQuestion, questions, currentQuestionIndex]);

  const handleStartAnswer = useCallback(() => {
    const initialCountdown = 3;
    let countdown = initialCountdown;
    setShowModal(true);
    setCountdownTime(initialCountdown);
    
    const countdownInterval = setInterval(() => {
      countdown -= 1;
      setCountdownTime(countdown);
      if (countdown <= 0) {
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

  const handleSubmitAnswer = useCallback(() => {
    if (recordingStartTime && (Date.now() - recordingStartTime) < 10000) {
      alert("녹화 시간이 너무 짧습니다. 최소 10초 이상 녹화해야 합니다.");
      return;
    }
    const currentTime = Date.now();
    if (recordingStartTime && currentTime - recordingStartTime < 10000) {
      setWarningAnchorEl(event.currentTarget);
      setShowWarning(true);
    } else {
      stopRecording();
      dispatch(setStatus('uploading'));
      setIsSubmitting(true);

      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      console.log("블롭 사이즈: ", blob.size);
      const formData = new FormData();
      formData.append('video', blob, 'interview.mp4');
      formData.append('userId', userStore.id);
      formData.append('questionId', questions[currentQuestionIndex].id);
      console.log('이거 확인: ', formData.get('video'));

      uploadInterviewVideo(formData)
        .then(response => {
          console.log('Video uploaded successfully', response);
          dispatch(setInterviewData({
            questionIndex: currentQuestionIndex,
            videoId: response.videoId
          }));
        })
        .catch(error => {
          console.error('Error uploading video:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            dispatch(setStatus('pending'));
            setTimeLeft(60);
            setShowStartButton(true);
            setRecordedChunks([]);
            setIsRecording(false);
          } else {
            dispatch(setStatus('ending'));
          }
        });
    }  
  }, [dispatch, stopRecording, currentQuestionIndex, questions, recordingStartTime, recordedChunks, userStore.id]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      dispatch(setStatus('pending'));
      setTimeLeft(60);
      setShowStartButton(true);
      setRecordedChunks([]);
      setIsRecording(false);
    } else {
      dispatch(setStatus('ending'));
      router.push('/interview/interviewResultList');
    }
  }, [currentQuestionIndex, questions.length, dispatch, router]);

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

  const handleHintRequest = useCallback(() => {
    setShowScript((prev) => !prev);
  }, []);

  const handleGuideClose = () => setShowGuide(false);

  if (!interviewType) {
    return <div>Loading...</div>;
  }

  // Stepper 컴포넌트
  const InterviewStepper = () => (
    <Stepper activeStep={currentQuestionIndex} alternativeLabel>
      {questions.map((_, index) => (
        <Step key={index}>
          <StepLabel>{`질문 ${index + 1}`}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );

  // 원형 타이머 컴포넌트
  const CircularTimer = ({ timeLeft }) => (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={(timeLeft / 60) * 100}
        size={120}
        thickness={4}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" component="div" color="textSecondary">
          {timeLeft}
        </Typography>
      </Box>
    </Box>
  );

  //  오디오 시각화 컴포넌트
  const AudioVisualizer = ({ audioData }) => (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="flex-end" 
      height={180} // 높이를 늘려 더 많은 공간 확보
      width="100%" // 전체 너비 사용
    >
      {audioData.map((value, index) => (
        <div
          key={index}
          style={{
            width: `${100 / audioData.length}%`, // 너비를 균등하게 분배
            height: `${value / 2}px`,
            backgroundColor: '#1976d2',
            margin: '0 1px', // 바 사이에 작은 간격 추가
            transition: 'height 0.1s ease', // 부드러운 높이 변화
          }}
        />
      ))}
    </Box>
  );

return (
  <Container maxWidth="lg" className={styles.container}>
    <Typography variant="h4" component="h1" gutterBottom align="center" className={styles.title}>
       AI {interviewType === 'mock' ? '모의 면접' : '실전 면접'}
    </Typography>
    
    <InterviewStepper />
    
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
          <Card elevation={3} className={styles.videoCard}>
            <CardContent>
              <Box className={styles.videoSection}>
                <video ref={videoRef} autoPlay muted className={styles.video} />
                {isRecording && (
                  <Box className={styles.recordingIndicator}>
                    REC
                  </Box>
                )}
                <Box className={styles.questionOverlay}>
                  <Typography variant="h6">
                    Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex]?.questionText}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Box className={styles.controlsSection}>
            <Tooltip title="힌트 요청">
              <IconButton onClick={handleHintRequest} className={styles.controlButton}>
                <Help />
              </IconButton>
            </Tooltip>
            <Tooltip title="질문 다시 듣기">
              <IconButton onClick={() => speakText(questions[currentQuestionIndex]?.questionText)} className={styles.controlButton}>
                <VolumeUp />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Fade in={showScript}>
            <Paper elevation={3} className={styles.scriptSection}>
              <Typography variant="h6" gutterBottom>스크립트 및 키워드</Typography>
              <Typography variant="body2">
                {questions[currentQuestionIndex]?.script}
              </Typography>
              <Typography variant="body2" className={styles.keywords}>
                키워드: {typeof questions[currentQuestionIndex]?.keywords === 'string' 
                  ? questions[currentQuestionIndex].keywords 
                  : questions[currentQuestionIndex]?.keywords?.join(', ')}
              </Typography>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={styles.timerCard}>
            <CardContent>
              <Box className={styles.timerBox}>
                <CircularTimer timeLeft={timeLeft} />
              </Box>
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
                  disabled={!isSubmitEnabled}
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
          
          <Paper elevation={4} className={styles.feedbackSection} sx={{ height: 250 }}>
            <Typography variant="h6" gutterBottom>오디오 시각화</Typography>
            <AudioVisualizer audioData={audioData} />
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
});

export default InterviewRecordPage;