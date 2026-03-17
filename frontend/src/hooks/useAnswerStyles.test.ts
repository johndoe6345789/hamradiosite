import useAnswerStyles from './useAnswerStyles';

describe('useAnswerStyles', () => {
  describe('when not in review mode', () => {
    it('returns primary border and bg when selected', () => {
      const result = useAnswerStyles(true, null, false);
      expect(result.borderColor).toBe('primary.main');
      expect(result.bgColor).toBe('primary.50');
    });

    it('returns divider border and transparent bg when not selected', () => {
      const result = useAnswerStyles(false, null, false);
      expect(result.borderColor).toBe('divider');
      expect(result.bgColor).toBe('transparent');
    });

    it('defaults reviewMode to undefined (falsy)', () => {
      const result = useAnswerStyles(false);
      expect(result.borderColor).toBe('divider');
      expect(result.bgColor).toBe('transparent');
    });

    it('defaults correct to undefined (falsy)', () => {
      const result = useAnswerStyles(true, undefined);
      expect(result.borderColor).toBe('primary.main');
      expect(result.bgColor).toBe('primary.50');
    });
  });

  describe('when in review mode', () => {
    it('returns success border and bg when correct is true', () => {
      const result = useAnswerStyles(false, true, true);
      expect(result.borderColor).toBe('success.main');
      expect(result.bgColor).toBe('success.50');
    });

    it('returns error border and bg when correct is false and selected', () => {
      const result = useAnswerStyles(true, false, true);
      expect(result.borderColor).toBe('error.main');
      expect(result.bgColor).toBe('error.50');
    });

    it('returns divider border and transparent bg when correct is false and not selected', () => {
      const result = useAnswerStyles(false, false, true);
      expect(result.borderColor).toBe('divider');
      expect(result.bgColor).toBe('transparent');
    });

    it('returns divider border and transparent bg when correct is null', () => {
      const result = useAnswerStyles(false, null, true);
      expect(result.borderColor).toBe('divider');
      expect(result.bgColor).toBe('transparent');
    });

    it('returns divider border and transparent bg when correct is undefined', () => {
      const result = useAnswerStyles(false, undefined, true);
      expect(result.borderColor).toBe('divider');
      expect(result.bgColor).toBe('transparent');
    });
  });
});
