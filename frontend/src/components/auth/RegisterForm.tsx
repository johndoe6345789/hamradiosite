'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { registerSchema } from '@/lib/validators';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { Link, useRouter } from '@/i18n/navigation';

export default function RegisterForm() {
  const t = useTranslations('auth');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: t('passwordsMustMatch') });
      return;
    }

    const result = registerSchema.safeParse({ username, email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    const action = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(action)) {
      router.push('/');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" gutterBottom>
        {t('registerTitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label={t('usernameLabel')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!fieldErrors.username}
        helperText={fieldErrors.username}
        margin="normal"
        autoComplete="username"
        autoFocus
      />

      <TextField
        fullWidth
        label={t('emailLabel')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        margin="normal"
        autoComplete="email"
      />

      <TextField
        fullWidth
        label={t('passwordLabel')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        margin="normal"
        autoComplete="new-password"
      />

      <TextField
        fullWidth
        label={t('confirmPasswordLabel')}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!fieldErrors.confirmPassword}
        helperText={fieldErrors.confirmPassword}
        margin="normal"
        autoComplete="new-password"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : t('registerButton')}
      </Button>

      <Typography variant="body2" textAlign="center">
        {t('hasAccount')}{' '}
        <MuiLink component={Link} href="/login">
          {t('loginLink')}
        </MuiLink>
      </Typography>
    </Box>
  );
}
