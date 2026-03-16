import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ContentRenderer from './ContentRenderer';

describe('ContentRenderer', () => {
  it('renders HTML content', () => {
    renderWithProviders(<ContentRenderer content="<p>Hello World</p>" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders headings', () => {
    renderWithProviders(
      <ContentRenderer content="<h2>Section Title</h2><p>Some content</p>" />
    );
    expect(screen.getByText('Section Title')).toBeInTheDocument();
  });

  it('renders lists', () => {
    renderWithProviders(
      <ContentRenderer content="<ul><li>Item 1</li><li>Item 2</li></ul>" />
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('has the content-renderer test id', () => {
    renderWithProviders(<ContentRenderer content="<p>Test</p>" />);
    expect(screen.getByTestId('content-renderer')).toBeInTheDocument();
  });

  it('renders nested HTML elements', () => {
    renderWithProviders(
      <ContentRenderer content="<p>Text with <strong>bold</strong> words</p>" />
    );
    expect(screen.getByText(/Text with/)).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
  });
});
