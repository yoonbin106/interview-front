import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system'; // Import keyframes from MUI system

// Define a pulsing animation using MUI's keyframes
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="40%" mr={3}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={2}>
          <Typography
            variant="body1"
            color="primary"
            sx={{
              animation: `${pulse} 1.5s infinite ease-in-out`,
            }}
          >
            Loading...
          </Typography>
        </Box>
      </Box>
  );
}

export default LinearProgressWithLabel;
