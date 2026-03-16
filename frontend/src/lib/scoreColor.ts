export function getScoreColor(score: number): 'success' | 'warning' | 'error' | 'primary' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  if (score >= 40) return 'error';
  return 'primary';
}
