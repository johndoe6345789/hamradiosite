import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ContentRenderer from './ContentRenderer';

describe('ContentRenderer', () => {
  it('renders markdown content', () => {
    renderWithProviders(<ContentRenderer content="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders heading markdown', () => {
    renderWithProviders(<ContentRenderer content="## Section Title" />);
    expect(screen.getByText('## Section Title')).toBeInTheDocument();
  });

  it('renders list markdown', () => {
    renderWithProviders(
      <ContentRenderer content={'- Item 1\n- Item 2'} />
    );
    expect(screen.getByText(/Item 1/)).toBeInTheDocument();
  });

  it('has the content-renderer test id', () => {
    renderWithProviders(<ContentRenderer content="Test" />);
    expect(screen.getByTestId('content-renderer')).toBeInTheDocument();
  });

  it('renders bold markdown', () => {
    renderWithProviders(
      <ContentRenderer content="Text with **bold** words" />
    );
    expect(screen.getByText(/Text with \*\*bold\*\* words/)).toBeInTheDocument();
  });
});
