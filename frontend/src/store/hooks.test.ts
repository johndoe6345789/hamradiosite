import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import { useAppDispatch, useAppSelector } from './hooks';

describe('useAppDispatch', () => {
  it('returns a dispatch function', () => {
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);

    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });
});

describe('useAppSelector', () => {
  it('selects state from the store', () => {
    const store = createTestStore({ auth: { isAuthenticated: true } });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);

    const { result } = renderHook(() => useAppSelector((state) => state.auth.isAuthenticated), { wrapper });
    expect(result.current).toBe(true);
  });

  it('selects default state when no preloaded state', () => {
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);

    const { result } = renderHook(() => useAppSelector((state) => state.auth.isAuthenticated), { wrapper });
    expect(result.current).toBe(false);
  });
});
