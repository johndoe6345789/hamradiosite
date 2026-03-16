'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizTimer from '@/components/quiz/QuizTimer';
import QuizStartScreen from '@/components/quiz/QuizStartScreen';
import useActiveQuiz from '@/hooks/useActiveQuiz';

export default function ActiveQuizPage() {
  const t = useTranslations('quiz');
  const q = useActiveQuiz();

  if (q.loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  if (!q.activeQuiz) {
    return (
      <QuizStartScreen
        title={q.isMockExam ? t('mockExamTitle') : t('topicQuiz')}
        description={q.isMockExam ? t('mockExamDescription') : t('topicQuizDescription')}
        buttonLabel={q.isMockExam ? t('startExam') : t('startQuiz')}
        onStart={q.handleStartQuiz}
      />
    );
  }

  const currentQuestion = q.activeQuiz.questions[q.activeQuiz.currentIndex];
  const selectedAnswer = currentQuestion ? q.activeQuiz.answers[currentQuestion.id] : undefined;
  const isLast = q.activeQuiz.currentIndex === q.activeQuiz.questions.length - 1;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          {q.isMockExam ? t('mockExamTitle') : t('topicQuiz')}
        </Typography>
        {q.activeQuiz.timeLimit !== null && <QuizTimer timeRemaining={q.activeQuiz.timeLimit} onTimeUp={q.handleTimeUp} />}
      </Box>
      <QuizProgress current={q.activeQuiz.currentIndex + 1} total={q.activeQuiz.questions.length} answered={Object.keys(q.activeQuiz.answers).length} />
      {currentQuestion && (
        <Box sx={{ my: 4 }}>
          <QuestionCard question={currentQuestion} questionNumber={q.activeQuiz.currentIndex + 1} selectedOptionId={selectedAnswer} onSelectOption={q.handleSelectAnswer} />
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={q.handlePrevious} disabled={q.activeQuiz.currentIndex === 0}>{t('previousQuestion')}</Button>
        {isLast
          ? <Button variant="contained" color="primary" onClick={q.handleSubmit}>{t('submitAnswers')}</Button>
          : <Button variant="contained" onClick={q.handleNext}>{t('nextQuestion')}</Button>}
      </Box>
    </Container>
  );
}
