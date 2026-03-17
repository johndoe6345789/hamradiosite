import { renderWithProviders, screen } from '@/test/test-utils';
import ExamFormatCard from './ExamFormatCard';

describe('ExamFormatCard', () => {
  it('renders the title', () => {
    renderWithProviders(<ExamFormatCard title="Exam Format" items={[]} />);
    expect(screen.getByText('Exam Format')).toBeInTheDocument();
  });

  it('renders all list items', () => {
    const items = ['25 questions', '55 minutes', 'Multiple choice'];
    renderWithProviders(<ExamFormatCard title="Format" items={items} />);
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders with an empty items array', () => {
    renderWithProviders(<ExamFormatCard title="Empty" items={[]} />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});
