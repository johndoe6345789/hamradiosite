import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import useHeader, { NAV_ITEMS } from './useHeader';

const mockPush = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/apiClient', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn().mockResolvedValue({}),
    refresh: jest.fn(),
  },
}));

describe('NAV_ITEMS', () => {
  it('has 5 navigation items', () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });

  it('each item has labelKey and href', () => {
    NAV_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('labelKey');
      expect(item).toHaveProperty('href');
    });
  });
});

describe('useHeader', () => {
  function createWrapper(preloadedState = {}) {
    const store = createTestStore(preloadedState);
    return {
      store,
      wrapper: ({ children }: { children: React.ReactNode }) =>
        React.createElement(Provider, { store }, children),
    };
  }

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('returns mobileOpen as false initially', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(result.current.mobileOpen).toBe(false);
  });

  it('toggles mobileOpen on handleDrawerToggle', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useHeader(), { wrapper });

    act(() => {
      result.current.handleDrawerToggle();
    });
    expect(result.current.mobileOpen).toBe(true);

    act(() => {
      result.current.handleDrawerToggle();
    });
    expect(result.current.mobileOpen).toBe(false);
  });

  it('returns isAuthenticated false when no user is logged in', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated true when user is logged in', () => {
    const { wrapper } = createWrapper({
      auth: { isAuthenticated: true, user: { id: '1', username: 'test', email: 'test@test.com', role: 'user' } },
    });
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns isAdmin false when user role is not admin', () => {
    const { wrapper } = createWrapper({
      auth: { isAuthenticated: true, user: { id: '1', username: 'test', email: 'test@test.com', role: 'user' } },
    });
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(result.current.isAdmin).toBe(false);
  });

  it('returns isAdmin true when user role is admin', () => {
    const { wrapper } = createWrapper({
      auth: { isAuthenticated: true, user: { id: '1', username: 'admin', email: 'admin@test.com', role: 'admin' } },
    });
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(result.current.isAdmin).toBe(true);
  });

  it('returns isAdmin false when user is null', () => {
    const { wrapper } = createWrapper({ auth: { user: null } });
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(result.current.isAdmin).toBe(false);
  });

  it('dispatches logoutUser and navigates to "/" on handleLogout', () => {
    const { wrapper } = createWrapper({
      auth: { isAuthenticated: true, user: { id: '1', username: 'test', email: 'test@test.com', role: 'user' } },
    });
    const { result } = renderHook(() => useHeader(), { wrapper });

    act(() => {
      result.current.handleLogout();
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('returns translation functions t and tc', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useHeader(), { wrapper });
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.tc).toBe('function');
  });
});
