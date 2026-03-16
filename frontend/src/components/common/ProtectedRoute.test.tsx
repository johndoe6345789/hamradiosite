import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ProtectedRoute from './ProtectedRoute';

const mockPush = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders children when authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            user: { id: '1', username: 'test', email: 'test@example.com', createdAt: '2024-01-01' },
            accessToken: 'token',
            refreshToken: 'refresh',
          },
        },
      }
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: false, loading: false },
        },
      }
    );
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('does not render children when not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: false, loading: false },
        },
      }
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading spinner when auth is loading', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: { isAuthenticated: false, loading: true },
        },
      }
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
