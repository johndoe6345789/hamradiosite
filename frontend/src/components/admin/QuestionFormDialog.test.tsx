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

  it('calls onFormChange when topic select changes', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    // Open the Topic select dropdown - MUI renders the selected value as text
    const topicSelect = screen.getByText('Radio Basics');
    fireEvent.mouseDown(topicSelect);
    // Click on the "Safety" menu item
    fireEvent.click(screen.getByText('Safety'));
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultForm,
      topic_slug: 'safety',
    });
  });

  it('calls onFormChange when correct answer select changes', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    // Open the Correct Answer select dropdown
    const correctAnswerSelect = screen.getByText('A: Frequency Modulation');
    fireEvent.mouseDown(correctAnswerSelect);
    // Click on option B
    fireEvent.click(screen.getByText('B: Fast Mode'));
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultForm,
      correct_option_id: 'b',
    });
  });

  it('calls onFormChange via OptionEditor when adding an option (correct_option_id preserved)', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    // Click "Add Option" button to trigger OptionEditor onChange
    fireEvent.click(screen.getByRole('button', { name: /add option/i }));
    // Adding option 'c' - correct_option_id 'a' is still in the new options, so it should be preserved
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultForm,
      options: [
        { id: 'a', text: 'Frequency Modulation' },
        { id: 'b', text: 'Fast Mode' },
        { id: 'c', text: '' },
      ],
      correct_option_id: 'a',
    });
  });

  it('calls onFormChange via OptionEditor when editing option text', () => {
    renderWithProviders(<QuestionFormDialog {...defaultProps} />);
    // Change the text of the first option
    const optionInputs = screen.getAllByPlaceholderText(/option/i);
    fireEvent.change(optionInputs[0], { target: { value: 'Updated FM' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultForm,
      options: [
        { id: 'a', text: 'Updated FM' },
        { id: 'b', text: 'Fast Mode' },
      ],
      correct_option_id: 'a',
    });
  });

  it('clears correct_option_id when the selected option is removed', () => {
    // Use 3 options so the remove button is visible (requires > 2 options)
    const formWith3Options = {
      ...defaultForm,
      options: [
        { id: 'a', text: 'Frequency Modulation' },
        { id: 'b', text: 'Fast Mode' },
        { id: 'c', text: 'Third' },
      ],
      correct_option_id: 'c',
    };
    renderWithProviders(<QuestionFormDialog {...defaultProps} form={formWith3Options} />);
    // Remove option 'c' (the one with correct_option_id) by clicking its remove button
    const removeButtons = screen.getAllByTestId('RemoveCircleIcon');
    // Click the last remove button (option c)
    fireEvent.click(removeButtons[2]);
    // correct_option_id 'c' is no longer in remaining options, so it should be cleared to ''
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...formWith3Options,
      options: [
        { id: 'a', text: 'Frequency Modulation' },
        { id: 'b', text: 'Fast Mode' },
      ],
      correct_option_id: '',
    });
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
    // The correct answer Select shows the selected value (option a)
    expect(screen.getByText('A: (empty)')).toBeInTheDocument();
    // Open the select dropdown to verify option B is rendered
    fireEvent.mouseDown(screen.getByText('A: (empty)'));
    expect(screen.getByText('B: Something')).toBeInTheDocument();
  });
});
