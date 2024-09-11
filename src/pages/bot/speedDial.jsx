import React, { useState } from 'react';
import { Box, SpeedDial as MuiSpeedDial, SpeedDialAction, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { BsChatHeart, BsChatHeartFill } from "react-icons/bs";
import { IoLogoSnapchat } from "react-icons/io5";
import styles from '@/styles/bot/bot.module.css';
import { useChat } from '@/contexts/chatContext';
import Chatting from 'pages/chat/chatting';
import Bot from '@/pages/bot/bot';
import { FaDoorOpen } from 'react-icons/fa6';

const SpeedDial = () => {
  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const { openBot, closeBot } = useChat();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBotClick = () => {
    if (isBotOpen) {
      closeBot(); // 챗봇 컨텍스트의 closeBot 함수 호출
      setIsBotOpen(false);
    } else {
      openBot();
      setIsBotOpen(true);
    }
    handleClose();
  };

  const handleChattingClick = () => {
    setIsChatOpen(!isChatOpen);
    handleClose();
  };

  return (
    <>
      <div className={styles.atbotWrapper}>
        <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
          <MuiSpeedDial 
            ariaLabel="SpeedDial menu"
            sx={{
              position: 'fixed',
              bottom: '12px',
              right: '12px',
              '& .MuiSpeedDial-fab': {
                bgcolor: '#5A8AF2',
                '&:hover': {
                  bgcolor: '#4A7AD2',
                },
              },
            }}
            icon={<SpeedDialIcon openIcon={<FaDoorOpen size={25} color="red" fontSize="large" />} />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={isMobile ? "up" : "left"}
          >
            <SpeedDialAction
              key='Chatting'
              icon={
                  <div className={isChatOpen ? styles.blinking : ''}>
                    {isChatOpen ? <BsChatHeart size={30} color='#FF0000'/> : <BsChatHeart size={30} color='#5A8AF2'/>}
                  </div>
              }
              tooltipTitle={isChatOpen ? "Chatting (Open)" : "Chatting"}
              onClick={handleChattingClick}
              sx={{
                bgcolor: isChatOpen ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
              }}
            />
            <SpeedDialAction
              key='ChatBot'
              icon={
                <div className={isBotOpen ? styles.blinking : ''}>
                  <IoLogoSnapchat size={30} color={isBotOpen ? '#FF0000' : '#5A8AF2'} />
                </div>
              }
              tooltipTitle={isBotOpen ? "ChatBot (Open)" : "ChatBot"}
              onClick={handleBotClick}
              sx={{
                bgcolor: isBotOpen ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
              }}
            />
            
          </MuiSpeedDial>
        </Box>
      </div>
      <div className={styles.chatContainers}>
        {isChatOpen && <Chatting onClose={() => setIsChatOpen(false)} />}
        {isBotOpen && <Bot onClose={() => setIsBotOpen(false)} />}
      </div>
    </>
  );
};

export default SpeedDial;