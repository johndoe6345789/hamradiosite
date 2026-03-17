import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import MobileDrawer from './MobileDrawer';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockT = (key: string) => {
  const map: Record<string, string> = {
    learn: 'Learn',
    quiz: 'Quiz',
    progress: 'Progress',
    about: 'About',
    bookmarks: 'Bookmarks',
  };
  return map[key] ?? key;
};

const mockTc = (key: string) => {
  const map: Record<string, string> = {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
  };
  return map[key] ?? key;
};

describe('MobileDrawer', () => {
  const defaultProps = {
    isAdmin: false,
    isAuthenticated: false,
    t: mockT,
    tc: mockTc,
    onClose: jest.fn(),
    onLogout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the HamPrep title', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} />);
    expect(screen.getByText('HamPrep')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} />);
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
  });

  it('does not render Admin link when isAdmin is false', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} isAdmin={false} />);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('renders Admin link when isAdmin is true', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} isAdmin={true} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    const adminLink = screen.getByText('Admin').closest('a');
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('renders Login and Register links when not authenticated', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} isAuthenticated={false} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('renders Logout button when authenticated', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} isAuthenticated={true} />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('calls onClose when the container box is clicked', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} />);
    fireEvent.click(screen.getByText('HamPrep'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onLogout when logout button is clicked', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} isAuthenticated={true} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(defaultProps.onLogout).toHaveBeenCalled();
  });

  it('renders nav links with correct hrefs', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} />);
    expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/learn');
    expect(screen.getByText('Quiz').closest('a')).toHaveAttribute('href', '/quiz');
    expect(screen.getByText('Progress').closest('a')).toHaveAttribute('href', '/progress');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Bookmarks').closest('a')).toHaveAttribute('href', '/bookmarks');
  });

  it('renders Login and Register with correct hrefs when not authenticated', () => {
    renderWithProviders(<MobileDrawer {...defaultProps} isAuthenticated={false} />);
    expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login');
    expect(screen.getByText('Register').closest('a')).toHaveAttribute('href', '/register');
  });
});
