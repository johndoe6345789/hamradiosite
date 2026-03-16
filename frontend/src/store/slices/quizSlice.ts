import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quizzesApi } from '@/lib/apiClient';
import type { QuizState, QuizConfig, ActiveQuiz, QuizResult, QuestionWithAnswer } from '@/types/quiz';

const initialState: QuizState = {
  activeQuiz: null,
  result: null,
  loading: false,
  error: null,
};

export const startQuiz = createAsyncThunk<ActiveQuiz, QuizConfig>(
  'quiz/start',
  async (config, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.start(config);
      const d = response.data as unknown as Record<string, unknown>;
      return {
        quizId: (d.quiz_id ?? d.quizId ?? '') as string,
        questions: (d.questions ?? []) as ActiveQuiz['questions'],
        currentIndex: 0,
        answers: {},
        startedAt: (d.started_at ?? new Date().toISOString()) as string,
        timeLimit: (d.time_limit ?? d.timeLimit ?? null) as number | null,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to start quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk<
  { quizId: string; score: number; total: number; passed: boolean },
  { quizId: string; answers: Record<string, string> }
>(
  'quiz/submit',
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.submit(quizId, answers);
      const d = response.data as unknown as Record<string, unknown>;
      return {
        quizId: (d.quiz_id ?? d.quizId ?? quizId) as string,
        score: (d.score ?? 0) as number,
        total: (d.total ?? 0) as number,
        passed: (d.passed ?? false) as boolean,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

export const fetchQuizResults = createAsyncThunk<QuizResult, string>(
  'quiz/fetchResults',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.getResult(quizId);
      const d = response.data as unknown as Record<string, unknown>;
      const quiz = (d.quiz ?? {}) as Record<string, unknown>;
      const results = (d.results ?? []) as Record<string, unknown>[];

      const questions: QuestionWithAnswer[] = results.map((r) => ({
        id: (r.question_id ?? r.id ?? '') as string,
        text: (r.text ?? '') as string,
        options: (r.options ?? []) as { id: string; text: string }[],
        correctOptionId: (r.correct_option_id ?? r.correctOptionId ?? '') as string,
        explanation: (r.explanation ?? '') as string,
      }));

      const answers: Record<string, string> = {};
      for (const r of results) {
        const qid = (r.question_id ?? r.id ?? '') as string;
        if (r.user_answer) answers[qid] = r.user_answer as string;
      }

      return {
        quizId: (quiz.id ?? quizId) as string,
        score: (quiz.score ?? 0) as number,
        total: (quiz.total ?? 0) as number,
        passed: (quiz.passed ?? false) as boolean,
        questions,
        answers,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quiz results');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setAnswer(state, action: PayloadAction<{ questionId: string; optionId: string }>) {
      if (state.activeQuiz) {
        state.activeQuiz.answers[action.payload.questionId] = action.payload.optionId;
      }
    },
    nextQuestion(state) {
      if (state.activeQuiz && state.activeQuiz.currentIndex < state.activeQuiz.questions.length - 1) {
        state.activeQuiz.currentIndex += 1;
      }
    },
    previousQuestion(state) {
      if (state.activeQuiz && state.activeQuiz.currentIndex > 0) {
        state.activeQuiz.currentIndex -= 1;
      }
    },
    resetQuiz() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startQuiz.pending, (state) => { state.loading = true; state.error = null; state.result = null; })
      .addCase(startQuiz.fulfilled, (state, action: PayloadAction<ActiveQuiz>) => { state.loading = false; state.activeQuiz = action.payload; })
      .addCase(startQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(submitQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitQuiz.fulfilled, (state) => { state.loading = false; state.activeQuiz = null; })
      .addCase(submitQuiz.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchQuizResults.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuizResults.fulfilled, (state, action: PayloadAction<QuizResult>) => { state.loading = false; state.result = action.payload; })
      .addCase(fetchQuizResults.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { setAnswer, nextQuestion, previousQuestion, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
