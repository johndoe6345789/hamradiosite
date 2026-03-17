import { renderHook, act } from '@testing-library/react';
import useLanguageSwitcher, { LOCALES } from './useLanguageSwitcher';

const mockReplace = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/some-path',
}));

describe('LOCALES', () => {
  it('has 6 locale entries', () => {
    expect(LOCALES).toHaveLength(6);
  });

  it('each locale has code and label', () => {
    LOCALES.forEach((locale) => {
      expect(typeof locale.code).toBe('string');
      expect(typeof locale.label).toBe('string');
    });
  });

  it('contains en as first locale', () => {
    expect(LOCALES[0].code).toBe('en');
  });
});

describe('useLanguageSwitcher', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('returns locale as "en"', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    expect(result.current.locale).toBe('en');
  });

  it('returns anchorEl as null initially', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    expect(result.current.anchorEl).toBeNull();
  });

  it('sets anchorEl on handleOpen', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    const fakeElement = document.createElement('button');

    act(() => {
      result.current.handleOpen({ currentTarget: fakeElement } as React.MouseEvent<HTMLElement>);
    });

    expect(result.current.anchorEl).toBe(fakeElement);
  });

  it('clears anchorEl on handleClose', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    const fakeElement = document.createElement('button');

    act(() => {
      result.current.handleOpen({ currentTarget: fakeElement } as React.MouseEvent<HTMLElement>);
    });

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.anchorEl).toBeNull();
  });

  it('calls router.replace and closes menu on handleLocaleChange', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    const fakeElement = document.createElement('button');

    act(() => {
      result.current.handleOpen({ currentTarget: fakeElement } as React.MouseEvent<HTMLElement>);
    });

    act(() => {
      result.current.handleLocaleChange('cy');
    });

    expect(mockReplace).toHaveBeenCalledWith('/some-path', { locale: 'cy' });
    expect(result.current.anchorEl).toBeNull();
  });

  it('returns a translation function t', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    expect(typeof result.current.t).toBe('function');
  });
});
