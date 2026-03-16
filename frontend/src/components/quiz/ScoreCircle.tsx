'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface ScoreCircleProps {
  score: number;
  passed: boolean;
}

export default function ScoreCircle({ score, passed }: ScoreCircleProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', my: 3 }}>
      <CircularProgress variant="determinate" value={score} size={120} thickness={6} color={passed ? 'success' : 'error'} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" fontWeight={700}>{score}%</Typography>
      </Box>
    </Box>
  );
}
