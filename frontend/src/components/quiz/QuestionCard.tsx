'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import AnswerOption from './AnswerOption';

interface QuestionCardProps {
  question: { id: string; text: string; options: { id: string; text: string }[] };
  questionNumber: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  reviewMode?: boolean;
  correctOptionId?: string;
}

export default function QuestionCard({ question, questionNumber, selectedOptionId, onSelectOption, reviewMode = false, correctOptionId }: QuestionCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Chip label={`Q${questionNumber}`} color="primary" size="small" sx={{ fontWeight: 600 }} />
        </Box>
        <Typography variant="h6" component="p" sx={{ mb: 3, fontWeight: 500 }}>{question.text}</Typography>
        <Box>
          {question.options.map((option) => (
            <AnswerOption key={option.id} option={option} selected={selectedOptionId === option.id} correct={reviewMode && correctOptionId ? option.id === correctOptionId : null} reviewMode={reviewMode} onSelect={onSelectOption} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
