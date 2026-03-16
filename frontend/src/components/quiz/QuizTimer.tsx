'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TimerIcon from '@mui/icons-material/Timer';

interface QuizTimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
}

export default function QuizTimer({ timeRemaining: initialTime, onTimeUp }: QuizTimerProps) {
  const t = useTranslations('quiz');
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isLowTime = secondsLeft < 300;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: isLowTime ? 'error.50' : 'action.hover',
        border: 1,
        borderColor: isLowTime ? 'error.main' : 'divider',
      }}
    >
      <TimerIcon
        fontSize="small"
        color={isLowTime ? 'error' : 'action'}
      />
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          lineHeight={1}
        >
          {t('timeRemaining')}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color={isLowTime ? 'error.main' : 'text.primary'}
          lineHeight={1.2}
          role="timer"
        >
          {formattedTime}
        </Typography>
      </Box>
    </Box>
  );
}
