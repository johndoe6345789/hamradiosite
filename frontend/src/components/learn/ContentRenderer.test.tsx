import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ContentRenderer, {
  annotateChildren,
  annotateElement,
  annotateText,
  createComponents,
  extractText,
} from './ContentRenderer';

const glossary = [{ id: '1', term: 'Ofcom', definition: 'The UK regulator' }];

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

  it('renders without glossary by default', () => {
    renderWithProviders(<ContentRenderer content="Some content about Ofcom" />);
    expect(screen.getByText(/Ofcom/)).toBeInTheDocument();
  });

  it('accepts glossary prop', () => {
    renderWithProviders(<ContentRenderer content="Regulated by Ofcom" glossary={glossary} />);
    expect(screen.getByText(/Ofcom/)).toBeInTheDocument();
  });

  it('extracts text from supported React nodes', () => {
    expect(extractText('text')).toBe('text');
    expect(extractText(12)).toBe('12');
    expect(extractText(null)).toBe('');
    expect(extractText(['a', 2])).toBe('a2');
    expect(extractText(<span>nested</span>)).toBe('nested');
    expect(extractText({ value: 'unsupported' })).toBe('');
  });

  it('annotates glossary terms once and preserves surrounding text', () => {
    expect(annotateText('plain', [])).toEqual(['plain']);
    expect(annotateText('plain', glossary)).toEqual(['plain']);
    expect(annotateText('', glossary)).toEqual(['']);
    expect(annotateText('Ofcom', glossary)).toHaveLength(1);
    expect(annotateText('C++', [{ id: '2', term: 'C++', definition: 'Language' }])).toEqual(['C++']);
    const parts = annotateText('Before Ofcom and OFCOM after', glossary);
    render(<>{parts}</>);
    expect(screen.getByText('Ofcom')).toBeInTheDocument();
    expect(screen.getByText(/Before/)).toBeInTheDocument();
  });

  it('annotates strings, arrays, elements, and passthrough children', () => {
    expect(annotateChildren('plain', [])).toBe('plain');
    expect(annotateChildren('plain', glossary)).toBe('plain');
    render(<>{annotateChildren('Ofcom', glossary)}</>);
    expect(screen.getByText('Ofcom')).toBeInTheDocument();
    render(<>{annotateChildren(<strong>Ofcom</strong>, glossary)}</>);
    render(<>{annotateChildren(['prefix ', <strong key="s">Ofcom</strong>, 4], glossary)}</>);
    expect(screen.getByText('prefix')).toBeInTheDocument();
    render(<>{annotateChildren(['plain'], glossary)}</>);
    expect(screen.getByText('plain')).toBeInTheDocument();
    render(<>{annotateChildren(['about Ofcom'], glossary)}</>);
    expect(annotateChildren(7, glossary)).toBe(7);
    expect(annotateChildren([7], glossary)).toEqual([7]);
  });

  it('clones elements with and without children and optional keys', () => {
    const empty = <span />;
    expect(React.isValidElement(annotateElement(empty, glossary))).toBe(true);
    expect(React.isValidElement(annotateElement(empty, glossary, 1))).toBe(true);
    render(<>{annotateElement(<span>Ofcom</span>, glossary)}</>);
    expect(screen.getByText('Ofcom')).toBeInTheDocument();
    expect(React.isValidElement(annotateElement(<span>Ofcom</span>, glossary, 2))).toBe(true);
  });

  it('builds markdown components for glossary and ordinary links and cells', () => {
    const map = new Map(glossary.map((entry) => [entry.term.toLowerCase(), entry]));
    const components = createComponents(glossary, map);
    const LinkComponent = components.a as React.ComponentType<Record<string, unknown>>;
    const Paragraph = components.p as React.ComponentType<Record<string, unknown>>;
    const ListItem = components.li as React.ComponentType<Record<string, unknown>>;
    const Cell = components.td as React.ComponentType<Record<string, unknown>>;

    render(<LinkComponent href="https://example.com">Ofcom</LinkComponent>);
    expect(screen.getByRole('link', { name: 'Ofcom' })).toBeInTheDocument();
    render(<LinkComponent href="https://example.com"><span>Other</span></LinkComponent>);
    expect(screen.getByRole('link', { name: 'Other' })).toBeInTheDocument();
    render(<LinkComponent href="https://example.com" />);
    render(<Paragraph>Ofcom</Paragraph>);
    render(<ul><ListItem>Ofcom</ListItem></ul>);
    render(<table><tbody><tr><Cell>Ofcom</Cell></tr></tbody></table>);
  });
});
