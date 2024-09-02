import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Slider, Card, CardContent, LinearProgress } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';

const BotMusicPlayer = ({ playlist, onStop, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(new Audio(playlist[currentTrack]));

  useEffect(() => {
    audioRef.current.src = playlist[currentTrack];
    if (isPlaying) audioRef.current.play();
    setDuration(audioRef.current.duration);
  }, [currentTrack, playlist]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', () => {});
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    onStop();
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    onNext();
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    onPrevious();
  };

  const handleSeek = (event, newValue) => {
    const time = (newValue / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(newValue);
  };

  return (
    <Card sx={{ maxWidth: 330, m: 'auto', boxShadow: 10, borderRadius: 4, overflow: 'hidden' }}>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 2 }} />
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          focusjob Music Player
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap mb={2}>
          {playlist[currentTrack].split('/').pop()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <IconButton onClick={handlePrevious} size="small">
            <SkipPreviousRoundedIcon />
          </IconButton>
          <IconButton onClick={isPlaying ? handlePause : handlePlay} color="primary" sx={{ mx: 1 }}>
            {isPlaying ? <PauseRoundedIcon fontSize="large" /> : <PlayArrowRoundedIcon fontSize="large" />}
          </IconButton>
          <IconButton onClick={handleStop} size="small" sx={{ mx: 1 }}>
            <StopRoundedIcon />
          </IconButton>
          <IconButton onClick={handleNext} size="small">
            <SkipNextRoundedIcon />
          </IconButton>
        </Box>
        <Slider
          value={progress}
          onChange={handleSeek}
          aria-labelledby="continuous-slider"
          sx={{ color: 'primary.main' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BotMusicPlayer;