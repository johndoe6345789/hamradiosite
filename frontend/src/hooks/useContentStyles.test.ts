import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import useContentStyles from './useContentStyles';

describe('useContentStyles', () => {
  it('returns an sx object with all expected style keys', () => {
    const theme = createTheme();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, { theme }, children);

    const { result } = renderHook(() => useContentStyles(), { wrapper });

    const styles = result.current as Record<string, unknown>;
    expect(styles).toHaveProperty('& h2');
    expect(styles).toHaveProperty('& h3');
    expect(styles).toHaveProperty('& h4');
    expect(styles).toHaveProperty('& p');
    expect(styles).toHaveProperty('& ul, & ol');
    expect(styles).toHaveProperty('& li');
    expect(styles).toHaveProperty('& strong');
    expect(styles).toHaveProperty('& table');
    expect(styles).toHaveProperty('& blockquote');
    expect(styles).toHaveProperty('& code');
    expect(styles).toHaveProperty('& a');
  });

  it('uses theme typography values in heading styles', () => {
    const theme = createTheme();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, { theme }, children);

    const { result } = renderHook(() => useContentStyles(), { wrapper });

    const styles = result.current as Record<string, Record<string, unknown>>;
    expect(styles['& h2']).toMatchObject({ fontWeight: 600, mt: 4, mb: 2, color: 'text.primary' });
    expect(styles['& h3']).toMatchObject({ fontWeight: 600, mt: 3, mb: 1.5, color: 'text.primary' });
    expect(styles['& h4']).toMatchObject({ fontWeight: 600, mt: 2.5, mb: 1, color: 'text.primary' });
  });

  it('includes table nested styles', () => {
    const theme = createTheme();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, { theme }, children);

    const { result } = renderHook(() => useContentStyles(), { wrapper });

    const styles = result.current as Record<string, Record<string, unknown>>;
    expect(styles['& table']).toHaveProperty('& th, & td');
    expect(styles['& table']).toHaveProperty('& th');
    expect(styles['& table']).toHaveProperty('width', '100%');
  });

  it('includes anchor hover styles', () => {
    const theme = createTheme();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, { theme }, children);

    const { result } = renderHook(() => useContentStyles(), { wrapper });

    const styles = result.current as Record<string, Record<string, unknown>>;
    expect(styles['& a']).toHaveProperty('&:hover');
    expect(styles['& a']).toHaveProperty('color', 'primary.main');
  });
});
