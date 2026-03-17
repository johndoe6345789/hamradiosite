import { renderHook, act, waitFor } from '@testing-library/react';
import useAdminCrud from './useAdminCrud';

interface TestItem {
  id: string;
  name: string;
}

describe('useAdminCrud', () => {
  const mockItems: TestItem[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  it('fetches data on mount and sets items', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual(mockItems);
    expect(result.current.error).toBeNull();
  });

  it('sets error when fetchFn throws an Error', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.items).toEqual([]);
  });

  it('sets fallback error message when fetchFn throws non-Error', async () => {
    const fetchFn = jest.fn().mockRejectedValue('string error');
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load data');
  });

  it('confirmDelete sets itemToDelete and opens dialog', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.confirmDelete(mockItems[0]);
    });

    expect(result.current.deleteDialogOpen).toBe(true);
    expect(result.current.itemToDelete).toEqual(mockItems[0]);
  });

  it('closeDeleteDialog clears itemToDelete and closes dialog', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.confirmDelete(mockItems[0]);
    });

    expect(result.current.deleteDialogOpen).toBe(true);

    act(() => {
      result.current.closeDeleteDialog();
    });

    expect(result.current.deleteDialogOpen).toBe(false);
    expect(result.current.itemToDelete).toBeNull();
  });

  it('handleDelete calls deleteFn and re-fetches data', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn, deleteFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.confirmDelete(mockItems[0]);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteFn).toHaveBeenCalledWith('1');
    expect(result.current.deleteDialogOpen).toBe(false);
    expect(result.current.itemToDelete).toBeNull();
    // fetchFn called once on mount and once after delete
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('handleDelete does nothing when itemToDelete is null', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn, deleteFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(deleteFn).not.toHaveBeenCalled();
  });

  it('handleDelete does nothing when deleteFn is not provided', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.confirmDelete(mockItems[0]);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    // Should not throw; fetchFn not called again since deleteFn is absent
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('handleDelete sets error when deleteFn throws an Error', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const deleteFn = jest.fn().mockRejectedValue(new Error('Delete failed'));
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn, deleteFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.confirmDelete(mockItems[0]);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.error).toBe('Delete failed');
  });

  it('handleDelete sets fallback error when deleteFn throws non-Error', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const deleteFn = jest.fn().mockRejectedValue('string error');
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn, deleteFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.confirmDelete(mockItems[0]);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.error).toBe('Failed to delete');
  });

  it('exposes setError to clear or set error externally', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setError('Custom error');
    });

    expect(result.current.error).toBe('Custom error');

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });

  it('fetchData can be called manually to re-fetch', async () => {
    const fetchFn = jest.fn().mockResolvedValue(mockItems);
    const { result } = renderHook(() => useAdminCrud<TestItem>({ fetchFn }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.fetchData();
    });

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
