import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders dark mode icon when in light mode', () => {
    renderWithProviders(<ThemeToggle />, {
      preloadedState: { theme: { mode: 'light' } },
    });
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('renders light mode icon when in dark mode', () => {
    renderWithProviders(<ThemeToggle />, {
      preloadedState: { theme: { mode: 'dark' } },
    });
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('dispatches toggleTheme on click', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ThemeToggle />, {
      preloadedState: { theme: { mode: 'light' } },
    });
    await user.click(screen.getByLabelText('Switch to dark mode'));
    expect(store.getState().theme.mode).toBe('dark');
  });
});
