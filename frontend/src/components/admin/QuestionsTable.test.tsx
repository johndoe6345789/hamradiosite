import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import QuestionsTable from './QuestionsTable';
import type { QuizQuestion } from '@/types/quiz';

describe('QuestionsTable', () => {
  const mockQuestions: QuizQuestion[] = [
    {
      id: '1',
      text: 'What is FM?',
      options: [
        { id: 'a', text: 'Frequency Modulation' },
        { id: 'b', text: 'Fast Mode' },
      ],
      correct_option_id: 'a',
      explanation: 'FM means Frequency Modulation',
      topic_slug: 'radio-basics',
    },
  ];

  const onEdit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers', () => {
    renderWithProviders(<QuestionsTable questions={mockQuestions} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByText('Topic')).toBeInTheDocument();
    expect(screen.getByText('Correct Answer')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders question data in table rows', () => {
    renderWithProviders(<QuestionsTable questions={mockQuestions} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('What is FM?')).toBeInTheDocument();
    expect(screen.getByText('radio-basics')).toBeInTheDocument();
    expect(screen.getByText('Frequency Modulation')).toBeInTheDocument();
  });

  it('shows correct_option_id when no matching option is found', () => {
    const questionsNoMatch: QuizQuestion[] = [{
      ...mockQuestions[0],
      correct_option_id: 'z',
    }];
    renderWithProviders(<QuestionsTable questions={questionsNoMatch} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('z')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithProviders(<QuestionsTable questions={mockQuestions} onEdit={onEdit} onDelete={onDelete} />);
    const editButton = screen.getByTestId('EditIcon').closest('button')!;
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(<QuestionsTable questions={mockQuestions} onEdit={onEdit} onDelete={onDelete} />);
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button')!;
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it('shows empty state when no questions', () => {
    renderWithProviders(<QuestionsTable questions={[]} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('No questions found')).toBeInTheDocument();
  });

  it('does not show empty state when questions exist', () => {
    renderWithProviders(<QuestionsTable questions={mockQuestions} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.queryByText('No questions found')).not.toBeInTheDocument();
  });
});
