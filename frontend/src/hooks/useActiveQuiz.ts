import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAnswer, nextQuestion, previousQuestion, startQuiz, submitQuiz } from '@/store/slices/quizSlice';
import { useRouter } from '@/i18n/navigation';

export default function useActiveQuiz() {
  const params = useParams<{ quizId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { activeQuiz, loading } = useAppSelector((state) => state.quiz);
  const isMockExam = params.quizId === 'mock-exam';

  const handleStartQuiz = useCallback(() => {
    dispatch(startQuiz({
      type: isMockExam ? 'mock' : 'topic',
      topicSlug: isMockExam ? undefined : params.quizId.replace('topic-', ''),
    }));
  }, [dispatch, isMockExam, params.quizId]);

  const handleSelectAnswer = useCallback((optionId: string) => {
    if (activeQuiz) {
      const currentQuestion = activeQuiz.questions[activeQuiz.currentIndex];
      if (currentQuestion) {
        dispatch(setAnswer({ questionId: currentQuestion.id, optionId }));
      }
    }
  }, [dispatch, activeQuiz]);

  const handleSubmit = useCallback(async () => {
    if (activeQuiz) {
      await dispatch(submitQuiz({ quizId: activeQuiz.quizId, answers: activeQuiz.answers }));
      router.push(`/quiz/results/${activeQuiz.quizId}`);
    }
  }, [dispatch, router, activeQuiz]);

  const handleTimeUp = useCallback(async () => {
    if (activeQuiz) {
      await dispatch(submitQuiz({ quizId: activeQuiz.quizId, answers: activeQuiz.answers }));
      router.push(`/quiz/results/${activeQuiz.quizId}`);
    }
  }, [dispatch, router, activeQuiz]);

  const handleNext = useCallback(() => dispatch(nextQuestion()), [dispatch]);
  const handlePrevious = useCallback(() => dispatch(previousQuestion()), [dispatch]);

  return {
    activeQuiz, loading, isMockExam,
    handleStartQuiz, handleSelectAnswer, handleSubmit, handleTimeUp,
    handleNext, handlePrevious,
  };
}
