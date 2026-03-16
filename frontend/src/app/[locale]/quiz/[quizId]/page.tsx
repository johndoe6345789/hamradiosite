'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setAnswer,
  nextQuestion,
  previousQuestion,
  startQuiz,
} from '@/store/slices/quizSlice';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizTimer from '@/components/quiz/QuizTimer';
import { useRouter } from '@/i18n/navigation';

export default function ActiveQuizPage() {
  const t = useTranslations('quiz');
  const params = useParams<{ quizId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { activeQuiz, loading } = useAppSelector((state) => state.quiz);

  const handleStartQuiz = useCallback(() => {
    const isMockExam = params.quizId === 'mock-exam';
    dispatch(
      startQuiz({
        type: isMockExam ? 'mock' : 'topic',
        topicSlug: isMockExam ? undefined : params.quizId.replace('topic-', ''),
      })
    );
  }, [dispatch, params.quizId]);

  const handleSelectAnswer = useCallback(
    (optionId: string) => {
      if (activeQuiz) {
        const currentQuestion = activeQuiz.questions[activeQuiz.currentIndex];
        if (currentQuestion) {
          dispatch(setAnswer({ questionId: currentQuestion.id, optionId }));
        }
      }
    },
    [dispatch, activeQuiz]
  );

  const handleSubmit = useCallback(() => {
    if (activeQuiz) {
      router.push(`/quiz/results/${activeQuiz.quizId}`);
    }
  }, [router, activeQuiz]);

  const handleTimeUp = useCallback(() => {
    if (activeQuiz) {
      router.push(`/quiz/results/${activeQuiz.quizId}`);
    }
  }, [router, activeQuiz]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!activeQuiz) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {params.quizId === 'mock-exam' ? t('mockExamTitle') : t('topicQuiz')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {params.quizId === 'mock-exam'
            ? t('mockExamDescription')
            : t('topicQuizDescription')}
        </Typography>
        <Button variant="contained" size="large" onClick={handleStartQuiz}>
          {params.quizId === 'mock-exam' ? t('startExam') : t('startQuiz')}
        </Button>
      </Container>
    );
  }

  const currentQuestion = activeQuiz.questions[activeQuiz.currentIndex];
  const selectedAnswer = currentQuestion
    ? activeQuiz.answers[currentQuestion.id]
    : undefined;
  const isLastQuestion = activeQuiz.currentIndex === activeQuiz.questions.length - 1;
  const isMockExam = params.quizId === 'mock-exam';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight={600}>
          {isMockExam ? t('mockExamTitle') : t('topicQuiz')}
        </Typography>
        {activeQuiz.timeLimit !== null && (
          <QuizTimer
            timeRemaining={activeQuiz.timeLimit}
            onTimeUp={handleTimeUp}
          />
        )}
      </Box>

      <QuizProgress
        current={activeQuiz.currentIndex + 1}
        total={activeQuiz.questions.length}
        answered={Object.keys(activeQuiz.answers).length}
      />

      {currentQuestion && (
        <Box sx={{ my: 4 }}>
          <QuestionCard
            question={currentQuestion}
            questionNumber={activeQuiz.currentIndex + 1}
            selectedOptionId={selectedAnswer}
            onSelectOption={handleSelectAnswer}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => dispatch(previousQuestion())}
          disabled={activeQuiz.currentIndex === 0}
        >
          {t('previousQuestion')}
        </Button>
        {isLastQuestion ? (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {t('submitAnswers')}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => dispatch(nextQuestion())}
          >
            {t('nextQuestion')}
          </Button>
        )}
      </Box>
    </Container>
  );
}
