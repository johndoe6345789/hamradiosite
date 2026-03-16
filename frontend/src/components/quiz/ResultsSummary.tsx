'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Link } from '@/i18n/navigation';

interface ResultsSummaryProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  quizTitle: string;
}

export default function ResultsSummary({
  score,
  correctCount,
  totalQuestions,
  passed,
  quizTitle,
}: ResultsSummaryProps) {
  const t = useTranslations('quiz');

  return (
    <Card
      sx={{
        textAlign: 'center',
        background: passed
          ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
          : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
      }}
    >
      <CardContent sx={{ py: 5, px: 4 }}>
        <Box sx={{ mb: 3 }}>
          {passed ? (
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
          ) : (
            <HighlightOffIcon sx={{ fontSize: 80, color: 'error.main' }} />
          )}
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          {passed ? t('passed') : t('failed')}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {quizTitle}
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-flex', my: 3 }}>
          <CircularProgress
            variant="determinate"
            value={score}
            size={120}
            thickness={6}
            color={passed ? 'success' : 'error'}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {score}%
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          {correctCount} / {totalQuestions} correct
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {passed
            ? t('passMessage', { score: String(score) })
            : t('failMessage', { score: String(score) })}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={Link} href="/quiz" variant="outlined">
            {t('backToQuizzes')}
          </Button>
          <Button component={Link} href="/quiz" variant="contained">
            {t('retryQuiz')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
