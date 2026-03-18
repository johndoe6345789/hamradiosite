import { useEffect, useState } from 'react';
import { glossaryApi } from '@/lib/apiClient';
import type { GlossaryEntry } from '@/types/glossary';

export default function useGlossary() {
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);

  useEffect(() => {
    glossaryApi.getAll()
      .then((res) => {
        const data = res.data as unknown as { glossary: GlossaryEntry[] };
        setGlossary(Array.isArray(data) ? data : data.glossary ?? []);
      })
      .catch(() => {});
  }, []);

  return glossary;
}
