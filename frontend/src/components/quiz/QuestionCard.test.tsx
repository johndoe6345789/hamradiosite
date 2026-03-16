import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import QuestionCard from './QuestionCard';

const mockQuestion = {
  id: 'q1',
  text: 'What is the maximum power output?',
  options: [
    { id: 'a', text: '5 watts' },
    { id: 'b', text: '10 watts' },
    { id: 'c', text: '25 watts' },
  ],
};

describe('QuestionCard', () => {
  it('renders the question text', () => {
    renderWithProviders(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        onSelectOption={() => {}}
      />
    );
    expect(screen.getByText('What is the maximum power output?')).toBeInTheDocument();
  });

  it('renders all answer options', () => {
    renderWithProviders(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        onSelectOption={() => {}}
      />
    );
    expect(screen.getByText('5 watts')).toBeInTheDocument();
    expect(screen.getByText('10 watts')).toBeInTheDocument();
    expect(screen.getByText('25 watts')).toBeInTheDocument();
  });

  it('renders the question number chip', () => {
    renderWithProviders(
      <QuestionCard
        question={mockQuestion}
        questionNumber={3}
        onSelectOption={() => {}}
      />
    );
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('calls onSelectOption when an option is clicked', async () => {
    const handleSelect = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        onSelectOption={handleSelect}
      />
    );
    await user.click(screen.getByText('10 watts'));
    expect(handleSelect).toHaveBeenCalledWith('b');
  });

  it('highlights the selected option', () => {
    renderWithProviders(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedOptionId="b"
        onSelectOption={() => {}}
      />
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeChecked();
  });

  it('shows correct/incorrect indicators in review mode with correctOptionId', () => {
    renderWithProviders(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedOptionId="b"
        onSelectOption={() => {}}
        reviewMode={true}
        correctOptionId="a"
      />
    );
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
  });
});
