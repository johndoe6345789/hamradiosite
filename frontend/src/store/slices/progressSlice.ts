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
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch overall progress'
      );
    }
  }
);

export const fetchTopicBreakdown = createAsyncThunk<TopicProgress[], void>(
  'progress/fetchTopicBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getTopicBreakdown();
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch topic breakdown'
      );
    }
  }
);

export const fetchWeakAreas = createAsyncThunk<TopicProgress[], void>(
  'progress/fetchWeakAreas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getWeakAreas();
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch weak areas'
      );
    }
  }
);

export const fetchHistory = createAsyncThunk<QuizAttemptSummary[], void>(
  'progress/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getHistory();
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch history'
      );
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchOverallProgress
      .addCase(fetchOverallProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOverallProgress.fulfilled,
        (state, action: PayloadAction<OverallProgress>) => {
          state.loading = false;
          state.overall = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchOverallProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchTopicBreakdown
      .addCase(fetchTopicBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTopicBreakdown.fulfilled,
        (state, action: PayloadAction<TopicProgress[]>) => {
          state.loading = false;
          state.topicBreakdown = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchTopicBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchWeakAreas
      .addCase(fetchWeakAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWeakAreas.fulfilled,
        (state, action: PayloadAction<TopicProgress[]>) => {
          state.loading = false;
          state.weakAreas = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchWeakAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchHistory
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHistory.fulfilled,
        (state, action: PayloadAction<QuizAttemptSummary[]>) => {
          state.loading = false;
          state.history = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default progressSlice.reducer;
