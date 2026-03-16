'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Grid2';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import TopicIcon from '@mui/icons-material/Category';
import TranslateIcon from '@mui/icons-material/Translate';
import { Link } from '@/i18n/navigation';
import useAdminDashboard from '@/hooks/useAdminDashboard';

const CARDS = [
  { key: 'users' as const, label: 'Users', href: '/admin/users', icon: <PeopleIcon sx={{ fontSize: 48 }} color="primary" /> },
  { key: 'questions' as const, label: 'Questions', href: '/admin/questions', icon: <QuizIcon sx={{ fontSize: 48 }} color="secondary" /> },
  { key: 'topics' as const, label: 'Topics', href: '/admin/topics', icon: <TopicIcon sx={{ fontSize: 48 }} color="success" /> },
  { key: 'translations' as const, label: 'Translations', href: '/admin/translations', icon: <TranslateIcon sx={{ fontSize: 48 }} color="info" /> },
];

export default function AdminDashboardPage() {
  const { counts, loading, error } = useAdminDashboard();

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Admin Dashboard</Typography>
      <Grid2 container spacing={3}>
        {CARDS.map(({ key, label, href, icon }) => (
          <Grid2 key={key} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardActionArea component={Link} href={href}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  {icon}
                  <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>{counts[key]}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">{label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
