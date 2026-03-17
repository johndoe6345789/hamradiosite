import { renderWithProviders, screen } from '@/test/test-utils';
import ReviewQuestionCard from './ReviewQuestionCard';
import type { QuestionWithAnswer } from '@/types/quiz';

describe('ReviewQuestionCard', () => {
  const question: QuestionWithAnswer = {
    id: 'q1',
    text: 'What is the call sign format?',
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
    ],
    correctOptionId: 'a',
    explanation: 'Call signs follow a specific format.',
  };

  const baseProps = {
    question,
    questionNumber: 1,
    correctLabel: 'Correct',
    incorrectLabel: 'Incorrect',
    yourAnswerLabel: 'Your answer',
    correctAnswerLabel: 'Correct answer',
    explanationLabel: 'Explanation',
  };

  it('renders question text and number', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId="a" />);
    expect(screen.getByText('What is the call sign format?')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('shows correct label when answer is correct', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId="a" />);
    expect(screen.getByText('Correct')).toBeInTheDocument();
  });

  it('shows incorrect label and user answer when answer is wrong', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId="b" />);
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    expect(screen.getByText('Your answer: Option B')).toBeInTheDocument();
  });

  it('shows correct answer text', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId="b" />);
    expect(screen.getByText('Correct answer: Option A')).toBeInTheDocument();
  });

  it('renders explanation', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId="a" />);
    expect(screen.getByText('Explanation')).toBeInTheDocument();
    expect(screen.getByText('Call signs follow a specific format.')).toBeInTheDocument();
  });

  it('does not show user answer section when correct', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId="a" />);
    expect(screen.queryByText(/Your answer/)).not.toBeInTheDocument();
  });

  it('handles undefined userAnswerId (unanswered)', () => {
    renderWithProviders(<ReviewQuestionCard {...baseProps} userAnswerId={undefined} />);
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    // userOption is undefined so "Your answer" line should not appear
    expect(screen.queryByText(/Your answer/)).not.toBeInTheDocument();
  });
});
