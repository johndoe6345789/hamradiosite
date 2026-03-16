import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/apiClient';

type TranslationData = Record<string, unknown>;

function setNestedValue(obj: TranslationData, path: string, value: string): TranslationData {
  const keys = path.split('.');
  const result = { ...obj };
  let current: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...(current[key] as Record<string, unknown>) };
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

export default function useAdminTranslations() {
  const [translations, setTranslations] = useState<Record<string, TranslationData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const locales = Object.keys(translations);

  const fetchTranslations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTranslations();
      setTranslations(res.data.translations as Record<string, TranslationData>);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load translations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTranslations(); }, [fetchTranslations]);

  const handleChange = (locale: string, path: string, value: string) => {
    setTranslations((prev) => ({ ...prev, [locale]: setNestedValue(prev[locale], path, value) }));
    setSuccess(null);
  };

  const handleSave = async (locale: string) => {
    try {
      setSaving(true);
      await adminApi.updateTranslations(locale, translations[locale]);
      setSuccess(`Translations for "${locale}" saved successfully`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save translations');
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  };

  return { translations, locales, loading, saving, error, success, activeTab, setActiveTab, handleChange, handleSave };
}
