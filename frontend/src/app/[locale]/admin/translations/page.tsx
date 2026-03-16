'use client';

import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { adminApi } from '@/lib/apiClient';

type TranslationData = Record<string, unknown>;

interface JsonEditorProps {
  data: TranslationData;
  path: string;
  onChange: (path: string, value: string) => void;
}

function JsonEditor({ data, path, onChange }: JsonEditorProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ pl: path ? 2 : 0 }}>
      {Object.entries(data).map(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const isExpanded = expanded[key] ?? true;
          return (
            <Box key={key} sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  py: 0.5,
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                }}
                onClick={() => toggleExpand(key)}
              >
                <IconButton size="small">
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Typography variant="subtitle2" fontWeight={600} color="primary">
                  {key}
                </Typography>
              </Box>
              <Collapse in={isExpanded}>
                <JsonEditor
                  data={value as TranslationData}
                  path={fullPath}
                  onChange={onChange}
                />
              </Collapse>
            </Box>
          );
        }

        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 4 }}>
            <Typography
              variant="body2"
              sx={{ minWidth: 180, fontFamily: 'monospace', color: 'text.secondary' }}
            >
              {key}:
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={String(value ?? '')}
              onChange={(e) => onChange(fullPath, e.target.value)}
            />
          </Box>
        );
      })}
    </Box>
  );
}

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

export default function AdminTranslationsPage() {
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

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  const handleChange = (locale: string, path: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: setNestedValue(prev[locale], path, value),
    }));
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Translations Editor
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {locales.length === 0 ? (
        <Alert severity="info">No translations found</Alert>
      ) : (
        <>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
            {locales.map((locale) => (
              <Tab key={locale} label={locale.toUpperCase()} />
            ))}
          </Tabs>

          {locales.map((locale, index) => (
            <Box key={locale} role="tabpanel" hidden={activeTab !== index}>
              {activeTab === index && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                      onClick={() => handleSave(locale)}
                      disabled={saving}
                    >
                      Save {locale.toUpperCase()}
                    </Button>
                  </Box>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                    <JsonEditor
                      data={translations[locale]}
                      path=""
                      onChange={(path, value) => handleChange(locale, path, value)}
                    />
                  </Box>
                </>
              )}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
