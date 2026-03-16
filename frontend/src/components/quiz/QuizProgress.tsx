'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface QuizProgressProps {
  current: number;
  total: number;
  answered: number;
}

export default function QuizProgress({ current, total, answered }: QuizProgressProps) {
  const t = useTranslations('quiz');
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {t('questionOf', { current, total })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('questionsAnswered', { answered, total })}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
}
