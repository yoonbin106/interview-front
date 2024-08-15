import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { 
  Container, Typography, Grid, Button, Paper, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, List, ListItem,
  ListItemIcon, ListItemText, Fade, Stepper, Step, StepLabel,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import {
  setCameraReady, setMicReady, setStream, setCountdown, setCurrentStep,
  setAudioLevel, setAllReady, setButtonActive,setInterviewData
} from '@/redux/slices/interviewSlice';
import styles from '@/styles/interview/InterviewPreparation.module.css';

const InterviewPreparation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [interviewType, setInterviewType] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      const { interviewType } = router.query;
      setInterviewType(interviewType);
    }
  }, [router.isReady, router.query]);
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    cameraReady,
    micReady,
    stream,
    countdown,
    currentStep,
    highContrast,
    audioLevel,
    allReady,
    buttonActive,
  } = useSelector(state => state.interview);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

   // 카메라와 마이크 준비 상태 체크
  useEffect(() => {
    if (cameraReady && micReady) {
      dispatch(setAllReady(true));
      dispatch(setCurrentStep(3));
      dispatch(setCountdown(5));
    } else {
      dispatch(setAllReady(false));
      dispatch(setButtonActive(false));
    }
  }, [cameraReady, micReady, dispatch]);

  // 카운트다운 관리
  useEffect(() => {
    let timer;
    if (allReady && countdown > 0) {
      timer = setInterval(() => {
        dispatch(setCountdown(countdown - 1));
      }, 1000);
    } else if (allReady && countdown === 0) {
      dispatch(setButtonActive(true));
    }
  
    return () => clearInterval(timer);
  }, [allReady, countdown, dispatch]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraReady]);

  useEffect(() => {
    return () => {
      stopStream();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    dispatch(setStream(null));
  }, [stream, dispatch]);

  const checkCamera = async () => {
    try {
      if (stream) {
        stopStream();
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      dispatch(setStream(mediaStream));
      dispatch(setCameraReady(true));
    } catch (error) {
      console.error("카메라 접근 에러:", error);
      dispatch(setCameraReady(false));
    }
  };

  const checkMic = async () => {
    try {
      if (audioContextRef.current) {
        stopStream();
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
        dispatch(setAudioLevel(average / 128));
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
  
      dispatch(setMicReady(true));
    } catch (error) {
      console.error("마이크 접근 에러:", error);
      dispatch(setMicReady(false));
    }
  };
   // 리셋 핸들러
  const handleReset = () => {
    stopStream();
    dispatch(setStream(null));
    dispatch(setCameraReady(false));
    dispatch(setMicReady(false));
    dispatch(setCountdown(5));
    dispatch(setCurrentStep(1));
    dispatch(setAudioLevel(0));
    dispatch(setAllReady(false));
    dispatch(setButtonActive(false));
  };
  // 완료 핸들러
  const handleComplete = () => {
    setModalOpen(true);
  };
   // 모달 확인 핸들러
  const handleConfirm = () => {
    setModalOpen(false);
    const mockQuestions = [
      "자신의 강점과 약점에 대해 말해주세요.",
      "왜 우리 회사에 지원하셨나요?",
      "5년 후 자신의 모습을 어떻게 그리고 계신가요?",
      "팀 프로젝트에서 갈등 상황을 어떻게 해결하셨나요?",
      "최근에 배운 새로운 기술이나 지식이 있다면 무엇인가요?"
    ];
    if (interviewType === 'mock') {
      router.push({
        pathname: '/interview/interviewQuestionsPage',
        query: { interviewType, mockQuestions: JSON.stringify(mockQuestions) }
      });
    } else {
      router.push({
        pathname: '/interview/interviewRecordPage',
        query: { interviewType, mockQuestions: JSON.stringify(mockQuestions) }
      });
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  // 스텝 정의
  const steps = [
    { label: '웹캠/마이크 세팅 점검', icon: <SettingsIcon /> },
    { label: '연결중', icon: <CastConnectedIcon /> },
    { label: '면접 응시', icon: <VideoCallIcon /> },
  ];

  const interviewTips = [
    "면접 전 회사에 대해 충분히 조사하세요.",
    "질문에 대한 답변을 간결하고 명확하게 준비하세요.",
    "적절한 비즈니스 복장을 착용하시고, 긍정적이고 열정적인 태도를 보여주세요."
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
    <Fade in={true} timeout={1000}>
      <Paper className={styles.paper}>
        <Typography variant="h4" align="center" className={styles.title}>
           AI 면접 응시환경 체크
        </Typography>
        <Stepper activeStep={currentStep - 1} alternativeLabel className={styles.stepper}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <div className={`${styles.stepIcon} ${currentStep > index ? styles.activeStepIcon : ''}`}>
                    {step.icon}
                  </div>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box className={styles.preparationSection}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={`${styles.section} ${cameraReady ? styles.sectionReady : ''}`}>
              <Box className={styles.icon}>
                <CameraAltIcon fontSize="inherit" />
              </Box>
              <Typography variant="h6">얼굴 인식</Typography>
              <Button
                className={styles.button}
                variant="contained"
                color={cameraReady ? "success" : "primary"}
                onClick={checkCamera}
                disabled={cameraReady}
              >
                {cameraReady ? 'OK' : '확인하기'}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={`${styles.section} ${micReady ? styles.sectionReady : ''}`}>
              <Box className={styles.icon}>
                <MicIcon fontSize="inherit" />
              </Box>
              <Typography variant="h6">음성 인식</Typography>
              <Button
                className={styles.button}
                variant="contained"
                color={micReady ? "success" : "primary"}
                onClick={checkMic}
                disabled={micReady}
              >
                {micReady ? 'OK' : '확인하기'}
              </Button>
              {micReady && (
                <Box className={styles.audioMeter}>
                  <Box
                    className={styles.audioLevel}
                    style={{ height: `${audioLevel * 100}%` }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={styles.section}>
              <Typography variant="h6">화면 미리보기</Typography>
              <Box className={styles.videoContainer}>
                {cameraReady ? (
                  <video ref={videoRef} autoPlay muted className={styles.video}/>
                ) : (
                  <Typography>카메라를 활성화해주세요</Typography>
                )}
              </Box>
              <Box className={styles.countdownContainer}>
                <Box
                  className={styles.countdownProgress}
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </Box>
              <Typography variant="body2" className={styles.countdownText}>
                {allReady 
                  ? countdown > 0 
                    ? `세팅 ${countdown}초 전` 
                    : "면접 준비 완료"
                  : "면접 환경 확인"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        </Box>
        <Paper elevation={3} className={styles.tipSection}>
            <Typography variant="h6" className={styles.tipTitle}><TipsAndUpdatesIcon color="primary" fontSize="large"/> 
              면접 Tip
              </Typography>
            <List>
              {interviewTips.map((tip, index) => (
                <ListItem key={index} className={styles.tipContent}>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Paper>
        <Box className={styles.buttonContainer}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
            startIcon={<RestartAltIcon />}
          >
            웹캠/마이크 다시 체크
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleComplete}
            disabled={!buttonActive || countdown > 0}
          >
            {buttonActive && countdown === 0 ? "면접 시작하기" : `${countdown}초 후 시작`}
          </Button>
        </Box>
      </Paper>
    </Fade>
      
<Dialog
  open={isModalOpen}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  PaperProps={{
    style: {
      borderRadius: '16px',
      padding: '24px',
      width: '500px',  // 모달 창 너비 증가
      maxWidth: '90vw' // 모바일 화면 고려
    }
  }}
>
  <DialogTitle id="alert-dialog-title" className={styles.modalTitle}>
    <Typography variant="h5" component="span">
      면접 시작 준비
    </Typography>
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description" className={styles.modalContent}>
      <Typography variant="body1">
        모든 준비가 완료되었습니다. 면접을 시작하시겠습니까?
      </Typography>
      <Box className={styles.modalTips}>
        <Typography variant="subtitle2" gutterBottom>
          면접 시작 전 체크리스트:
        </Typography>
        <ul>
          <li>카메라와 마이크가 정상 작동하는지 확인하세요.</li>
          <li>주변 소음이 없는 조용한 환경인지 확인하세요.</li>
          <li>긍정적인 마인드로 자신감 있게 임하세요!</li>
        </ul>
      </Box>
    </DialogContentText>
  </DialogContent>
  <DialogActions className={styles.modalActions}>
    <Button onClick={handleClose} color="primary" startIcon={<CancelIcon />} className={styles.cancelButton}>
      취소
    </Button>
    <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus startIcon={<PlayArrowIcon />} className={styles.confirmButton}>
      면접 시작
    </Button>
  </DialogActions>
</Dialog>
    </Container>
  );
};

export default InterviewPreparation;