import { configureStore } from '@reduxjs/toolkit';
import quizReducer, {
  setAnswer,
  nextQuestion,
  previousQuestion,
  resetQuiz,
  startQuiz,
  submitQuiz,
  fetchQuizResults,
} from './quizSlice';
import type { QuizState, ActiveQuiz, QuizResult } from '@/types/quiz';
import { quizzesApi } from '@/lib/apiClient';

jest.mock('@/lib/apiClient', () => ({
  quizzesApi: {
    start: jest.fn(),
    submit: jest.fn(),
    getResult: jest.fn(),
  },
}));

const mockActiveQuiz: ActiveQuiz = {
  quizId: 'quiz-1',
  questions: [
    { id: 'q1', text: 'What is 2+2?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '4' }] },
    { id: 'q2', text: 'What is 3+3?', options: [{ id: 'a', text: '5' }, { id: 'b', text: '6' }] },
    { id: 'q3', text: 'What is 4+4?', options: [{ id: 'a', text: '7' }, { id: 'b', text: '8' }] },
  ],
  currentIndex: 0,
  answers: {},
  startedAt: '2024-01-01T00:00:00Z',
  timeLimit: 3300,
};

const mockQuizResult: QuizResult = {
  quizId: 'quiz-1',
  score: 2,
  total: 3,
  passed: true,
  questions: [
    { id: 'q1', text: 'What is 2+2?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '4' }], correctOptionId: 'b', explanation: '2+2=4' },
  ],
  answers: { q1: 'b' },
};

const mockSubmitResponse = { quizId: 'quiz-1', score: 2, total: 3, passed: true };

describe('quizSlice', () => {
  const initialState: QuizState = { activeQuiz: null, result: null, loading: false, error: null };

  it('should return the initial state', () => {
    expect(quizReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setAnswer', () => {
    it('should set an answer for a question', () => {
      const stateWithQuiz: QuizState = { ...initialState, activeQuiz: { ...mockActiveQuiz } };
      const state = quizReducer(stateWithQuiz, setAnswer({ questionId: 'q1', optionId: 'b' }));
      expect(state.activeQuiz?.answers['q1']).toBe('b');
    });

    it('should not crash when no active quiz', () => {
      const state = quizReducer(initialState, setAnswer({ questionId: 'q1', optionId: 'b' }));
      expect(state.activeQuiz).toBeNull();
    });
  });

  describe('nextQuestion', () => {
    it('should increment currentIndex', () => {
      const stateWithQuiz: QuizState = { ...initialState, activeQuiz: { ...mockActiveQuiz } };
      const state = quizReducer(stateWithQuiz, nextQuestion());
      expect(state.activeQuiz?.currentIndex).toBe(1);
    });

    it('should not exceed question count', () => {
      const stateWithQuiz: QuizState = { ...initialState, activeQuiz: { ...mockActiveQuiz, currentIndex: 2 } };
      const state = quizReducer(stateWithQuiz, nextQuestion());
      expect(state.activeQuiz?.currentIndex).toBe(2);
    });

    it('should not crash when no active quiz', () => {
      const state = quizReducer(initialState, nextQuestion());
      expect(state.activeQuiz).toBeNull();
    });
  });

  describe('previousQuestion', () => {
    it('should decrement currentIndex', () => {
      const stateWithQuiz: QuizState = { ...initialState, activeQuiz: { ...mockActiveQuiz, currentIndex: 1 } };
      const state = quizReducer(stateWithQuiz, previousQuestion());
      expect(state.activeQuiz?.currentIndex).toBe(0);
    });

    it('should not go below 0', () => {
      const stateWithQuiz: QuizState = { ...initialState, activeQuiz: { ...mockActiveQuiz } };
      const state = quizReducer(stateWithQuiz, previousQuestion());
      expect(state.activeQuiz?.currentIndex).toBe(0);
    });
  });

  describe('resetQuiz', () => {
    it('should reset to initial state', () => {
      const stateWithQuiz: QuizState = { activeQuiz: mockActiveQuiz, result: mockQuizResult, loading: false, error: 'some error' };
      const state = quizReducer(stateWithQuiz, resetQuiz());
      expect(state).toEqual(initialState);
    });
  });

  describe('startQuiz', () => {
    it('should set loading on pending', () => {
      const state = quizReducer(initialState, startQuiz.pending('', { type: 'mock' }));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.result).toBeNull();
    });

    it('should set activeQuiz on fulfilled', () => {
      const state = quizReducer(initialState, startQuiz.fulfilled(mockActiveQuiz, '', { type: 'mock' }));
      expect(state.loading).toBe(false);
      expect(state.activeQuiz).toEqual(mockActiveQuiz);
    });

    it('should set error on rejected', () => {
      const state = quizReducer(initialState, startQuiz.rejected(new Error('fail'), '', { type: 'mock' }, 'Failed to start'));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to start');
    });
  });

  describe('submitQuiz', () => {
    it('should set loading on pending', () => {
      const state = quizReducer(initialState, submitQuiz.pending('', { quizId: 'quiz-1', answers: {} }));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should clear activeQuiz on fulfilled', () => {
      const stateWithQuiz: QuizState = { ...initialState, activeQuiz: mockActiveQuiz };
      const state = quizReducer(stateWithQuiz, submitQuiz.fulfilled(mockSubmitResponse, '', { quizId: 'quiz-1', answers: {} }));
      expect(state.loading).toBe(false);
      expect(state.activeQuiz).toBeNull();
    });

    it('should set error on rejected', () => {
      const state = quizReducer(initialState, submitQuiz.rejected(new Error('fail'), '', { quizId: 'quiz-1', answers: {} }, 'Submit failed'));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Submit failed');
    });
  });

  describe('fetchQuizResults', () => {
    it('should set loading on pending', () => {
      const state = quizReducer(initialState, fetchQuizResults.pending('', 'quiz-1'));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set result on fulfilled', () => {
      const state = quizReducer(initialState, fetchQuizResults.fulfilled(mockQuizResult, '', 'quiz-1'));
      expect(state.loading).toBe(false);
      expect(state.result).toEqual(mockQuizResult);
    });

    it('should set error on rejected', () => {
      const state = quizReducer(initialState, fetchQuizResults.rejected(new Error('fail'), '', 'quiz-1', 'Fetch failed'));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });
  });

  describe('thunk execution', () => {
    const mockedQuizzesApi = quizzesApi as jest.Mocked<typeof quizzesApi>;

    function createTestStore() {
      return configureStore({ reducer: { quiz: quizReducer } });
    }

    beforeEach(() => { jest.clearAllMocks(); });

    it('startQuiz success maps snake_case response', async () => {
      mockedQuizzesApi.start.mockResolvedValue({
        data: { quiz_id: 'quiz-1', questions: mockActiveQuiz.questions, time_limit: 3300 },
      });
      const store = createTestStore();
      await store.dispatch(startQuiz({ type: 'mock' }));
      const state = store.getState().quiz;
      expect(state.activeQuiz?.quizId).toBe('quiz-1');
      expect(state.activeQuiz?.currentIndex).toBe(0);
      expect(state.activeQuiz?.answers).toEqual({});
      expect(state.activeQuiz?.timeLimit).toBe(3300);
      expect(state.loading).toBe(false);
    });

    it('startQuiz failure with response message', async () => {
      mockedQuizzesApi.start.mockRejectedValue({ response: { data: { message: 'No questions available' } } });
      const store = createTestStore();
      await store.dispatch(startQuiz({ type: 'mock' }));
      expect(store.getState().quiz.error).toBe('No questions available');
    });

    it('startQuiz failure with fallback message', async () => {
      mockedQuizzesApi.start.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(startQuiz({ type: 'mock' }));
      expect(store.getState().quiz.error).toBe('Failed to start quiz');
    });

    it('submitQuiz success', async () => {
      mockedQuizzesApi.submit.mockResolvedValue({
        data: { quiz_id: 'quiz-1', score: 2, total: 3, passed: true, percentage: 66.7 },
      });
      const store = createTestStore();
      await store.dispatch(submitQuiz({ quizId: 'quiz-1', answers: { q1: 'b' } }));
      const state = store.getState().quiz;
      expect(state.activeQuiz).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('submitQuiz failure with response message', async () => {
      mockedQuizzesApi.submit.mockRejectedValue({ response: { data: { message: 'Quiz expired' } } });
      const store = createTestStore();
      await store.dispatch(submitQuiz({ quizId: 'quiz-1', answers: {} }));
      expect(store.getState().quiz.error).toBe('Quiz expired');
    });

    it('submitQuiz failure with fallback message', async () => {
      mockedQuizzesApi.submit.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(submitQuiz({ quizId: 'quiz-1', answers: {} }));
      expect(store.getState().quiz.error).toBe('Failed to submit quiz');
    });

    it('fetchQuizResults success maps backend response', async () => {
      mockedQuizzesApi.getResult.mockResolvedValue({
        data: {
          quiz: { id: 'quiz-1', quiz_type: 'mock', score: 2, total: 3, passed: true },
          results: [
            { question_id: 'q1', text: 'What is 2+2?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '4' }], correct_option_id: 'b', explanation: '2+2=4', user_answer: 'b', is_correct: true },
          ],
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchQuizResults('quiz-1'));
      const state = store.getState().quiz;
      expect(state.result?.quizId).toBe('quiz-1');
      expect(state.result?.score).toBe(2);
      expect(state.result?.questions[0].correctOptionId).toBe('b');
      expect(state.result?.answers['q1']).toBe('b');
      expect(state.loading).toBe(false);
    });

    it('fetchQuizResults failure with response message', async () => {
      mockedQuizzesApi.getResult.mockRejectedValue({ response: { data: { message: 'Not found' } } });
      const store = createTestStore();
      await store.dispatch(fetchQuizResults('quiz-1'));
      expect(store.getState().quiz.error).toBe('Not found');
    });

    it('fetchQuizResults failure with fallback message', async () => {
      mockedQuizzesApi.getResult.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(fetchQuizResults('quiz-1'));
      expect(store.getState().quiz.error).toBe('Failed to fetch quiz results');
    });

    // Branch coverage: startQuiz with camelCase keys (lines 19-20, 24)
    it('startQuiz maps camelCase response keys', async () => {
      mockedQuizzesApi.start.mockResolvedValue({
        data: {
          quizId: 'quiz-camel',
          questions: mockActiveQuiz.questions,
          timeLimit: 1800,
        },
      });
      const store = createTestStore();
      await store.dispatch(startQuiz({ type: 'mock' }));
      const state = store.getState().quiz;
      expect(state.activeQuiz?.quizId).toBe('quiz-camel');
      expect(state.activeQuiz?.timeLimit).toBe(1800);
    });

    // Branch coverage: startQuiz with missing keys defaults (lines 19-20, 24)
    it('startQuiz defaults missing keys', async () => {
      mockedQuizzesApi.start.mockResolvedValue({
        data: {},
      });
      const store = createTestStore();
      await store.dispatch(startQuiz({ type: 'mock' }));
      const state = store.getState().quiz;
      expect(state.activeQuiz?.quizId).toBe('');
      expect(state.activeQuiz?.questions).toEqual([]);
      expect(state.activeQuiz?.timeLimit).toBeNull();
      expect(state.activeQuiz?.currentIndex).toBe(0);
      expect(state.activeQuiz?.answers).toEqual({});
    });

    // Branch coverage: submitQuiz maps camelCase response (lines 43-46)
    it('submitQuiz maps camelCase response keys', async () => {
      mockedQuizzesApi.submit.mockResolvedValue({
        data: {
          quizId: 'quiz-camel',
          score: 5,
          total: 10,
          passed: true,
        },
      });
      const store = createTestStore();
      await store.dispatch(submitQuiz({ quizId: 'quiz-camel', answers: { q1: 'a' } }));
      const state = store.getState().quiz;
      expect(state.activeQuiz).toBeNull();
      expect(state.loading).toBe(false);
    });

    // Branch coverage: submitQuiz with missing keys defaults (lines 43-46)
    it('submitQuiz defaults missing keys', async () => {
      mockedQuizzesApi.submit.mockResolvedValue({
        data: {},
      });
      const store = createTestStore();
      await store.dispatch(submitQuiz({ quizId: 'quiz-1', answers: {} }));
      const state = store.getState().quiz;
      expect(state.activeQuiz).toBeNull();
      expect(state.loading).toBe(false);
    });

    // Branch coverage: fetchQuizResults with camelCase result keys (lines 61-74, 79-82)
    it('fetchQuizResults maps camelCase result keys', async () => {
      mockedQuizzesApi.getResult.mockResolvedValue({
        data: {
          quiz: { id: 'quiz-2', score: 3, total: 5, passed: true },
          results: [
            {
              id: 'q1',
              text: 'Question 1',
              options: [{ id: 'a', text: 'A' }],
              correctOptionId: 'a',
              explanation: 'Because A',
              user_answer: 'a',
            },
            {
              id: 'q2',
              text: 'Question 2',
              options: [{ id: 'b', text: 'B' }],
              correctOptionId: 'b',
              explanation: 'Because B',
            },
          ],
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchQuizResults('quiz-2'));
      const state = store.getState().quiz;
      expect(state.result?.quizId).toBe('quiz-2');
      expect(state.result?.score).toBe(3);
      expect(state.result?.total).toBe(5);
      expect(state.result?.passed).toBe(true);
      expect(state.result?.questions).toHaveLength(2);
      expect(state.result?.questions[0].correctOptionId).toBe('a');
      expect(state.result?.answers['q1']).toBe('a');
      // q2 has no user_answer, so it should not be in answers
      expect(state.result?.answers['q2']).toBeUndefined();
    });

    // Branch coverage: fetchQuizResults with missing quiz/results keys (lines 61-74, 79-82)
    it('fetchQuizResults defaults missing keys', async () => {
      mockedQuizzesApi.getResult.mockResolvedValue({
        data: {},
      });
      const store = createTestStore();
      await store.dispatch(fetchQuizResults('quiz-fallback'));
      const state = store.getState().quiz;
      expect(state.result?.quizId).toBe('quiz-fallback');
      expect(state.result?.score).toBe(0);
      expect(state.result?.total).toBe(0);
      expect(state.result?.passed).toBe(false);
      expect(state.result?.questions).toEqual([]);
      expect(state.result?.answers).toEqual({});
    });

    // Branch coverage: fetchQuizResults with results missing individual fields
    it('fetchQuizResults defaults missing result item fields', async () => {
      mockedQuizzesApi.getResult.mockResolvedValue({
        data: {
          quiz: {},
          results: [{}],
        },
      });
      const store = createTestStore();
      await store.dispatch(fetchQuizResults('quiz-3'));
      const state = store.getState().quiz;
      expect(state.result?.questions[0]).toEqual({
        id: '',
        text: '',
        options: [],
        correctOptionId: '',
        explanation: '',
      });
      // Empty id maps to '' key, but no user_answer so answers should be empty
      expect(state.result?.answers).toEqual({});
    });
  });
});
