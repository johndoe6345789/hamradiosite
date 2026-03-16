import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import Sidebar from './Sidebar';

jest.mock('next/navigation', () => ({
  useParams: () => ({ topicSlug: 'technical-basics' }),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Sidebar', () => {
  it('renders all topics', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Licensing Conditions')).toBeInTheDocument();
    expect(screen.getByText('Technical Basics')).toBeInTheDocument();
    expect(screen.getByText('Transmitters & Receivers')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
  });

  it('renders the topics heading', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Study Topics')).toBeInTheDocument();
  });

  it('shows active indicator for current topic', () => {
    renderWithProviders(<Sidebar />);
    const technicalBasicsLink = screen.getByText('Technical Basics').closest('a');
    expect(technicalBasicsLink).toHaveAttribute('href', '/learn/technical-basics');
  });
});
