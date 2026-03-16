'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { QuestionWithAnswer } from '@/types/quiz';

interface ReviewQuestionCardProps {
  question: QuestionWithAnswer;
  questionNumber: number;
  userAnswerId: string | undefined;
  correctLabel: string;
  incorrectLabel: string;
  yourAnswerLabel: string;
  correctAnswerLabel: string;
  explanationLabel: string;
}

export default function ReviewQuestionCard({ question, questionNumber, userAnswerId, correctLabel, incorrectLabel, yourAnswerLabel, correctAnswerLabel, explanationLabel }: ReviewQuestionCardProps) {
  const isCorrect = userAnswerId === question.correctOptionId;
  const userOption = question.options.find((o) => o.id === userAnswerId);
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
          <Typography variant="subtitle1" fontWeight={600}>Question {questionNumber}</Typography>
          <Chip label={isCorrect ? correctLabel : incorrectLabel} color={isCorrect ? 'success' : 'error'} size="small" />
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>{question.text}</Typography>
        {!isCorrect && userOption && (
          <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>{yourAnswerLabel}: {userOption.text}</Typography>
        )}
        {correctOption && (
          <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>{correctAnswerLabel}: {correctOption.text}</Typography>
        )}
        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>{explanationLabel}</Typography>
          <Typography variant="body2" color="text.secondary">{question.explanation}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
