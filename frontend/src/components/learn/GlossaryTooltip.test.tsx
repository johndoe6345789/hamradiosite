import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import GlossaryTooltip from './GlossaryTooltip';

describe('GlossaryTooltip', () => {
  it('renders the child text', () => {
    renderWithProviders(
      <GlossaryTooltip term="Ofcom" definition="The UK regulator">Ofcom</GlossaryTooltip>
    );
    expect(screen.getByText('Ofcom')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    renderWithProviders(
      <GlossaryTooltip term="SWR" definition="Standing Wave Ratio">SWR</GlossaryTooltip>
    );
    await userEvent.hover(screen.getByText('SWR'));
    expect(await screen.findByText(/Standing Wave Ratio/)).toBeInTheDocument();
  });

  it('has dotted underline styling', () => {
    renderWithProviders(
      <GlossaryTooltip term="HF" definition="High Frequency">HF</GlossaryTooltip>
    );
    const el = screen.getByText('HF');
    expect(el).toHaveStyle({ cursor: 'help' });
  });
});
