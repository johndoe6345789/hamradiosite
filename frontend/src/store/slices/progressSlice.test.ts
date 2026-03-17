import { configureStore } from '@reduxjs/toolkit';
import progressReducer, {
  fetchOverallProgress,
  fetchTopicBreakdown,
  fetchWeakAreas,
  fetchHistory,
} from './progressSlice';
import type { ProgressState, OverallProgress, TopicProgress, QuizAttemptSummary } from '@/types/progress';
import { progressApi } from '@/lib/apiClient';

jest.mock('@/lib/apiClient', () => ({
  progressApi: {
    getOverall: jest.fn(),
    getTopicBreakdown: jest.fn(),
    getWeakAreas: jest.fn(),
    getHistory: jest.fn(),
  },
}));

const mockOverall: OverallProgress = {
  totalQuizzes: 10,
  averageScore: 75,
  currentStreak: 3,
  bestStreak: 5,
};

const mockTopicBreakdown: TopicProgress[] = [
  {
    topicId: 't1',
    topicTitle: 'Licensing',
    topicSlug: 'licensing',
    totalAttempts: 5,
    averageScore: 80,
    lastAttemptDate: '2024-01-15T00:00:00Z',
  },
];

const mockWeakAreas: TopicProgress[] = [
  {
    topicId: 't2',
    topicTitle: 'Propagation',
    topicSlug: 'propagation',
    totalAttempts: 2,
    averageScore: 45,
    lastAttemptDate: '2024-01-10T00:00:00Z',
  },
];

const mockHistory: QuizAttemptSummary[] = [
  {
    id: 'a1',
    quizType: 'mock',
    topicTitle: null,
    score: 20,
    total: 26,
    passed: true,
    completedAt: '2024-01-15T12:00:00Z',
  },
];

