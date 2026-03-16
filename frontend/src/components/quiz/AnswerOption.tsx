'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface AnswerOptionProps {
  option: { id: string; text: string };
  selected: boolean;
  correct?: boolean | null;
  reviewMode?: boolean;
  onSelect: (optionId: string) => void;
}

export default function AnswerOption({
  option,
  selected,
  correct,
  reviewMode = false,
  onSelect,
}: AnswerOptionProps) {
  const getBorderColor = () => {
    if (!reviewMode) return selected ? 'primary.main' : 'divider';
    if (correct === true) return 'success.main';
    if (correct === false && selected) return 'error.main';
    return 'divider';
  };

  const getBgColor = () => {
    if (!reviewMode) return selected ? 'primary.50' : 'transparent';
    if (correct === true) return 'success.50';
    if (correct === false && selected) return 'error.50';
    return 'transparent';
  };

  return (
    <Paper
      variant="outlined"
      onClick={() => !reviewMode && onSelect(option.id)}
      sx={{
        p: 2,
        mb: 1.5,
        cursor: reviewMode ? 'default' : 'pointer',
        borderColor: getBorderColor(),
        bgcolor: getBgColor(),
        borderWidth: selected || (reviewMode && correct) ? 2 : 1,
        transition: 'all 0.2s',
        '&:hover': reviewMode
          ? {}
          : {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {reviewMode ? (
          correct ? (
            <CheckCircleIcon color="success" />
          ) : selected ? (
            <CancelIcon color="error" />
          ) : (
            <Radio checked={false} disabled size="small" />
          )
        ) : (
          <Radio
            checked={selected}
            onChange={() => onSelect(option.id)}
            value={option.id}
            size="small"
          />
        )}
        <Typography variant="body1">{option.text}</Typography>
      </Box>
    </Paper>
  );
}
