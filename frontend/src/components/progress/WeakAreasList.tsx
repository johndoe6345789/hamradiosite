'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import WeakAreaCard from './WeakAreaCard';
import type { TopicProgress } from '@/types/progress';

interface WeakAreasListProps {
  weakAreas: TopicProgress[];
}

export default function WeakAreasList({ weakAreas }: WeakAreasListProps) {
  const t = useTranslations('progress');

  if (weakAreas.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="success.main" fontWeight={600}>{t('weakAreasEmpty')}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {weakAreas.map((area) => (
        <WeakAreaCard key={area.topicId} area={area} attemptsLabel={t('attempts')} studyLabel={t('score')} practiceLabel={t('practiceMore')} />
      ))}
    </Box>
  );
}
