import React, { useState } from 'react';
import { Box, SpeedDial as MuiSpeedDial, SpeedDialAction, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { BsChatHeart, BsChatHeartFill } from "react-icons/bs";
import { IoLogoSnapchat } from "react-icons/io5";
import styles from '@/styles/bot/bot.module.css';
import { useChat } from '@/contexts/chatContext';
import { useChatRoom } from '@/contexts/chatRoomContext';
import Chatting from 'pages/chat/chatting';
import Bot from '@/pages/bot/bot';
import Image from 'next/image';
import { RiCameraLensFill } from 'react-icons/ri';

const SpeedDial = () => {
  const [open, setOpen] = useState(false);

  const { alarmChatroomId, alarmUserId, isChatOpen, setIsChatOpen } = useChatRoom();
  // const [isChatOpen, setIsChatOpen] = useState(false);

  const [isBotOpen, setIsBotOpen] = useState(false);
  const { openBot, closeBot } = useChat();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBotClick = () => {
    if (isBotOpen) {
      closeBot();
    } else {
      openBot();
    }
    setIsBotOpen(!isBotOpen);
    handleClose();
  };

  const handleChattingClick = () => {
    setIsChatOpen(!isChatOpen);
    handleClose();
  };

  const closeChatting = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <div className={styles.atbotWrapper}>
          <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
          <MuiSpeedDial
            ariaLabel="SpeedDial menu"
            sx={{
              position: 'fixed',
              bottom: '15px',
              right: '15px',
              '& .MuiSpeedDial-fab': {
                bgcolor: '#5A8AF2',
                '&:hover': {
                  bgcolor: '#2F72E3',
                },
                width: '100px',
                height: '100px',
              },
              '& .MuiSpeedDialIcon-icon': {
                animation: 'none',
                '&:hover': {
                  bgcolor: '#5A8AF2',
                },
              },
            }}
            icon={<RiCameraLensFill size={80} color="white" />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={isMobile ? 'up' : 'left'}
            >
            <SpeedDialAction
              key='Chatting'
              icon={
                <div className={isChatOpen ? styles.blinking : ''}>
                  <BsChatHeartFill size={60} color={isChatOpen ? '#FF0000' :'#5A8AF2'}/>
                </div>
              }
              tooltipTitle={isChatOpen ? "Chatting (Open)" : "Chatting"}
              onClick={handleChattingClick}
              slotProps={{
                tooltip:{
                  sx: {                
                      fontSize: '1rem ', // 원하는 글씨 크기로 조절
                      padding: '10px 10px', // 패딩 조절 (선택사항)                
                  }
                }
              }}
              sx={{
                bgcolor: isBotOpen ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
                width: '80px', // 원하는 너비
                height: '80px', // 원하는 높이
                '& .MuiSpeedDialAction-fab': {
                  width: '100%',
                  height: '100%',
                },
              }}
            />
            <SpeedDialAction
              key='ChatBot'
              icon={
                <div className={isBotOpen ? styles.blinking : ''}>
                  <IoLogoSnapchat size={60} color={isBotOpen ? '#FF0000' : '#5A8AF2'} />
                </div>
              }
              tooltipTitle={isBotOpen ? "ChatBot (Open)" : "ChatBot"}
              onClick={handleBotClick}
              slotProps={{
                tooltip:{
                  sx: {                
                      fontSize: '1rem ', // 원하는 글씨 크기로 조절
                      padding: '10px 10px', // 패딩 조절 (선택사항)                
                  }
                }
              }}
              sx={{
                bgcolor: isBotOpen ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
                width: '80px', // 원하는 너비
                height: '80px', // 원하는 높이
                '& .MuiSpeedDialAction-fab': {
                  width: '100%',
                  height: '100%',
                },
              }}
            />
          </MuiSpeedDial>
        </Box>
      </div>
      <div className={styles.chatContainers}>
      {isChatOpen && <Chatting closeChatting={() => setIsChatOpen(false)} alarmChatroomId={alarmChatroomId} alarmUserId={alarmUserId}/>}
        {isBotOpen && <Bot onClose={() => setIsBotOpen(false)} />}
      </div>
    </>
  );
};

export default SpeedDial;