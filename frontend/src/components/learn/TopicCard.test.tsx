import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import TopicCard from './TopicCard';
import type { Topic } from '@/types/topic';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockTopic: Topic = {
  id: '1',
  title: 'Licensing Conditions',
  slug: 'licensing-conditions',
  description: 'Learn about the terms and conditions of the licence.',
  icon: 'Gavel',
  order: 1,
};

describe('TopicCard', () => {
  it('renders the topic title', () => {
    renderWithProviders(<TopicCard topic={mockTopic} />);
    expect(screen.getByText('Licensing Conditions')).toBeInTheDocument();
  });

  it('renders the topic description', () => {
    renderWithProviders(<TopicCard topic={mockTopic} />);
    expect(screen.getByText('Learn about the terms and conditions of the licence.')).toBeInTheDocument();
  });

  it('links to the topic detail page', () => {
    renderWithProviders(<TopicCard topic={mockTopic} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/learn/licensing-conditions');
  });

  it('renders with an icon', () => {
    renderWithProviders(<TopicCard topic={mockTopic} />);
    expect(screen.getByTestId('GavelIcon')).toBeInTheDocument();
  });

  it('falls back to SchoolIcon for unknown icon name', () => {
    const topicWithUnknownIcon: Topic = {
      ...mockTopic,
      icon: 'UnknownIcon',
    };
    renderWithProviders(<TopicCard topic={topicWithUnknownIcon} />);
    expect(screen.getByTestId('SchoolIcon')).toBeInTheDocument();
  });

  it('shows read more text when progress > 0', () => {
    renderWithProviders(<TopicCard topic={mockTopic} progress={50} />);
    expect(screen.getByText('Read More')).toBeInTheDocument();
  });

  it('does not show read more text when progress is 0', () => {
    renderWithProviders(<TopicCard topic={mockTopic} progress={0} />);
    expect(screen.queryByText('Read More')).not.toBeInTheDocument();
  });

  it('does not show read more text when progress is undefined', () => {
    renderWithProviders(<TopicCard topic={mockTopic} />);
    expect(screen.queryByText('Read More')).not.toBeInTheDocument();
  });
});
