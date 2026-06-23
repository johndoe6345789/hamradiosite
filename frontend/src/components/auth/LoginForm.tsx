'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useRouter } from '@/i18n/navigation';
import { useLoginForm } from '@/hooks/useAuthForm';
import { useAppDispatch } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import TurboErrorDialog from './TurboErrorDialog';

export default function LoginForm() {
  const {
    t, loading, error, email, setEmail,
    password, setPassword, fieldErrors, handleSubmit, clearError,
  } = useLoginForm();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [turboError, setTurboError] = useState<string | null>(null);

  const handleTurboLogin = async () => {
    try {
      const raw = await navigator.clipboard.readText();
      if (!raw.trim()) {
        setTurboError('Clipboard is empty. Copy a Turbologin from Vault first.');
        return;
      }
      let data: Record<string, unknown>;
      try { data = JSON.parse(raw); } catch {
        setTurboError('Clipboard does not contain valid Turbologin JSON.');
        return;
      }
      if (!data.user || !data.pass) {
        setTurboError('Clipboard JSON is missing required fields (user, pass).');
        return;
      }
      setEmail(data.user as string);
      setPassword(data.pass as string);
      const action = await dispatch(
        loginUser({ email: data.user as string, password: data.pass as string })
      );
      if (loginUser.fulfilled.match(action)) router.push('/');
    } catch {
      setTurboError(
        'Could not read clipboard. Please allow clipboard access and try again.'
      );
    }
  };

  return (
    <>
      <TurboErrorDialog
        open={!!turboError}
        message={turboError ?? ''}
        onClose={() => setTurboError(null)}
      />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" gutterBottom>
          {t('loginTitle')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth label={t('emailLabel')} type="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          error={!!fieldErrors.email} helperText={fieldErrors.email}
          margin="normal" autoComplete="email" autoFocus
        />
        <TextField
          fullWidth label={t('passwordLabel')} type="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          error={!!fieldErrors.password} helperText={fieldErrors.password}
          margin="normal" autoComplete="current-password"
        />
        <Button
          type="submit" fullWidth variant="contained"
          size="large" disabled={loading} sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('loginButton')}
        </Button>
        <Button
          type="button" fullWidth variant="outlined"
          size="large" disabled={loading} sx={{ mb: 2 }}
          onClick={handleTurboLogin}
          data-testid="turbo-login-button"
        >
          ⚡ Turbologin
        </Button>
        <Typography variant="body2" textAlign="center">
          {t('noAccount')}{' '}
          <MuiLink component={Link} href="/register">{t('signUpLink')}</MuiLink>
        </Typography>
      </Box>
    </>
  );
}
