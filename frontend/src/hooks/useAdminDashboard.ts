import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/apiClient';

interface DashboardCounts {
  users: number;
  questions: number;
  topics: number;
  translations: number;
}

export default function useAdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts>({ users: 0, questions: 0, topics: 0, translations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [u, q, t, tr] = await Promise.all([adminApi.getUsers(), adminApi.getQuestions(), adminApi.getTopics(), adminApi.getTranslations()]);
        setCounts({
          users: u.data.users.length,
          questions: q.data.questions.length,
          topics: t.data.topics.length,
          translations: Object.keys(tr.data.translations).length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { counts, loading, error };
}
