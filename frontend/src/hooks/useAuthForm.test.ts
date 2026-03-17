import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import { useLoginForm, useRegisterForm } from './useAuthForm';

const mockPush = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/lib/apiClient', () => ({
  authApi: {
    login: (...args: unknown[]) => mockLogin(...args),
    register: (...args: unknown[]) => mockRegister(...args),
    logout: (...args: unknown[]) => mockLogout(...args),
    refresh: jest.fn(),
  },
}));

function createWrapper(preloadedState = {}) {
  const store = createTestStore(preloadedState);
  return {
    store,
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children),
  };
}

describe('useLoginForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogin.mockClear();
  });

  it('returns initial state', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('updates email via setEmail', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.email).toBe('test@example.com');
  });

  it('updates password via setPassword', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setPassword('secret');
    });

    expect(result.current.password).toBe('secret');
  });

  it('sets field errors on validation failure', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(Object.keys(result.current.fieldErrors).length).toBeGreaterThan(0);
  });

  it('dispatches loginUser and navigates on success', async () => {
    mockLogin.mockResolvedValue({
      data: { user: { id: '1', username: 'test', email: 'test@test.com', role: 'user' }, access_token: 'tok', refresh_token: 'ref' },
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setEmail('test@test.com');
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'secret123' });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('does not navigate on login failure', async () => {
    mockLogin.mockRejectedValue({ response: { data: { message: 'Bad creds' } } });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setEmail('test@test.com');
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('clearError dispatches clearError action', () => {
    const { wrapper, store } = createWrapper({ auth: { error: 'some error' } });
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.clearError();
    });

    expect(store.getState().auth.error).toBeNull();
  });
});

describe('useRegisterForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRegister.mockClear();
  });

  it('returns initial state', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    expect(result.current.username).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.confirmPassword).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });

  it('updates username via setUsername', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setUsername('newuser');
    });

    expect(result.current.username).toBe('newuser');
  });

  it('updates email via setEmail', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.email).toBe('test@example.com');
  });

  it('updates password via setPassword', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setPassword('Password1');
    });

    expect(result.current.password).toBe('Password1');
  });

  it('updates confirmPassword via setConfirmPassword', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setConfirmPassword('Password1');
    });

    expect(result.current.confirmPassword).toBe('Password1');
  });

  it('sets field error when passwords do not match', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setUsername('testuser');
      result.current.setEmail('test@test.com');
      result.current.setPassword('Password1');
      result.current.setConfirmPassword('Different1');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(result.current.fieldErrors).toHaveProperty('confirmPassword');
  });

  it('sets field errors on zod validation failure', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setUsername('ab');
      result.current.setEmail('bad');
      result.current.setPassword('weak');
      result.current.setConfirmPassword('weak');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(Object.keys(result.current.fieldErrors).length).toBeGreaterThan(0);
  });

  it('dispatches registerUser and navigates on success', async () => {
    mockRegister.mockResolvedValue({
      data: { user: { id: '1', username: 'testuser', email: 'test@test.com', role: 'user' }, access_token: 'tok', refresh_token: 'ref' },
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setUsername('testuser');
      result.current.setEmail('test@test.com');
      result.current.setPassword('Password1');
      result.current.setConfirmPassword('Password1');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(mockRegister).toHaveBeenCalledWith({ username: 'testuser', email: 'test@test.com', password: 'Password1' });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('does not navigate on register failure', async () => {
    mockRegister.mockRejectedValue({ response: { data: { message: 'User exists' } } });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.setUsername('testuser');
      result.current.setEmail('test@test.com');
      result.current.setPassword('Password1');
      result.current.setConfirmPassword('Password1');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('clearError dispatches clearError action', () => {
    const { wrapper, store } = createWrapper({ auth: { error: 'some error' } });
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    act(() => {
      result.current.clearError();
    });

    expect(store.getState().auth.error).toBeNull();
  });
});
