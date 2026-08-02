import { fireEvent, render, screen } from '@testing-library/react';
import TurboErrorDialog from './TurboErrorDialog';

describe('TurboErrorDialog', () => {
  it('renders its message, closes, and opens Vault', () => {
    const onClose = jest.fn();
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);

    render(<TurboErrorDialog open message="Clipboard failed" onClose={onClose} />);

    expect(screen.getByText('Clipboard failed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'vault.wardcrew.com' })).toHaveAttribute(
      'href',
      'https://vault.wardcrew.com'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Open Vault' }));
    expect(open).toHaveBeenCalledWith('https://vault.wardcrew.com', '_blank');

    open.mockRestore();
  });
});
