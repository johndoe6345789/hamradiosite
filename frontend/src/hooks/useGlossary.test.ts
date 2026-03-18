import { renderHook, waitFor } from '@testing-library/react';
import useGlossary from './useGlossary';
import { glossaryApi } from '@/lib/apiClient';

jest.mock('@/lib/apiClient', () => ({
  glossaryApi: { getAll: jest.fn() },
}));

describe('useGlossary', () => {
  it('returns glossary entries', async () => {
    const entries = [{ id: '1', term: 'Ofcom', definition: 'UK regulator' }];
    (glossaryApi.getAll as jest.Mock).mockResolvedValue({ data: { glossary: entries } });

    const { result } = renderHook(() => useGlossary());
    await waitFor(() => expect(result.current).toEqual(entries));
  });

  it('returns empty array on error', async () => {
    (glossaryApi.getAll as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useGlossary());
    await waitFor(() => expect(result.current).toEqual([]));
  });
});
