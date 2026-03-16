import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { progressApi } from '@/lib/apiClient';
import type {
  ProgressState,
  OverallProgress,
  TopicProgress,
  QuizAttemptSummary,
} from '@/types/progress';

const initialState: ProgressState = {
  overall: null,
  topicBreakdown: [],
  weakAreas: [],
  history: [],
  loading: false,
  error: null,
};

export const fetchOverallProgress = createAsyncThunk<OverallProgress, void>(
  'progress/fetchOverall',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getOverall();
      const d = response.data as unknown as Record<string, unknown>;
      return {
        totalQuizzes: (d.total_quizzes ?? d.totalQuizzes ?? 0) as number,
        averageScore: (d.overall_percentage ?? d.averageScore ?? 0) as number,
        currentStreak: (d.current_streak ?? d.currentStreak ?? 0) as number,
        bestStreak: (d.best_streak ?? d.bestStreak ?? 0) as number,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch overall progress');
    }
  }
);

function mapTopicProgress(t: Record<string, unknown>): TopicProgress {
  return {
    topicId: (t.topic_id ?? t.topicId ?? '') as string,
    topicTitle: (t.topic_title ?? t.topicTitle ?? '') as string,
    topicSlug: (t.topic_slug ?? t.topicSlug ?? '') as string,
    totalAttempts: (t.quizzes_taken ?? t.totalAttempts ?? 0) as number,
    averageScore: (t.percentage ?? t.averageScore ?? 0) as number,
    lastAttemptDate: (t.last_attempt_date ?? t.lastAttemptDate ?? null) as string | null,
  };
}

export const fetchTopicBreakdown = createAsyncThunk<TopicProgress[], void>(
  'progress/fetchTopicBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getTopicBreakdown();
      const d = response.data as unknown as Record<string, unknown>;
      const arr = (Array.isArray(d) ? d : (d.topics ?? [])) as Record<string, unknown>[];
      return arr.map(mapTopicProgress);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch topic breakdown');
    }
  }
);

export const fetchWeakAreas = createAsyncThunk<TopicProgress[], void>(
  'progress/fetchWeakAreas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getWeakAreas();
      const d = response.data as unknown as Record<string, unknown>;
      const arr = (Array.isArray(d) ? d : (d.weak_areas ?? [])) as Record<string, unknown>[];
      return arr.map(mapTopicProgress);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch weak areas');
    }
  }
);

export const fetchHistory = createAsyncThunk<QuizAttemptSummary[], void>(
  'progress/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getHistory();
      const d = response.data as unknown as Record<string, unknown>;
      const arr = (Array.isArray(d) ? d : (d.history ?? [])) as Record<string, unknown>[];
      return arr.map((a) => ({
        id: (a.id ?? '') as string,
        quizType: (a.quiz_type ?? a.quizType ?? '') as string,
        topicTitle: (a.topic_title ?? a.topicTitle ?? null) as string | null,
        score: (a.score ?? 0) as number,
        total: (a.total ?? 0) as number,
        passed: (a.passed ?? false) as boolean,
        completedAt: (a.completed_at ?? a.completedAt ?? '') as string,
      }));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverallProgress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOverallProgress.fulfilled, (state, action: PayloadAction<OverallProgress>) => { state.loading = false; state.overall = action.payload; })
      .addCase(fetchOverallProgress.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchTopicBreakdown.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTopicBreakdown.fulfilled, (state, action: PayloadAction<TopicProgress[]>) => { state.loading = false; state.topicBreakdown = action.payload; })
      .addCase(fetchTopicBreakdown.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchWeakAreas.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWeakAreas.fulfilled, (state, action: PayloadAction<TopicProgress[]>) => { state.loading = false; state.weakAreas = action.payload; })
      .addCase(fetchWeakAreas.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchHistory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchHistory.fulfilled, (state, action: PayloadAction<QuizAttemptSummary[]>) => { state.loading = false; state.history = action.payload; })
      .addCase(fetchHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default progressSlice.reducer;
