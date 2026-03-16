'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Grid2';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import TopicIcon from '@mui/icons-material/Category';
import TranslateIcon from '@mui/icons-material/Translate';
import { adminApi } from '@/lib/apiClient';
import { Link } from '@/i18n/navigation';

interface DashboardCounts {
  users: number;
  questions: number;
  topics: number;
  translations: number;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    questions: 0,
    topics: 0,
    translations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, questionsRes, topicsRes, translationsRes] =
          await Promise.all([
            adminApi.getUsers(),
            adminApi.getQuestions(),
            adminApi.getTopics(),
            adminApi.getTranslations(),
          ]);
        setCounts({
          users: usersRes.data.users.length,
          questions: questionsRes.data.questions.length,
          topics: topicsRes.data.topics.length,
          translations: Object.keys(translationsRes.data.translations).length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  const cards = [
    { label: 'Users', count: counts.users, href: '/admin/users', icon: <PeopleIcon sx={{ fontSize: 48 }} color="primary" /> },
    { label: 'Questions', count: counts.questions, href: '/admin/questions', icon: <QuizIcon sx={{ fontSize: 48 }} color="secondary" /> },
    { label: 'Topics', count: counts.topics, href: '/admin/topics', icon: <TopicIcon sx={{ fontSize: 48 }} color="success" /> },
    { label: 'Translations', count: counts.translations, href: '/admin/translations', icon: <TranslateIcon sx={{ fontSize: 48 }} color="info" /> },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid2 container spacing={3}>
        {cards.map(({ label, count, href, icon }) => (
          <Grid2 key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardActionArea component={Link} href={href}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  {icon}
                  <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
                    {count}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
