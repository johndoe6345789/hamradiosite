import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import LoginForm from './LoginForm';
import { authApi } from '@/lib/apiClient';

const mockPush = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/apiClient', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

describe('LoginForm', () => {
  const setClipboard = (readText: jest.Mock) => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { readText },
    });
  };

  it('renders email and password fields', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the login button', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders the sign up link', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('displays error from Redux state', () => {
    renderWithProviders(<LoginForm />, {
      preloadedState: {
        auth: { error: 'Invalid credentials' },
      },
    });
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('clears error when alert close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />, {
      preloadedState: {
        auth: { error: 'Some error' },
      },
    });
    expect(screen.getByText('Some error')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    });
  });

  it('shows loading state when submitting', () => {
    renderWithProviders(<LoginForm />, {
      preloadedState: {
        auth: { loading: true },
      },
    });
    const submitButton = screen.getByRole('button', { name: /log in/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('dispatches loginUser and navigates on successful submission', async () => {
    const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
    mockAuthApi.login.mockResolvedValueOnce({
      data: {
        user: { id: '1', username: 'testuser', email: 'test@example.com', createdAt: '2024-01-01' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    } as never);

    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('does not navigate when login is rejected', async () => {
    const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
    mockAuthApi.login.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    mockPush.mockClear();
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it.each([
    ['', /clipboard is empty/i],
    ['not-json', /valid turbologin json/i],
    [JSON.stringify({ user: 'user@example.com' }), /missing required fields/i],
  ])('rejects invalid Turbologin clipboard data', async (clipboard, message) => {
    const user = userEvent.setup();
    setClipboard(jest.fn().mockResolvedValue(clipboard));
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByTestId('turbo-login-button'));

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it('logs in with valid Turbologin clipboard data', async () => {
    const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
    mockAuthApi.login.mockResolvedValueOnce({
      data: {
        user: { id: '1', username: 'turbo', email: 'turbo@example.com', createdAt: '2024-01-01' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    } as never);
    const user = userEvent.setup();
    setClipboard(jest.fn().mockResolvedValue(JSON.stringify({
      user: 'turbo@example.com',
      pass: 'Password123',
    })));
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByTestId('turbo-login-button'));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('reports clipboard permission failures', async () => {
    const user = userEvent.setup();
    setClipboard(jest.fn().mockRejectedValue(new Error('denied')));
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByTestId('turbo-login-button'));

    expect(await screen.findByText(/could not read clipboard/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/could not read clipboard/i)).not.toBeInTheDocument();
    });
  });
});
