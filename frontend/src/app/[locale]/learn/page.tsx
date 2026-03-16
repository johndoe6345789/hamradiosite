'use client';

import { useTranslations } from 'next-intl';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TopicCard from '@/components/learn/TopicCard';
import type { Topic } from '@/types/topic';

const STATIC_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'Licensing Conditions',
    slug: 'licensing-conditions',
    description: 'Understand the terms and conditions of the amateur radio licence, including callsign usage and permitted frequencies.',
    icon: 'Gavel',
    order: 1,
  },
  {
    id: '2',
    title: 'Technical Basics',
    slug: 'technical-basics',
    description: 'Learn about electrical principles, units of measurement, and basic electronic components.',
    icon: 'ElectricalServices',
    order: 2,
  },
  {
    id: '3',
    title: 'Transmitters and Receivers',
    slug: 'transmitters-receivers',
    description: 'Explore how radio transmitters and receivers work, including modulation types and block diagrams.',
    icon: 'Radio',
    order: 3,
  },
  {
    id: '4',
    title: 'Feeders and Antennas',
    slug: 'feeders-antennas',
    description: 'Study feeder cables, antenna types, SWR, and how to set up an antenna system.',
    icon: 'CellTower',
    order: 4,
  },
  {
    id: '5',
    title: 'Propagation',
    slug: 'propagation',
    description: 'Understand how radio waves travel, including ground wave, sky wave, and line-of-sight propagation.',
    icon: 'Waves',
    order: 5,
  },
  {
    id: '6',
    title: 'EMC',
    slug: 'emc',
    description: 'Learn about electromagnetic compatibility, interference issues, and how to resolve them.',
    icon: 'SettingsInputAntenna',
    order: 6,
  },
  {
    id: '7',
    title: 'Operating Practices',
    slug: 'operating-practices',
    description: 'Master operating procedures, the phonetic alphabet, Q-codes, and proper on-air conduct.',
    icon: 'Headset',
    order: 7,
  },
  {
    id: '8',
    title: 'Safety',
    slug: 'safety',
    description: 'Learn about electrical safety, RF exposure, and safe practices when working with radio equipment.',
    icon: 'HealthAndSafety',
    order: 8,
  },
];

export default function LearnPage() {
  const t = useTranslations('learn');

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
          {t('topicsTitle')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('topicsSubtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {STATIC_TOPICS.map((topic) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.id}>
            <TopicCard topic={topic} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
