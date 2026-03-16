import { useEffect, useState } from 'react';
import { topicsApi } from '@/lib/apiClient';
import type { TopicWithContent } from '@/types/topic';

export default function useTopicContent(slug: string) {
  const [topic, setTopic] = useState<TopicWithContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    topicsApi.getBySlug(slug)
      .then((res) => {
        const data = res.data as unknown as { topic: TopicWithContent } | TopicWithContent;
        setTopic('topic' in data ? data.topic : data);
      })
      .catch(() => setTopic({ id: '', title: 'Topic', slug, description: '', content: '<p>Content not available.</p>', icon: '', order: 0 }))
      .finally(() => setLoading(false));
  }, [slug]);

  return { topic, loading };
}
