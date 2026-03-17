import { renderHook, act, waitFor } from '@testing-library/react';
import useAdminTranslations from './useAdminTranslations';

const mockGetTranslations = jest.fn();
const mockUpdateTranslations = jest.fn();

jest.mock('@/lib/apiClient', () => ({
  adminApi: {
    getTranslations: (...args: unknown[]) => mockGetTranslations(...args),
    updateTranslations: (...args: unknown[]) => mockUpdateTranslations(...args),
  },
}));

describe('useAdminTranslations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches translations on mount', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { greeting: 'Hello' }, fr: { greeting: 'Bonjour' } } },
    });

    const { result } = renderHook(() => useAdminTranslations());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.translations).toEqual({
      en: { greeting: 'Hello' },
      fr: { greeting: 'Bonjour' },
    });
    expect(result.current.locales).toEqual(['en', 'fr']);
    expect(result.current.error).toBeNull();
  });

  it('sets error when fetch fails with Error', async () => {
    mockGetTranslations.mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Fetch failed');
  });

  it('sets fallback error when fetch fails with non-Error', async () => {
    mockGetTranslations.mockRejectedValue('string error');

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load translations');
  });

  it('handleChange updates a nested translation value and clears success', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { nav: { home: 'Home' } } } },
    });

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleChange('en', 'nav.home', 'Homepage');
    });

    expect((result.current.translations.en as Record<string, Record<string, string>>).nav.home).toBe('Homepage');
  });

  it('handleChange updates a top-level translation value', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { title: 'Old Title' } } },
    });

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleChange('en', 'title', 'New Title');
    });

    expect((result.current.translations.en as Record<string, string>).title).toBe('New Title');
  });

  it('handleSave saves translations and sets success', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { greeting: 'Hello' } } },
    });
    mockUpdateTranslations.mockResolvedValue({});

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave('en');
    });

    expect(mockUpdateTranslations).toHaveBeenCalledWith('en', { greeting: 'Hello' });
    expect(result.current.success).toBe('Translations for "en" saved successfully');
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('handleSave sets error when save fails with Error', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { greeting: 'Hello' } } },
    });
    mockUpdateTranslations.mockRejectedValue(new Error('Save failed'));

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave('en');
    });

    expect(result.current.error).toBe('Save failed');
    expect(result.current.success).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('handleSave sets fallback error when save fails with non-Error', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { greeting: 'Hello' } } },
    });
    mockUpdateTranslations.mockRejectedValue('string error');

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave('en');
    });

    expect(result.current.error).toBe('Failed to save translations');
    expect(result.current.success).toBeNull();
  });

  it('setActiveTab updates the active tab', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: {}, fr: {} } },
    });

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.activeTab).toBe(0);

    act(() => {
      result.current.setActiveTab(1);
    });

    expect(result.current.activeTab).toBe(1);
  });

  it('handleChange clears previous success message', async () => {
    mockGetTranslations.mockResolvedValue({
      data: { translations: { en: { greeting: 'Hello' } } },
    });
    mockUpdateTranslations.mockResolvedValue({});

    const { result } = renderHook(() => useAdminTranslations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave('en');
    });

    expect(result.current.success).not.toBeNull();

    act(() => {
      result.current.handleChange('en', 'greeting', 'Hi');
    });

    expect(result.current.success).toBeNull();
  });
});
