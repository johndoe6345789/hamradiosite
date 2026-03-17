import { renderHook, waitFor } from '@testing-library/react';
import useTopics from './useTopics';

const mockGetAll = jest.fn();

jest.mock('@/lib/apiClient', () => ({
  topicsApi: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
  },
}));

describe('useTopics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches topics on mount and sets topics array from data.topics', async () => {
    const topics = [
      { id: '1', title: 'Topic 1', slug: 'topic-1', description: 'Desc 1', icon: '', order: 1 },
      { id: '2', title: 'Topic 2', slug: 'topic-2', description: 'Desc 2', icon: '', order: 2 },
    ];
    mockGetAll.mockResolvedValue({ data: { topics } });

    const { result } = renderHook(() => useTopics());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topics).toEqual(topics);
  });

  it('handles response when data is an array directly', async () => {
    const topics = [
      { id: '1', title: 'Topic 1', slug: 'topic-1', description: 'Desc 1', icon: '', order: 1 },
    ];
    mockGetAll.mockResolvedValue({ data: topics });

    const { result } = renderHook(() => useTopics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topics).toEqual(topics);
  });

  it('defaults to empty array when data.topics is missing and data is not an array', async () => {
    mockGetAll.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useTopics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topics).toEqual([]);
  });

  it('sets empty topics on fetch error', async () => {
    mockGetAll.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTopics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topics).toEqual([]);
  });

  it('starts with loading=true and empty topics', () => {
    mockGetAll.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useTopics());

    expect(result.current.loading).toBe(true);
    expect(result.current.topics).toEqual([]);
  });
});
