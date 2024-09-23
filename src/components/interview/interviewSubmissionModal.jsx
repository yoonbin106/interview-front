import React, { useState, useEffect } from 'react';
import { Typography, Box, Modal, CircularProgress } from '@mui/material';
import Image from 'next/image';
import styles from '@/styles/interview/interviewRecordPage.module.css';

const InterviewSubmissionModal = ({ isSubmitting, onSubmissionComplete }) => {
  const [showGif, setShowGif] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    let timer;
    if (isSubmitting) {
      setShowGif(true);
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            setShowGif(false);
            onSubmissionComplete();
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitting, onSubmissionComplete]);

  useEffect(() => {
    if (isSubmitting) {
      const utterance = new SpeechSynthesisUtterance("면접 답변을 제출하여 영상 분석중입니다. 잠시만 기다려주세요.");
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  }, [isSubmitting]);

  return (
    <Modal open={isSubmitting}>
      <Box className={styles.modal}>
        <Typography id="modal-title" variant="h6" component="h2">
          답변을 제출중입니다 (남은 시간: {countdown}초)
        </Typography>
        {showGif ? (
          <Image
            src="/images/videoAnalytics.gif"
            alt="Analyzing"
            width={500}
            height={500}
            unoptimized
          />
        ) : (
          <CircularProgress className={styles.modalProgress} />
        )}
      </Box>
    </Modal>
  );
};

export default InterviewSubmissionModal;