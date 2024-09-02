import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

const TextToSpeech = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    
    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else {
      synth.speak(utterance);
    }

    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <Tooltip title={isPlaying ? "Pause" : "Speak"}>
        <IconButton 
          onClick={isPlaying ? handlePause : handlePlay} 
          color="primary"
          size="small"
        >
          Voice {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Stop">
        <IconButton 
          onClick={handleStop} 
          color="error"
          size="small"
        >
          <StopRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TextToSpeech;