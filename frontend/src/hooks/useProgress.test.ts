import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import useProgress from './useProgress';

const mockPush = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/apiClient', () => ({
  progressApi: {
    getOverall: jest.fn().mockResolvedValue({ data: {} }),
    getTopicBreakdown: jest.fn().mockResolvedValue({ data: { topics: [] } }),
    getWeakAreas: jest.fn().mockResolvedValue({ data: { weak_areas: [] } }),
    getHistory: jest.fn().mockResolvedValue({ data: { history: [] } }),
  },
}));

function wrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store }, children);
  };
}

describe('useProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when not authenticated', () => {
    const store = createTestStore({
      auth: { isAuthenticated: false },
    });

    renderHook(() => useProgress(), { wrapper: wrapper(store) });

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('dispatches all fetch actions when authenticated', () => {
    const store = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'test', email: 'test@test.com', createdAt: '2024-01-01' },
        accessToken: 'token',
        refreshToken: 'refresh',
      },
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    renderHook(() => useProgress(), { wrapper: wrapper(store) });

    expect(mockPush).not.toHaveBeenCalled();

    // Should dispatch 4 thunks: fetchOverallProgress, fetchTopicBreakdown, fetchWeakAreas, fetchHistory
    const dispatchedTypes = dispatchSpy.mock.calls.map((call) => (call[0] as { type?: string }).type);
    expect(dispatchedTypes).toContain('progress/fetchOverall/pending');
    expect(dispatchedTypes).toContain('progress/fetchTopicBreakdown/pending');
    expect(dispatchedTypes).toContain('progress/fetchWeakAreas/pending');
    expect(dispatchedTypes).toContain('progress/fetchHistory/pending');
  });

  it('returns progress state and isAuthenticated', () => {
    const store = createTestStore({
      auth: { isAuthenticated: false },
      progress: {
        overall: { totalQuizzes: 5, averageScore: 80, currentStreak: 3, bestStreak: 7 },
        topicBreakdown: [],
        weakAreas: [],
        history: [],
        loading: false,
        error: null,
      },
    });

    const { result } = renderHook(() => useProgress(), { wrapper: wrapper(store) });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.overall).toEqual({
      totalQuizzes: 5,
      averageScore: 80,
      currentStreak: 3,
      bestStreak: 7,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns loading state from progress', () => {
    const store = createTestStore({
      auth: { isAuthenticated: true, user: { id: '1', username: 'test', email: 'test@test.com', createdAt: '2024-01-01' }, accessToken: 'token', refreshToken: 'refresh' },
      progress: { loading: true },
    });

    const { result } = renderHook(() => useProgress(), { wrapper: wrapper(store) });

    expect(result.current.loading).toBe(true);
  });
});
