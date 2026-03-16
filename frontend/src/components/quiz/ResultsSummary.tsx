'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Link } from '@/i18n/navigation';
import ScoreCircle from './ScoreCircle';

interface ResultsSummaryProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  quizTitle: string;
}

export default function ResultsSummary({ score, correctCount, totalQuestions, passed, quizTitle }: ResultsSummaryProps) {
  const t = useTranslations('quiz');
  const bg = passed ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';

  return (
    <Card sx={{ textAlign: 'center', background: bg }}>
      <CardContent sx={{ py: 5, px: 4 }}>
        <Box sx={{ mb: 3 }}>
          {passed ? <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} /> : <HighlightOffIcon sx={{ fontSize: 80, color: 'error.main' }} />}
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>{passed ? t('passed') : t('failed')}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>{quizTitle}</Typography>
        <ScoreCircle score={score} passed={passed} />
        <Typography variant="body1" sx={{ mb: 1 }}>{correctCount} / {totalQuestions} correct</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {passed ? t('passMessage', { score: String(score) }) : t('failMessage', { score: String(score) })}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={Link} href="/quiz" variant="outlined">{t('backToQuizzes')}</Button>
          <Button component={Link} href="/quiz" variant="contained">{t('retryQuiz')}</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
