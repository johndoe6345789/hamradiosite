export default function useAnswerStyles(selected: boolean, correct?: boolean | null, reviewMode?: boolean) {
  const borderColor = (() => {
    if (!reviewMode) return selected ? 'primary.main' : 'divider';
    if (correct === true) return 'success.main';
    if (correct === false && selected) return 'error.main';
    return 'divider';
  })();

  const bgColor = (() => {
    if (!reviewMode) return selected ? 'primary.50' : 'transparent';
    if (correct === true) return 'success.50';
    if (correct === false && selected) return 'error.50';
    return 'transparent';
  })();

  return { borderColor, bgColor };
}