describe('progressSlice', () => {
  const initialState: ProgressState = {
    overall: null,
    topicBreakdown: [],
    weakAreas: [],
    history: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(progressReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchOverallProgress', () => {
    it('should set loading on pending', () => {
      const state = progressReducer(
        initialState,
        fetchOverallProgress.pending('', undefined)
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set overall on fulfilled', () => {
      const state = progressReducer(
        initialState,
        fetchOverallProgress.fulfilled(mockOverall, '', undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.overall).toEqual(mockOverall);
      expect(state.error).toBeNull();
    });

    it('should set error on rejected', () => {
      const state = progressReducer(
        initialState,
        fetchOverallProgress.rejected(new Error('fail'), '', undefined, 'Fetch failed')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });
  });

  describe('fetchTopicBreakdown', () => {
    it('should set loading on pending', () => {
      const state = progressReducer(
        initialState,
        fetchTopicBreakdown.pending('', undefined)
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set topicBreakdown on fulfilled', () => {
      const state = progressReducer(
        initialState,
        fetchTopicBreakdown.fulfilled(mockTopicBreakdown, '', undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.topicBreakdown).toEqual(mockTopicBreakdown);
    });

    it('should set error on rejected', () => {
      const state = progressReducer(
        initialState,
        fetchTopicBreakdown.rejected(new Error('fail'), '', undefined, 'Fetch failed')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });
  });

  describe('fetchWeakAreas', () => {
    it('should set loading on pending', () => {
      const state = progressReducer(
        initialState,
        fetchWeakAreas.pending('', undefined)
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set weakAreas on fulfilled', () => {
      const state = progressReducer(
        initialState,
        fetchWeakAreas.fulfilled(mockWeakAreas, '', undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.weakAreas).toEqual(mockWeakAreas);
    });

    it('should set error on rejected', () => {
      const state = progressReducer(
        initialState,
        fetchWeakAreas.rejected(new Error('fail'), '', undefined, 'Fetch failed')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });
  });

  describe('fetchHistory', () => {
    it('should set loading on pending', () => {
      const state = progressReducer(
        initialState,
        fetchHistory.pending('', undefined)
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set history on fulfilled', () => {
      const state = progressReducer(
        initialState,
        fetchHistory.fulfilled(mockHistory, '', undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.history).toEqual(mockHistory);
    });

    it('should set error on rejected', () => {
      const state = progressReducer(
        initialState,
        fetchHistory.rejected(new Error('fail'), '', undefined, 'Fetch failed')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });
  });

  describe('thunk execution', () => {
    const mockedProgressApi = progressApi as jest.Mocked<typeof progressApi>;

    function createTestStore() {
      return configureStore({ reducer: { progress: progressReducer } });
    }

    beforeEach(() => {
      jest.clearAllMocks();
    });

    // fetchOverallProgress
    it('fetchOverallProgress success', async () => {
      mockedProgressApi.getOverall.mockResolvedValue({ data: mockOverall });
      const store = createTestStore();
      await store.dispatch(fetchOverallProgress());
      const state = store.getState().progress;
      expect(state.overall).toEqual(mockOverall);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('fetchOverallProgress failure with response message', async () => {
      mockedProgressApi.getOverall.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } });
      const store = createTestStore();
      await store.dispatch(fetchOverallProgress());
      expect(store.getState().progress.error).toBe('Unauthorized');
    });

    it('fetchOverallProgress failure with fallback message', async () => {
      mockedProgressApi.getOverall.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(fetchOverallProgress());
      expect(store.getState().progress.error).toBe('Failed to fetch overall progress');
    });

    // fetchTopicBreakdown
    it('fetchTopicBreakdown success', async () => {
      mockedProgressApi.getTopicBreakdown.mockResolvedValue({ data: mockTopicBreakdown });
      const store = createTestStore();
      await store.dispatch(fetchTopicBreakdown());
      const state = store.getState().progress;
      expect(state.topicBreakdown).toEqual(mockTopicBreakdown);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('fetchTopicBreakdown failure with response message', async () => {
      mockedProgressApi.getTopicBreakdown.mockRejectedValue({ response: { data: { message: 'Server error' } } });
      const store = createTestStore();
      await store.dispatch(fetchTopicBreakdown());
      expect(store.getState().progress.error).toBe('Server error');
    });

    it('fetchTopicBreakdown failure with fallback message', async () => {
      mockedProgressApi.getTopicBreakdown.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(fetchTopicBreakdown());
      expect(store.getState().progress.error).toBe('Failed to fetch topic breakdown');
    });

    // fetchWeakAreas
    it('fetchWeakAreas success', async () => {
      mockedProgressApi.getWeakAreas.mockResolvedValue({ data: mockWeakAreas });
      const store = createTestStore();
      await store.dispatch(fetchWeakAreas());
      const state = store.getState().progress;
      expect(state.weakAreas).toEqual(mockWeakAreas);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('fetchWeakAreas failure with response message', async () => {
      mockedProgressApi.getWeakAreas.mockRejectedValue({ response: { data: { message: 'Forbidden' } } });
      const store = createTestStore();
      await store.dispatch(fetchWeakAreas());
      expect(store.getState().progress.error).toBe('Forbidden');
    });

    it('fetchWeakAreas failure with fallback message', async () => {
      mockedProgressApi.getWeakAreas.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(fetchWeakAreas());
      expect(store.getState().progress.error).toBe('Failed to fetch weak areas');
    });

    // fetchHistory
    it('fetchHistory success', async () => {
      mockedProgressApi.getHistory.mockResolvedValue({ data: mockHistory });
      const store = createTestStore();
      await store.dispatch(fetchHistory());
      const state = store.getState().progress;
      expect(state.history).toEqual(mockHistory);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('fetchHistory failure with response message', async () => {
      mockedProgressApi.getHistory.mockRejectedValue({ response: { data: { message: 'Not authorized' } } });
      const store = createTestStore();
      await store.dispatch(fetchHistory());
      expect(store.getState().progress.error).toBe('Not authorized');
    });

    it('fetchHistory failure with fallback message', async () => {
      mockedProgressApi.getHistory.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(fetchHistory());
      expect(store.getState().progress.error).toBe('Failed to fetch history');
    });

    // Branch coverage: fetchOverallProgress with snake_case keys (lines 26-29)
    it('fetchOverallProgress maps snake_case keys', async () => {
      mockedProgressApi.getOverall.mockResolvedValue({
        data: {
          total_quizzes: 7,
          overall_percentage: 82,
          current_streak: 4,
          best_streak: 6,
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchOverallProgress());
      const state = store.getState().progress;
      expect(state.overall).toEqual({
        totalQuizzes: 7,
        averageScore: 82,
        currentStreak: 4,
        bestStreak: 6,
      });
    });

    // Branch coverage: fetchOverallProgress with missing keys falls back to 0 (lines 26-29)
    it('fetchOverallProgress defaults missing keys to 0', async () => {
      mockedProgressApi.getOverall.mockResolvedValue({ data: {} });
      const store = createTestStore();
      await store.dispatch(fetchOverallProgress());
      const state = store.getState().progress;
      expect(state.overall).toEqual({
        totalQuizzes: 0,
        averageScore: 0,
        currentStreak: 0,
        bestStreak: 0,
      });
    });

    // Branch coverage: mapTopicProgress with snake_case keys (lines 40-46)
    it('fetchTopicBreakdown maps snake_case topic keys', async () => {
      mockedProgressApi.getTopicBreakdown.mockResolvedValue({
        data: {
          topics: [
            {
              topic_id: 't1',
              topic_title: 'Licensing',
              topic_slug: 'licensing',
              quizzes_taken: 5,
              percentage: 80,
              last_attempt_date: '2024-01-15T00:00:00Z',
            },
          ],
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchTopicBreakdown());
      const state = store.getState().progress;
      expect(state.topicBreakdown).toEqual([
        {
          topicId: 't1',
          topicTitle: 'Licensing',
          topicSlug: 'licensing',
          totalAttempts: 5,
          averageScore: 80,
          lastAttemptDate: '2024-01-15T00:00:00Z',
        },
      ]);
    });

    // Branch coverage: mapTopicProgress with missing keys defaults (lines 40-46)
    it('fetchTopicBreakdown defaults missing topic keys', async () => {
      mockedProgressApi.getTopicBreakdown.mockResolvedValue({
        data: { topics: [{}] },
      });
      const store = createTestStore();
      await store.dispatch(fetchTopicBreakdown());
      const state = store.getState().progress;
      expect(state.topicBreakdown).toEqual([
        {
          topicId: '',
          topicTitle: '',
          topicSlug: '',
          totalAttempts: 0,
          averageScore: 0,
          lastAttemptDate: null,
        },
      ]);
    });

    // Branch coverage: fetchTopicBreakdown when data is an array directly (line 55)
    it('fetchTopicBreakdown handles direct array response', async () => {
      mockedProgressApi.getTopicBreakdown.mockResolvedValue({
        data: [
          {
            topicId: 't2',
            topicTitle: 'Safety',
            topicSlug: 'safety',
            totalAttempts: 3,
            averageScore: 60,
            lastAttemptDate: null,
          },
        ],
      });
      const store = createTestStore();
      await store.dispatch(fetchTopicBreakdown());
      const state = store.getState().progress;
      expect(state.topicBreakdown[0].topicId).toBe('t2');
    });

    // Branch coverage: fetchWeakAreas with non-array wrapper using weak_areas key (line 70)
    it('fetchWeakAreas maps from weak_areas wrapper object', async () => {
      mockedProgressApi.getWeakAreas.mockResolvedValue({
        data: {
          weak_areas: [
            {
              topic_id: 't3',
              topic_title: 'Propagation',
              topic_slug: 'propagation',
              quizzes_taken: 1,
              percentage: 30,
              last_attempt_date: null,
            },
          ],
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchWeakAreas());
      const state = store.getState().progress;
      expect(state.weakAreas).toEqual([
        {
          topicId: 't3',
          topicTitle: 'Propagation',
          topicSlug: 'propagation',
          totalAttempts: 1,
          averageScore: 30,
          lastAttemptDate: null,
        },
      ]);
    });

    // Branch coverage: fetchWeakAreas when data is a direct array (line 70)
    it('fetchWeakAreas handles direct array response', async () => {
      mockedProgressApi.getWeakAreas.mockResolvedValue({
        data: [
          {
            topicId: 't3',
            topicTitle: 'Propagation',
            topicSlug: 'propagation',
            totalAttempts: 1,
            averageScore: 30,
            lastAttemptDate: null,
          },
        ],
      });
      const store = createTestStore();
      await store.dispatch(fetchWeakAreas());
      expect(store.getState().progress.weakAreas[0].topicId).toBe('t3');
    });

    // Branch coverage: fetchHistory with snake_case keys (lines 85-93)
    it('fetchHistory maps snake_case history keys', async () => {
      mockedProgressApi.getHistory.mockResolvedValue({
        data: {
          history: [
            {
              id: 'a2',
              quiz_type: 'topic',
              topic_title: 'Safety',
              score: 8,
              total: 10,
              passed: true,
              completed_at: '2024-02-01T10:00:00Z',
            },
          ],
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchHistory());
      const state = store.getState().progress;
      expect(state.history).toEqual([
        {
          id: 'a2',
          quizType: 'topic',
          topicTitle: 'Safety',
          score: 8,
          total: 10,
          passed: true,
          completedAt: '2024-02-01T10:00:00Z',
        },
      ]);
    });

    // Branch coverage: fetchHistory with missing keys defaults (lines 85-93)
    it('fetchHistory defaults missing history keys', async () => {
      mockedProgressApi.getHistory.mockResolvedValue({
        data: { history: [{}] },
      });
      const store = createTestStore();
      await store.dispatch(fetchHistory());
      const state = store.getState().progress;
      expect(state.history).toEqual([
        {
          id: '',
          quizType: '',
          topicTitle: null,
          score: 0,
          total: 0,
          passed: false,
          completedAt: '',
        },
      ]);
    });

    // Branch coverage: fetchHistory when data is a direct array (line 85)
    it('fetchHistory handles direct array response', async () => {
      mockedProgressApi.getHistory.mockResolvedValue({
        data: [
          {
            id: 'a3',
            quizType: 'mock',
            topicTitle: null,
            score: 15,
            total: 26,
            passed: false,
            completedAt: '2024-03-01T12:00:00Z',
          },
        ],
      });
      const store = createTestStore();
      await store.dispatch(fetchHistory());
      expect(store.getState().progress.history[0].id).toBe('a3');
    });
  });
});
