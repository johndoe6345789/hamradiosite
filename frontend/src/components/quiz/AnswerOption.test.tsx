import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import AnswerOption from './AnswerOption';

const mockOption = { id: 'a', text: '10 watts' };

describe('AnswerOption', () => {
  it('renders the option text', () => {
    renderWithProviders(
      <AnswerOption option={mockOption} selected={false} onSelect={() => {}} />
    );
    expect(screen.getByText('10 watts')).toBeInTheDocument();
  });

  it('shows radio button checked when selected', () => {
    renderWithProviders(
      <AnswerOption option={mockOption} selected={true} onSelect={() => {}} />
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });

  it('shows radio button unchecked when not selected', () => {
    renderWithProviders(
      <AnswerOption option={mockOption} selected={false} onSelect={() => {}} />
    );
    const radio = screen.getByRole('radio');
    expect(radio).not.toBeChecked();
  });

  it('calls onSelect when clicked', async () => {
    const handleSelect = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <AnswerOption option={mockOption} selected={false} onSelect={handleSelect} />
    );
    await user.click(screen.getByText('10 watts'));
    expect(handleSelect).toHaveBeenCalledWith('a');
  });

  it('shows correct styling in review mode', () => {
    renderWithProviders(
      <AnswerOption
        option={mockOption}
        selected={false}
        correct={true}
        reviewMode={true}
        onSelect={() => {}}
      />
    );
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });

  it('shows incorrect styling in review mode when selected and wrong', () => {
    renderWithProviders(
      <AnswerOption
        option={mockOption}
        selected={true}
        correct={false}
        reviewMode={true}
        onSelect={() => {}}
      />
    );
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
  });

  it('does not call onSelect in review mode', async () => {
    const handleSelect = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <AnswerOption
        option={mockOption}
        selected={false}
        correct={true}
        reviewMode={true}
        onSelect={handleSelect}
      />
    );
    await user.click(screen.getByText('10 watts'));
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('shows disabled radio in review mode when not selected and not correct', () => {
    renderWithProviders(
      <AnswerOption
        option={mockOption}
        selected={false}
        correct={false}
        reviewMode={true}
        onSelect={() => {}}
      />
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
    expect(radio).not.toBeChecked();
  });

  it('calls onSelect when radio onChange fires', async () => {
    const handleSelect = jest.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <AnswerOption option={mockOption} selected={false} onSelect={handleSelect} />
    );
    const radio = screen.getByRole('radio');
    await user.click(radio);
    expect(handleSelect).toHaveBeenCalledWith('a');
  });
});
