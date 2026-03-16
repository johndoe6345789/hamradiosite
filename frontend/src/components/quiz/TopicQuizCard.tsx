'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Link } from '@/i18n/navigation';

interface TopicQuizCardProps {
  id: string;
  name: string;
  questionCount: number;
  description: string;
  startLabel: string;
}

export default function TopicQuizCard({ id, name, questionCount, description, startLabel }: TopicQuizCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>{name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>
        <Chip label={`${questionCount} questions`} size="small" variant="outlined" />
      </CardContent>
      <CardActions sx={{ p: 2 }}>
        <Button component={Link} href={`/quiz/${id}`} variant="outlined" fullWidth>{startLabel}</Button>
      </CardActions>
    </Card>
  );
}
