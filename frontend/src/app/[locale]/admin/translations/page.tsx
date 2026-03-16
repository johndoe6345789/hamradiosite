'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import JsonEditor from '@/components/admin/JsonEditor';
import useAdminTranslations from '@/hooks/useAdminTranslations';

export default function AdminTranslationsPage() {
  const t = useAdminTranslations();

  if (t.loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Translations Editor</Typography>
      {t.error && <Alert severity="error" sx={{ mb: 2 }}>{t.error}</Alert>}
      {t.success && <Alert severity="success" sx={{ mb: 2 }}>{t.success}</Alert>}
      {t.locales.length === 0 ? (
        <Alert severity="info">No translations found</Alert>
      ) : (
        <>
          <Tabs value={t.activeTab} onChange={(_, v) => t.setActiveTab(v)} sx={{ mb: 2 }}>
            {t.locales.map((locale) => <Tab key={locale} label={locale.toUpperCase()} />)}
          </Tabs>
          {t.locales.map((locale, index) => (
            <Box key={locale} role="tabpanel" hidden={t.activeTab !== index}>
              {t.activeTab === index && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained" startIcon={t.saving ? <CircularProgress size={16} /> : <SaveIcon />} onClick={() => t.handleSave(locale)} disabled={t.saving}>
                      Save {locale.toUpperCase()}
                    </Button>
                  </Box>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                    <JsonEditor data={t.translations[locale]} path="" onChange={(path, value) => t.handleChange(locale, path, value)} />
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
