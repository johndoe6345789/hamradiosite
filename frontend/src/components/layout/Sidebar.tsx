'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Link } from '@/i18n/navigation';
import { TOPICS } from '@/lib/topics';

export default function Sidebar() {
  const params = useParams<{ topicSlug?: string }>();
  const t = useTranslations('learn');
  const active = params.topicSlug;

  return (
    <Paper variant="outlined" sx={{ position: 'sticky', top: 80 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>{t('topicsTitle')}</Typography>
      </Box>
      <List dense disablePadding>
        {TOPICS.map((topic) => (
          <ListItem key={topic.slug} disablePadding>
            <ListItemButton component={Link} href={`/learn/${topic.slug}`} selected={active === topic.slug} sx={{ borderLeft: active === topic.slug ? 3 : 0, borderColor: 'primary.main', pl: active === topic.slug ? 1.625 : 2 }}>
              <ListItemText primary={topic.title} primaryTypographyProps={{ variant: 'body2', fontWeight: active === topic.slug ? 600 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
