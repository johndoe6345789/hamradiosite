import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  clearError,
  resetAuth,
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
} from './authSlice';
import type { AuthState, AuthResponse } from '@/types/auth';
import { authApi } from '@/lib/apiClient';

jest.mock('@/lib/apiClient', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  },
}));

const mockAuthResponse: AuthResponse = {
  user: {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
  },
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
};

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const stateWithError: AuthState = { ...initialState, error: 'Some error' };
    const state = authReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  it('should handle resetAuth', () => {
    const authenticatedState: AuthState = {
      ...initialState,
      user: mockAuthResponse.user,
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
    };
    const state = authReducer(authenticatedState, resetAuth());
    expect(state).toEqual(initialState);
  });

  describe('loginUser', () => {
    it('should set loading on pending', () => {
      const state = authReducer(initialState, loginUser.pending('', { email: '', password: '' }));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user on fulfilled', () => {
      const state = authReducer(
        initialState,
        loginUser.fulfilled(mockAuthResponse, '', { email: '', password: '' })
      );
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.accessToken).toBe(mockAuthResponse.accessToken);
      expect(state.refreshToken).toBe(mockAuthResponse.refreshToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set error on rejected', () => {
      const state = authReducer(
        initialState,
        loginUser.rejected(new Error('fail'), '', { email: '', password: '' }, 'Invalid credentials')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('should set loading on pending', () => {
      const state = authReducer(
        initialState,
        registerUser.pending('', { username: '', email: '', password: '' })
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user on fulfilled', () => {
      const state = authReducer(
        initialState,
        registerUser.fulfilled(mockAuthResponse, '', {
          username: '',
          email: '',
          password: '',
        })
      );
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set error on rejected', () => {
      const state = authReducer(
        initialState,
        registerUser.rejected(
          new Error('fail'),
          '',
          { username: '', email: '', password: '' },
          'Email already exists'
        )
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Email already exists');
    });
  });

  describe('logoutUser', () => {
    const authenticatedState: AuthState = {
      ...initialState,
      user: mockAuthResponse.user,
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
    };

    it('should set loading on pending', () => {
      const state = authReducer(authenticatedState, logoutUser.pending('', undefined));
      expect(state.loading).toBe(true);
    });

    it('should reset state on fulfilled', () => {
      const state = authReducer(authenticatedState, logoutUser.fulfilled(undefined, '', undefined));
      expect(state).toEqual(initialState);
    });

    it('should set error on rejected', () => {
      const state = authReducer(
        authenticatedState,
        logoutUser.rejected(new Error('fail'), '', undefined, 'Logout failed')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('refreshAccessToken', () => {
    it('should set loading on pending', () => {
      const state = authReducer(initialState, refreshAccessToken.pending('', 'refresh-token'));
      expect(state.loading).toBe(true);
    });

    it('should update tokens on fulfilled', () => {
      const state = authReducer(
        initialState,
        refreshAccessToken.fulfilled(mockAuthResponse, '', 'refresh-token')
      );
      expect(state.loading).toBe(false);
      expect(state.accessToken).toBe(mockAuthResponse.accessToken);
      expect(state.refreshToken).toBe(mockAuthResponse.refreshToken);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should reset state on rejected', () => {
      const authenticatedState: AuthState = {
        ...initialState,
        user: mockAuthResponse.user,
        isAuthenticated: true,
      };
      const state = authReducer(
        authenticatedState,
        refreshAccessToken.rejected(new Error('fail'), '', 'refresh-token', 'Refresh failed')
      );
      expect(state).toEqual(initialState);
    });
  });

  describe('thunk execution', () => {
    const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

    function createTestStore() {
      return configureStore({ reducer: { auth: authReducer } });
    }

    beforeEach(() => {
      jest.clearAllMocks();
      Storage.prototype.setItem = jest.fn();
      Storage.prototype.removeItem = jest.fn();
    });

    // loginUser
    it('loginUser success', async () => {
      mockedAuthApi.login.mockResolvedValue({ data: mockAuthResponse });
      const store = createTestStore();
      await store.dispatch(loginUser({ email: 'test@test.com', password: 'pass' }));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.accessToken).toBe(mockAuthResponse.accessToken);
      expect(state.refreshToken).toBe(mockAuthResponse.refreshToken);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('loginUser failure with response message', async () => {
      mockedAuthApi.login.mockRejectedValue({ response: { data: { message: 'Bad credentials' } } });
      const store = createTestStore();
      await store.dispatch(loginUser({ email: 'test@test.com', password: 'wrong' }));
      expect(store.getState().auth.error).toBe('Bad credentials');
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    it('loginUser failure with fallback message', async () => {
      mockedAuthApi.login.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(loginUser({ email: 'test@test.com', password: 'wrong' }));
      expect(store.getState().auth.error).toBe('Login failed');
    });

    // registerUser
    it('registerUser success', async () => {
      mockedAuthApi.register.mockResolvedValue({ data: mockAuthResponse });
      const store = createTestStore();
      await store.dispatch(registerUser({ username: 'test', email: 'test@test.com', password: 'pass' }));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.accessToken).toBe(mockAuthResponse.accessToken);
    });

    it('registerUser failure with response message', async () => {
      mockedAuthApi.register.mockRejectedValue({ response: { data: { message: 'Email taken' } } });
      const store = createTestStore();
      await store.dispatch(registerUser({ username: 'test', email: 'test@test.com', password: 'pass' }));
      expect(store.getState().auth.error).toBe('Email taken');
    });

    it('registerUser failure with fallback message', async () => {
      mockedAuthApi.register.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(registerUser({ username: 'test', email: 'test@test.com', password: 'pass' }));
      expect(store.getState().auth.error).toBe('Registration failed');
    });

    // logoutUser
    it('logoutUser success', async () => {
      mockedAuthApi.logout.mockResolvedValue({});
      const store = createTestStore();
      await store.dispatch(logoutUser());
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('logoutUser failure with response message', async () => {
      mockedAuthApi.logout.mockRejectedValue({ response: { data: { message: 'Server error' } } });
      const store = createTestStore();
      await store.dispatch(logoutUser());
      expect(store.getState().auth.error).toBe('Server error');
    });

    it('logoutUser failure with fallback message', async () => {
      mockedAuthApi.logout.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(logoutUser());
      expect(store.getState().auth.error).toBe('Logout failed');
    });

    // refreshAccessToken
    it('refreshAccessToken success', async () => {
      mockedAuthApi.refresh.mockResolvedValue({ data: mockAuthResponse });
      const store = createTestStore();
      await store.dispatch(refreshAccessToken('old-refresh-token'));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe(mockAuthResponse.accessToken);
      expect(state.refreshToken).toBe(mockAuthResponse.refreshToken);
    });

    it('refreshAccessToken failure with response message', async () => {
      mockedAuthApi.refresh.mockRejectedValue({ response: { data: { message: 'Token expired' } } });
      const store = createTestStore();
      await store.dispatch(refreshAccessToken('bad-token'));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('refreshAccessToken failure with fallback message', async () => {
      mockedAuthApi.refresh.mockRejectedValue(new Error('Network error'));
      const store = createTestStore();
      await store.dispatch(refreshAccessToken('bad-token'));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    // mapAuthResponse branch coverage: snake_case keys (access_token, refresh_token)
    it('loginUser success with snake_case response keys', async () => {
      mockedAuthApi.login.mockResolvedValue({
        data: {
          user: mockAuthResponse.user,
          access_token: 'snake-access',
          refresh_token: 'snake-refresh',
        },
      });
      const store = createTestStore();
      await store.dispatch(loginUser({ email: 'test@test.com', password: 'pass' }));
      const state = store.getState().auth;
      expect(state.accessToken).toBe('snake-access');
      expect(state.refreshToken).toBe('snake-refresh');
      expect(state.isAuthenticated).toBe(true);
    });

    // mapAuthResponse branch coverage: missing user and token keys fallback to defaults
    it('loginUser success with missing keys uses defaults', async () => {
      mockedAuthApi.login.mockResolvedValue({
        data: {},
      });
      const store = createTestStore();
      await store.dispatch(loginUser({ email: 'test@test.com', password: 'pass' }));
      const state = store.getState().auth;
      expect(state.user).toEqual({});
      expect(state.accessToken).toBe('');
      expect(state.refreshToken).toBe('');
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
