import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Fade
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from '@/styles/interview/interviewOption.module.css';

const InterviewOption = ({ title, imageSrc, features, buttonText, onStart }) => (
  <Fade in={true} timeout={1000}>
    <Card className={styles.interviewCard} elevation={3}>
      <div className={styles.imageContainer}>
        <div 
          className={styles.interviewImage}
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" align="center" className={styles.interviewTitle}>
          {title}
        </Typography>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} disablePadding className={styles.featureItem}>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={feature} 
                primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Box p={2}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          size="large"
          onClick={onStart}
          className={styles.startButton}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  </Fade>
);

export default InterviewOption;