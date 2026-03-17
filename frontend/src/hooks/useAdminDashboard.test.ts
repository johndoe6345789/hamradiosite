import { renderHook, waitFor } from '@testing-library/react';
import useAdminDashboard from './useAdminDashboard';

const mockGetUsers = jest.fn();
const mockGetQuestions = jest.fn();
const mockGetTopics = jest.fn();
const mockGetTranslations = jest.fn();

jest.mock('@/lib/apiClient', () => ({
  adminApi: {
    getUsers: (...args: unknown[]) => mockGetUsers(...args),
    getQuestions: (...args: unknown[]) => mockGetQuestions(...args),
    getTopics: (...args: unknown[]) => mockGetTopics(...args),
    getTranslations: (...args: unknown[]) => mockGetTranslations(...args),
  },
}));

describe('useAdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches counts from all admin endpoints on mount', async () => {
    mockGetUsers.mockResolvedValue({ data: { users: [{ id: '1' }, { id: '2' }] } });
    mockGetQuestions.mockResolvedValue({ data: { questions: [{ id: 'q1' }] } });
    mockGetTopics.mockResolvedValue({ data: { topics: [{ id: 't1' }, { id: 't2' }, { id: 't3' }] } });
    mockGetTranslations.mockResolvedValue({ data: { translations: { en: {}, fr: {} } } });

    const { result } = renderHook(() => useAdminDashboard());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.counts).toEqual({
      users: 2,
      questions: 1,
      topics: 3,
      translations: 2,
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error when any endpoint throws an Error', async () => {
    mockGetUsers.mockRejectedValue(new Error('Unauthorized'));
    mockGetQuestions.mockResolvedValue({ data: { questions: [] } });
    mockGetTopics.mockResolvedValue({ data: { topics: [] } });
    mockGetTranslations.mockResolvedValue({ data: { translations: {} } });

    const { result } = renderHook(() => useAdminDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Unauthorized');
  });

  it('sets fallback error message for non-Error exceptions', async () => {
    mockGetUsers.mockRejectedValue('unknown');
    mockGetQuestions.mockResolvedValue({ data: { questions: [] } });
    mockGetTopics.mockResolvedValue({ data: { topics: [] } });
    mockGetTranslations.mockResolvedValue({ data: { translations: {} } });

    const { result } = renderHook(() => useAdminDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load dashboard data');
  });

  it('returns initial counts as zeros while loading', () => {
    mockGetUsers.mockReturnValue(new Promise(() => {})); // never resolves
    mockGetQuestions.mockReturnValue(new Promise(() => {}));
    mockGetTopics.mockReturnValue(new Promise(() => {}));
    mockGetTranslations.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAdminDashboard());

    expect(result.current.counts).toEqual({
      users: 0,
      questions: 0,
      topics: 0,
      translations: 0,
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
