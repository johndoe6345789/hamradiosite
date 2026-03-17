import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import QuestionFormDialog from './QuestionFormDialog';
import type { QuestionFormData } from './QuestionFormDialog';
import type { TopicWithContent } from '@/types/topic';

describe('QuestionFormDialog', () => {
  const mockTopics: TopicWithContent[] = [
    { id: '1', title: 'Radio Basics', slug: 'radio-basics', description: '', content: '', icon: '', order: 1 },
    { id: '2', title: 'Safety', slug: 'safety', description: '', content: '', icon: '', order: 2 },
  ];

  const defaultForm: QuestionFormData = {
    text: 'What is FM?',
    topic_slug: 'radio-basics',
    options: [
      { id: 'a', text: 'Frequency Modulation' },
      { id: 'b', text: 'Fast Mode' },
    ],
    correct_option_id: 'a',
    explanation: 'FM stands for Frequency Modulation',
  };

  const defaultProps = {
    open: true,
    isEditing: false,
    form: defaultForm,
    topics: mockTopics,
    onClose: jest.fn(),
    onSave: jest.fn(),
    onFormChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add Question title when not editing', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    expect(screen.getByText('Add Question')).toBeInTheDocument();
  });

  it('renders Edit Question title when editing', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} isEditing={true} />);
    expect(screen.getByText('Edit Question')).toBeInTheDocument();
  });

  it('renders Create Question button when not editing', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /create question/i })).toBeInTheDocument();
  });

  it('renders Save Changes button when editing', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} isEditing={true} />);
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Create Question is clicked', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /create question/i }));
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onFormChange when question text changes', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    const textField = screen.getByLabelText(/question text/i);
    fireEvent.change(textField, { target: { value: 'New question?' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultForm,
      text: 'New question?',
    });
  });

  it('calls onFormChange when explanation changes', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    const explanationField = screen.getByLabelText(/explanation/i);
    fireEvent.change(explanationField, { target: { value: 'New explanation' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultForm,
      explanation: 'New explanation',
    });
  });

  it('does not render when open is false', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Add Question')).not.toBeInTheDocument();
  });

  it('renders options with (empty) for empty text', () => {
    const formWithEmpty = {
      ...defaultForm,
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: 'Something' },
      ],
    };
    renderWithProviders(<QuestionFormDialog {...defaultProps} form={formWithEmpty} />);
    // The correct answer Select should show "A: (empty)" option
    expect(screen.getByText('A: (empty)')).toBeInTheDocument();
    expect(screen.getByText('B: Something')).toBeInTheDocument();
  });
});
