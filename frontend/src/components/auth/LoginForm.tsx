'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from '@/i18n/navigation';
import { useLoginForm } from '@/hooks/useAuthForm';

export default function LoginForm() {
  const { t, loading, error, email, setEmail, password, setPassword, fieldErrors, handleSubmit, clearError } = useLoginForm();

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" gutterBottom>{t('loginTitle')}</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>{error}</Alert>}
      <TextField fullWidth label={t('emailLabel')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!fieldErrors.email} helperText={fieldErrors.email} margin="normal" autoComplete="email" autoFocus />
      <TextField fullWidth label={t('passwordLabel')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!fieldErrors.password} helperText={fieldErrors.password} margin="normal" autoComplete="current-password" />
      <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2 }}>
        {loading ? <CircularProgress size={24} color="inherit" /> : t('loginButton')}
      </Button>
      <Typography variant="body2" textAlign="center">
        {t('noAccount')} <MuiLink component={Link} href="/register">{t('signUpLink')}</MuiLink>
      </Typography>
    </Box>
  );
}
