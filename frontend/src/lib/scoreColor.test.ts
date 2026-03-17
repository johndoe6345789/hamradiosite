import { getScoreColor } from './scoreColor';

describe('getScoreColor', () => {
  it('returns "success" for score >= 80', () => {
    expect(getScoreColor(80)).toBe('success');
    expect(getScoreColor(100)).toBe('success');
    expect(getScoreColor(95)).toBe('success');
  });

  it('returns "warning" for score >= 60 and < 80', () => {
    expect(getScoreColor(60)).toBe('warning');
    expect(getScoreColor(79)).toBe('warning');
    expect(getScoreColor(70)).toBe('warning');
  });

  it('returns "error" for score >= 40 and < 60', () => {
    expect(getScoreColor(40)).toBe('error');
    expect(getScoreColor(59)).toBe('error');
    expect(getScoreColor(50)).toBe('error');
  });

  it('returns "primary" for score < 40', () => {
    expect(getScoreColor(39)).toBe('primary');
    expect(getScoreColor(0)).toBe('primary');
    expect(getScoreColor(20)).toBe('primary');
  });
});
