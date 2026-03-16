'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizResults } from '@/store/slices/quizSlice';
import ResultsSummary from '@/components/quiz/ResultsSummary';
import ReviewQuestionCard from '@/components/quiz/ReviewQuestionCard';

export default function QuizResultsPage() {
  const t = useTranslations('quiz');
  const params = useParams<{ attemptId: string }>();
  const dispatch = useAppDispatch();
  const { result, loading } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (!result && params.attemptId) dispatch(fetchQuizResults(params.attemptId));
  }, [dispatch, result, params.attemptId]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" textAlign="center" color="text.secondary">No quiz results available. Please complete a quiz first.</Typography>
      </Container>
    );
  }

  const scorePercent = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ResultsSummary score={scorePercent} correctCount={result.score} totalQuestions={result.total} passed={result.passed} quizTitle={result.quizId} />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('reviewAnswers')}</Typography>
      {result.questions.map((question, index) => (
        <ReviewQuestionCard
          key={question.id}
          question={question}
          questionNumber={index + 1}
          userAnswerId={result.answers[question.id]}
          correctLabel={t('correct')}
          incorrectLabel={t('incorrect')}
          yourAnswerLabel={t('yourAnswer')}
          correctAnswerLabel={t('correctAnswer')}
          explanationLabel={t('explanation')}
        />
      ))}
    </Container>
  );
}
