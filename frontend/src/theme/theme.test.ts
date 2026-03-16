import { getTheme } from './theme';

describe('getTheme', () => {
  describe('light mode', () => {
    const theme = getTheme('light');

    it('should create a theme with light palette mode', () => {
      expect(theme.palette.mode).toBe('light');
    });

    it('should have the correct primary color', () => {
      expect(theme.palette.primary.main).toBe('#1565c0');
    });

    it('should have the correct secondary color', () => {
      expect(theme.palette.secondary.main).toBe('#ff8f00');
    });

    it('should have light background colors', () => {
      expect(theme.palette.background.default).toBe('#f5f5f5');
      expect(theme.palette.background.paper).toBe('#ffffff');
    });

    it('should have border radius of 12', () => {
      expect(theme.shape.borderRadius).toBe(12);
    });

    it('should have system font stack', () => {
      expect(theme.typography.fontFamily).toContain('system-ui');
    });

    it('should have correct h1 typography', () => {
      expect(theme.typography.h1.fontSize).toBe('2.5rem');
      expect(theme.typography.h1.fontWeight).toBe(700);
    });

    it('should have correct h2 typography', () => {
      expect(theme.typography.h2.fontSize).toBe('2rem');
      expect(theme.typography.h2.fontWeight).toBe(600);
    });
  });

  describe('dark mode', () => {
    const theme = getTheme('dark');

    it('should create a theme with dark palette mode', () => {
      expect(theme.palette.mode).toBe('dark');
    });

    it('should have the correct primary color', () => {
      expect(theme.palette.primary.main).toBe('#1565c0');
    });

    it('should have the correct secondary color', () => {
      expect(theme.palette.secondary.main).toBe('#ff8f00');
    });

    it('should have dark background colors', () => {
      expect(theme.palette.background.default).toBe('#121212');
      expect(theme.palette.background.paper).toBe('#1e1e1e');
    });

    it('should have border radius of 12', () => {
      expect(theme.shape.borderRadius).toBe(12);
    });
  });
});
