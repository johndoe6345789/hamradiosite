import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import RegisterForm from './RegisterForm';
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
    register: jest.fn(),
  },
}));

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<RegisterForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('renders the register button', () => {
    renderWithProviders(<RegisterForm />);
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('renders the login link', () => {
    renderWithProviders(<RegisterForm />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('shows password mismatch error', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password2');
    await user.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);
    await user.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/username must contain only letters and numbers/i)).toBeInTheDocument();
    });
  });

  it('displays error from Redux state', () => {
    renderWithProviders(<RegisterForm />, {
      preloadedState: {
        auth: { error: 'Email already exists' },
      },
    });
    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  it('clears error when alert close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />, {
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

  it('disables button when loading', () => {
    renderWithProviders(<RegisterForm />, {
      preloadedState: {
        auth: { loading: true },
      },
    });
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('dispatches registerUser and navigates on successful submission', async () => {
    const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
    mockAuthApi.register.mockResolvedValueOnce({
      data: {
        user: { id: '1', username: 'testuser', email: 'test@example.com', createdAt: '2024-01-01' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    } as never);

    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('does not navigate when registration is rejected', async () => {
    const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
    mockAuthApi.register.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    mockPush.mockClear();
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
