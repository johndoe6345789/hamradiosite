import { renderHook, waitFor } from '@testing-library/react';
import useTopicContent from './useTopicContent';

const mockGetBySlug = jest.fn();

jest.mock('@/lib/apiClient', () => ({
  topicsApi: {
    getBySlug: (...args: unknown[]) => mockGetBySlug(...args),
  },
}));

describe('useTopicContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches topic by slug and sets topic when response has topic wrapper', async () => {
    const topicData = {
      id: '1',
      title: 'Basics',
      slug: 'basics',
      description: 'Basics topic',
      content: '<p>Content</p>',
      icon: 'icon',
      order: 1,
    };
    mockGetBySlug.mockResolvedValue({ data: { topic: topicData } });

    const { result } = renderHook(() => useTopicContent('basics'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topic).toEqual(topicData);
    expect(mockGetBySlug).toHaveBeenCalledWith('basics');
  });

  it('sets topic directly when response has no topic wrapper', async () => {
    const topicData = {
      id: '2',
      title: 'Advanced',
      slug: 'advanced',
      description: 'Advanced topic',
      content: '<p>Advanced content</p>',
      icon: 'icon2',
      order: 2,
    };
    mockGetBySlug.mockResolvedValue({ data: topicData });

    const { result } = renderHook(() => useTopicContent('advanced'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topic).toEqual(topicData);
  });

  it('sets fallback topic on fetch error', async () => {
    mockGetBySlug.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useTopicContent('missing-topic'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.topic).toEqual({
      id: '',
      title: 'Topic',
      slug: 'missing-topic',
      description: '',
      content: '<p>Content not available.</p>',
      icon: '',
      order: 0,
    });
  });

  it('starts with loading=true and topic=null', () => {
    mockGetBySlug.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useTopicContent('pending'));

    expect(result.current.loading).toBe(true);
    expect(result.current.topic).toBeNull();
  });
});
