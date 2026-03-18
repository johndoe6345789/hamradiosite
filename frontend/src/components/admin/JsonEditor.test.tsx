import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import JsonEditor from './JsonEditor';

describe('JsonEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders leaf string values as text fields', () => {
    renderWithProviders(
      <JsonEditor data={{ greeting: 'Hello' }} path="" onChange={onChange} />
    );
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    expect(screen.getByText('greeting:')).toBeInTheDocument();
  });

  it('calls onChange with correct path for leaf value changes', () => {
    renderWithProviders(
      <JsonEditor data={{ greeting: 'Hello' }} path="" onChange={onChange} />
    );
    fireEvent.change(screen.getByDisplayValue('Hello'), { target: { value: 'Hi' } });
    expect(onChange).toHaveBeenCalledWith('greeting', 'Hi');
  });

  it('renders nested objects as expandable sections', () => {
    renderWithProviders(
      <JsonEditor data={{ nav: { home: 'Home' } }} path="" onChange={onChange} />
    );
    expect(screen.getByText('nav')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Home')).toBeInTheDocument();
  });

  it('builds nested path correctly when parent path is provided', () => {
    renderWithProviders(
      <JsonEditor data={{ title: 'Test' }} path="section" onChange={onChange} />
    );
    fireEvent.change(screen.getByDisplayValue('Test'), { target: { value: 'Changed' } });
    expect(onChange).toHaveBeenCalledWith('section.title', 'Changed');
  });

  it('collapses and expands nested object sections on click', () => {
    renderWithProviders(
      <JsonEditor data={{ nav: { home: 'Home' } }} path="" onChange={onChange} />
    );
    // Initially expanded, so the leaf is visible
    expect(screen.getByDisplayValue('Home')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByText('nav'));

    // Click again to re-expand (exercises the collapsed -> expanded branch)
    fireEvent.click(screen.getByText('nav'));
    expect(screen.getByDisplayValue('Home')).toBeInTheDocument();
  });

  it('handles null-ish leaf values by converting to empty string', () => {
    renderWithProviders(
      <JsonEditor data={{ empty: null as unknown as string }} path="" onChange={onChange} />
    );
    // String(null ?? '') => ''
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('renders number values as strings', () => {
    renderWithProviders(
      <JsonEditor data={{ count: 42 as unknown as string }} path="" onChange={onChange} />
    );
    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });

  it('does not render arrays as expandable objects', () => {
    renderWithProviders(
      <JsonEditor data={{ items: ['a', 'b'] as unknown as string }} path="" onChange={onChange} />
    );
    // Arrays should be treated as leaf values (String(["a","b"]))
    expect(screen.getByDisplayValue('a,b')).toBeInTheDocument();
  });
});
