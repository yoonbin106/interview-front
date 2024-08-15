import React from 'react';
import { Button, Box } from '@mui/material';
import styles from '@/styles/interview/tabButtons.module.css';

const TabButtons = ({ activeTab, handleTabChange }) => (
  <Box className={styles.tabButtonsContainer}>
    <Button 
      fullWidth
      variant={activeTab === 'common' ? "contained" : "outlined"}
      onClick={() => handleTabChange('common')}
      className={`${styles.tabButton} ${activeTab === 'common' ? styles.activeTab : ''}`}
    >
      공통 면접 질문
    </Button>
    <Button 
      fullWidth
      variant={activeTab === 'resume' ? "contained" : "outlined"}
      onClick={() => handleTabChange('resume')}
      className={`${styles.tabButton} ${activeTab === 'resume' ? styles.activeTab : ''}`}
    >
      이력서 기반 질문
    </Button>
  </Box>
);

export default TabButtons;