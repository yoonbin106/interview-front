import React, { useState } from 'react';
import { Box, SpeedDial as MuiSpeedDial, SpeedDialAction } from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Headset from '@mui/icons-material/Headset';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { HiLightBulb } from 'react-icons/hi';
import styles from '@/styles/bot/bot.module.css';
import { useChat } from '@/contexts/chatContext';
import Chatting from 'pages/chat/chatting';

const SpeedDial = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { openBot } = useChat();

  const handleBotClick = () => {
    openBot();
    setShowTooltip(false);
  };

  const handleChattingClick = () => {
    setIsChatOpen(true);
    console.log('Chatting clicked');
  };

  const closeChatting = () => {
    console.log('닫기 ~');
    setIsChatOpen(false); // 채팅 팝업을 닫기
  };

  return (
    <div className={`${styles.atbotWrapper}`}>
      <div className={styles.botInactive}>
        <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
          <MuiSpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              key='ChatBot'
              icon={<Headset />}
              tooltipTitle="ChatBot"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={handleBotClick}
            />
            <SpeedDialAction
              key='Chatting'
              icon={<ChatBubbleOutlineIcon />}
              tooltipTitle="Chatting"
              onClick={handleChattingClick}
            />
          </MuiSpeedDial>
        </Box>
        {showTooltip && (
          <div className={styles.botTooltip}>
            <HiLightBulb className={styles.tooltipIcon} />
            <span className={styles.tooltipText}>Tip:</span> 궁금하신 점이 있으면 버튼을 클릭해주세요!
            <div className={styles.tooltipSubtext}>VIP 챗봇이 친절히 답변해 드립니다.</div>
          </div>
        )}
        {isChatOpen && <Chatting closeChatting={closeChatting} />}
      </div>
    </div>
  );
};

export default SpeedDial;