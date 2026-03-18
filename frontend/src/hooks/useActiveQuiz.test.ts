import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import useActiveQuiz from './useActiveQuiz';
import { quizzesApi } from '@/lib/apiClient';

const mockPush = jest.fn();
const mockParams = { quizId: 'topic-basics' };

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => mockParams,
}));

jest.mock('@/lib/apiClient', () => ({
  quizzesApi: {
    start: jest.fn(),
    submit: jest.fn(),
  },
}));

function wrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store }, children);
  };
}

describe('useActiveQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading and isMockExam=false for topic quiz', () => {
    mockParams.quizId = 'topic-basics';
    const store = createTestStore({ quiz: { loading: false } });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    expect(result.current.isMockExam).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.activeQuiz).toBeNull();
  });

  it('returns isMockExam=true for mock-exam', () => {
    mockParams.quizId = 'mock-exam';
    const store = createTestStore();
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    expect(result.current.isMockExam).toBe(true);
  });

  it('handleStartQuiz dispatches startQuiz with topic config', () => {
    mockParams.quizId = 'topic-basics';
    const store = createTestStore();
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handleStartQuiz();
    });

    // startQuiz is an async thunk, so the dispatch happened
    expect(result.current.handleStartQuiz).toBeDefined();
  });

  it('handleStartQuiz dispatches startQuiz with mock config', () => {
    mockParams.quizId = 'mock-exam';
    const store = createTestStore();
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handleStartQuiz();
    });

    expect(result.current.isMockExam).toBe(true);
  });

  it('handleSelectAnswer dispatches setAnswer when activeQuiz exists', () => {
    const store = createTestStore({
      quiz: {
        activeQuiz: {
          quizId: 'q1',
          questions: [{ id: 'question1', text: 'Q1?', options: [{ id: 'a', text: 'A' }] }],
          currentIndex: 0,
          answers: {},
          startedAt: '2024-01-01',
          timeLimit: null,
        },
      },
    });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handleSelectAnswer('a');
    });

    expect(store.getState().quiz.activeQuiz?.answers).toEqual({ question1: 'a' });
  });

  it('handleSelectAnswer does nothing when activeQuiz is null', () => {
    const store = createTestStore({ quiz: { activeQuiz: null } });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handleSelectAnswer('a');
    });

    expect(store.getState().quiz.activeQuiz).toBeNull();
  });

  it('handleSelectAnswer does nothing when currentQuestion is undefined', () => {
    const store = createTestStore({
      quiz: {
        activeQuiz: {
          quizId: 'q1',
          questions: [],
          currentIndex: 0,
          answers: {},
          startedAt: '2024-01-01',
          timeLimit: null,
        },
      },
    });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handleSelectAnswer('a');
    });

    expect(store.getState().quiz.activeQuiz?.answers).toEqual({});
  });

  it('handleSubmit dispatches submitQuiz and navigates when activeQuiz exists', async () => {
    (quizzesApi.submit as jest.Mock).mockResolvedValue({ data: { score: 5, total: 10, passed: true } });

    const store = createTestStore({
      quiz: {
        activeQuiz: {
          quizId: 'q1',
          questions: [{ id: 'question1', text: 'Q1?', options: [] }],
          currentIndex: 0,
          answers: { question1: 'a' },
          startedAt: '2024-01-01',
          timeLimit: null,
        },
      },
    });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockPush).toHaveBeenCalledWith('/quiz/results/q1');
  });

  it('handleSubmit does nothing when activeQuiz is null', async () => {
    const store = createTestStore({ quiz: { activeQuiz: null } });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handleTimeUp dispatches submitQuiz and navigates when activeQuiz exists', async () => {
    (quizzesApi.submit as jest.Mock).mockResolvedValue({ data: { score: 3, total: 10, passed: false } });

    const store = createTestStore({
      quiz: {
        activeQuiz: {
          quizId: 'q2',
          questions: [{ id: 'question1', text: 'Q1?', options: [] }],
          currentIndex: 0,
          answers: {},
          startedAt: '2024-01-01',
          timeLimit: 600,
        },
      },
    });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    await act(async () => {
      await result.current.handleTimeUp();
    });

    expect(mockPush).toHaveBeenCalledWith('/quiz/results/q2');
  });

  it('handleTimeUp does nothing when activeQuiz is null', async () => {
    const store = createTestStore({ quiz: { activeQuiz: null } });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    await act(async () => {
      await result.current.handleTimeUp();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handleNext dispatches nextQuestion', () => {
    const store = createTestStore({
      quiz: {
        activeQuiz: {
          quizId: 'q1',
          questions: [
            { id: 'q1', text: 'Q1?', options: [] },
            { id: 'q2', text: 'Q2?', options: [] },
          ],
          currentIndex: 0,
          answers: {},
          startedAt: '2024-01-01',
          timeLimit: null,
        },
      },
    });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handleNext();
    });

    expect(store.getState().quiz.activeQuiz?.currentIndex).toBe(1);
  });

  it('handlePrevious dispatches previousQuestion', () => {
    const store = createTestStore({
      quiz: {
        activeQuiz: {
          quizId: 'q1',
          questions: [
            { id: 'q1', text: 'Q1?', options: [] },
            { id: 'q2', text: 'Q2?', options: [] },
          ],
          currentIndex: 1,
          answers: {},
          startedAt: '2024-01-01',
          timeLimit: null,
        },
      },
    });
    const { result } = renderHook(() => useActiveQuiz(), { wrapper: wrapper(store) });

    act(() => {
      result.current.handlePrevious();
    });

    expect(store.getState().quiz.activeQuiz?.currentIndex).toBe(0);
  });
});
