'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizResults } from '@/store/slices/quizSlice';
import ResultsSummary from '@/components/quiz/ResultsSummary';

export default function QuizResultsPage() {
  const t = useTranslations('quiz');
  const params = useParams<{ attemptId: string }>();
  const dispatch = useAppDispatch();
  const { result, loading } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (!result && params.attemptId) {
      dispatch(fetchQuizResults(params.attemptId));
    }
  }, [dispatch, result, params.attemptId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" textAlign="center" color="text.secondary">
          No quiz results available. Please complete a quiz first.
        </Typography>
      </Container>
    );
  }

  const scorePercent =
    result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ResultsSummary
        score={scorePercent}
        correctCount={result.score}
        totalQuestions={result.total}
        passed={result.passed}
        quizTitle={result.quizId}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
        {t('reviewAnswers')}
      </Typography>

      {result.questions.map((question, index) => {
        const userAnswer = result.answers[question.id];
        const isCorrect = userAnswer === question.correctOptionId;
        const userOption = question.options.find((o) => o.id === userAnswer);
        const correctOption = question.options.find(
          (o) => o.id === question.correctOptionId
        );

        return (
          <Card key={question.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {isCorrect ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
                <Typography variant="subtitle1" fontWeight={600}>
                  Question {index + 1}
                </Typography>
                <Chip
                  label={isCorrect ? t('correct') : t('incorrect')}
                  color={isCorrect ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {question.text}
              </Typography>

              {!isCorrect && userOption && (
                <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                  {t('yourAnswer')}: {userOption.text}
                </Typography>
              )}

              {correctOption && (
                <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                  {t('correctAnswer')}: {correctOption.text}
                </Typography>
              )}

              <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  {t('explanation')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {question.explanation}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}
