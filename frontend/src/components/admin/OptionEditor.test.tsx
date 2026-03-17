import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import OptionEditor from './OptionEditor';
import type { QuestionOption } from '@/types/quiz';

describe('OptionEditor', () => {
  const defaultOptions: QuestionOption[] = [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
  ];
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Options heading', () => {
    renderWithProviders(<OptionEditor options={defaultOptions} onChange={onChange} />);
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('renders all option labels and text fields', () => {
    renderWithProviders(<OptionEditor options={defaultOptions} onChange={onChange} />);
    expect(screen.getByText('A.')).toBeInTheDocument();
    expect(screen.getByText('B.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option B')).toBeInTheDocument();
  });

  it('calls onChange when option text is edited', () => {
    renderWithProviders(<OptionEditor options={defaultOptions} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('Option A'), { target: { value: 'New A' } });
    expect(onChange).toHaveBeenCalledWith([
      { id: 'a', text: 'New A' },
      { id: 'b', text: 'Option B' },
    ]);
  });

  it('adds a new option when Add Option button is clicked', () => {
    renderWithProviders(<OptionEditor options={defaultOptions} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add option/i }));
    expect(onChange).toHaveBeenCalledWith([
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: '' },
    ]);
  });

  it('does not show remove buttons when there are only 2 options', () => {
    renderWithProviders(<OptionEditor options={defaultOptions} onChange={onChange} />);
    // Remove buttons have RemoveCircleIcon - only Edit and Add should exist
    const buttons = screen.getAllByRole('button');
    // Only Add Option button should be there
    expect(buttons).toHaveLength(1);
  });

  it('shows remove buttons when there are more than 2 options', () => {
    const threeOptions: QuestionOption[] = [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ];
    renderWithProviders(<OptionEditor options={threeOptions} onChange={onChange} />);
    // 3 remove buttons + 1 add button = 4
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('removes an option when remove button is clicked', () => {
    const threeOptions: QuestionOption[] = [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ];
    renderWithProviders(<OptionEditor options={threeOptions} onChange={onChange} />);
    // Click first remove button (index 0 among the remove buttons)
    const removeButtons = screen.getAllByTestId('RemoveCircleIcon');
    fireEvent.click(removeButtons[0].closest('button')!);
    expect(onChange).toHaveBeenCalledWith([
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ]);
  });
});
