import themeReducer, { toggleTheme, setThemeMode } from './themeSlice';

describe('themeSlice', () => {
  const initialState = { mode: 'light' as const };

  it('should return the initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual({
      mode: 'light',
    });
  });

  it('should toggle from light to dark', () => {
    const state = themeReducer(initialState, toggleTheme());
    expect(state.mode).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    const darkState = { mode: 'dark' as const };
    const state = themeReducer(darkState, toggleTheme());
    expect(state.mode).toBe('light');
  });

  it('should set theme mode to dark', () => {
    const state = themeReducer(initialState, setThemeMode('dark'));
    expect(state.mode).toBe('dark');
  });

  it('should set theme mode to light', () => {
    const darkState = { mode: 'dark' as const };
    const state = themeReducer(darkState, setThemeMode('light'));
    expect(state.mode).toBe('light');
  });
});
