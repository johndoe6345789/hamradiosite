'use client';

import { useTranslations } from 'next-intl';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getIcon } from '@/lib/iconMap';
import type { Topic } from '@/types/topic';
import { Link } from '@/i18n/navigation';

interface TopicCardProps {
  topic: Topic;
  progress?: number;
}

export default function TopicCard({ topic, progress }: TopicCardProps) {
  const t = useTranslations('learn');
  const IconComponent = getIcon(topic.icon);

  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardActionArea component={Link} href={`/learn/${topic.slug}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CardContent sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconComponent />
            </Box>
            <Typography variant="h6" component="h3" fontWeight={600}>{topic.title}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{topic.description}</Typography>
          {progress !== undefined && progress > 0 && (
            <Typography variant="caption" color="primary.main" fontWeight={600}>{t('readMore')}</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
