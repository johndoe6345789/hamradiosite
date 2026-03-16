import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import Header from './Header';

const mockPush = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));

jest.mock('@/lib/apiClient', () => ({
  authApi: {
    logout: jest.fn().mockResolvedValue({}),
  },
}));

describe('Header', () => {
  it('renders the logo text', () => {
    renderWithProviders(<Header />);
    const logos = screen.getAllByText('HamPrep');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    const learnLinks = screen.getAllByText('Learn');
    expect(learnLinks.length).toBeGreaterThan(0);
    const quizLinks = screen.getAllByText('Quiz');
    expect(quizLinks.length).toBeGreaterThan(0);
  });

  it('renders theme toggle button', () => {
    renderWithProviders(<Header />);
    expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
  });

  it('shows login and register when not authenticated', () => {
    renderWithProviders(<Header />, {
      preloadedState: { auth: { isAuthenticated: false } },
    });
    const loginButtons = screen.getAllByText('Log In');
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  it('shows logout when authenticated', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', username: 'testuser', email: 'test@example.com', createdAt: '2024-01-01' },
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      },
    });
    const logoutButtons = screen.getAllByText('Log Out');
    expect(logoutButtons.length).toBeGreaterThan(0);
  });

  it('opens mobile menu drawer when hamburger is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const menuButton = screen.getByLabelText('open menu');
    await user.click(menuButton);
    const drawerItems = screen.getAllByText('Learn');
    expect(drawerItems.length).toBeGreaterThanOrEqual(2);
  });

  it('dispatches logoutUser and navigates to / when logout is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', username: 'testuser', email: 'test@example.com', createdAt: '2024-01-01' },
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      },
    });

    const logoutButtons = screen.getAllByText('Log Out');
    await user.click(logoutButtons[0]);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
