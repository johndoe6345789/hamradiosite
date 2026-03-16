'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TimerIcon from '@mui/icons-material/Timer';
import useCountdown from '@/hooks/useCountdown';

interface QuizTimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
}

export default function QuizTimer({ timeRemaining, onTimeUp }: QuizTimerProps) {
  const t = useTranslations('quiz');
  const { formatted, isLowTime } = useCountdown(timeRemaining, onTimeUp);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 2, bgcolor: isLowTime ? 'error.50' : 'action.hover', border: 1, borderColor: isLowTime ? 'error.main' : 'divider' }}>
      <TimerIcon fontSize="small" color={isLowTime ? 'error' : 'action'} />
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>{t('timeRemaining')}</Typography>
        <Typography variant="subtitle1" fontWeight={700} color={isLowTime ? 'error.main' : 'text.primary'} lineHeight={1.2} role="timer">{formatted}</Typography>
      </Box>
    </Box>
  );
}
