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

  it('shows tooltip with definition on hover', async () => {
    renderWithProviders(
      <GlossaryTooltip term="SWR" definition="Standing Wave Ratio">SWR</GlossaryTooltip>
    );
    await userEvent.hover(screen.getByText('SWR'));
    expect(await screen.findByText(/Standing Wave Ratio/)).toBeInTheDocument();
  });

  it('shows detail text when provided', async () => {
    renderWithProviders(
      <GlossaryTooltip term="SWR" definition="Standing Wave Ratio" detail="Ideal is 1:1.">SWR</GlossaryTooltip>
    );
    await userEvent.hover(screen.getByText('SWR'));
    expect(await screen.findByText(/Ideal is 1:1/)).toBeInTheDocument();
  });

  it('shows read more link when url provided', async () => {
    renderWithProviders(
      <GlossaryTooltip term="HF" definition="High Frequency" url="https://en.wikipedia.org/wiki/High_frequency">HF</GlossaryTooltip>
    );
    await userEvent.hover(screen.getByText('HF'));
    const link = await screen.findByText('Read more');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/High_frequency');
  });

  it('has dotted underline styling', () => {
    renderWithProviders(
      <GlossaryTooltip term="HF" definition="High Frequency">HF</GlossaryTooltip>
    );
    expect(screen.getByText('HF')).toHaveStyle({ cursor: 'help' });
  });
});
