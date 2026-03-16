import { useEffect, useState } from 'react';
import { topicsApi } from '@/lib/apiClient';
import type { Topic } from '@/types/topic';

export default function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    topicsApi.getAll()
      .then((res) => {
        const data = res.data as unknown as { topics: Topic[] };
        setTopics(Array.isArray(data) ? data : data.topics ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { topics, loading };
}
