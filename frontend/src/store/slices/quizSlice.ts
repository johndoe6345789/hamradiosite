import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quizzesApi } from '@/lib/apiClient';
import type { QuizState, QuizConfig, ActiveQuiz, QuizResult } from '@/types/quiz';

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
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to start quiz'
      );
    }
  }
);

export const submitQuiz = createAsyncThunk<
  QuizResult,
  { quizId: string; answers: Record<string, string> }
>(
  'quiz/submit',
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.submit(quizId, answers);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit quiz'
      );
    }
  }
);

export const fetchQuizResults = createAsyncThunk<QuizResult, string>(
  'quiz/fetchResults',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.getResult(quizId);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch quiz results'
      );
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
      if (
        state.activeQuiz &&
        state.activeQuiz.currentIndex < state.activeQuiz.questions.length - 1
      ) {
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
      // startQuiz
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(startQuiz.fulfilled, (state, action: PayloadAction<ActiveQuiz>) => {
        state.loading = false;
        state.activeQuiz = action.payload;
        state.error = null;
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // submitQuiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action: PayloadAction<QuizResult>) => {
        state.loading = false;
        state.result = action.payload;
        state.activeQuiz = null;
        state.error = null;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchQuizResults
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action: PayloadAction<QuizResult>) => {
        state.loading = false;
        state.result = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAnswer, nextQuestion, previousQuestion, resetQuiz } =
  quizSlice.actions;
export default quizSlice.reducer;
