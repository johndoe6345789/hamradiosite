'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from '@/i18n/navigation';
import { useRegisterForm } from '@/hooks/useAuthForm';

export default function RegisterForm() {
  const f = useRegisterForm();

  return (
    <Box component="form" onSubmit={f.handleSubmit} noValidate>
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" gutterBottom>{f.t('registerTitle')}</Typography>
      {f.error && <Alert severity="error" sx={{ mb: 3 }} onClose={f.clearError}>{f.error}</Alert>}
      <TextField fullWidth label={f.t('usernameLabel')} value={f.username} onChange={(e) => f.setUsername(e.target.value)} error={!!f.fieldErrors.username} helperText={f.fieldErrors.username} margin="normal" autoComplete="username" autoFocus />
      <TextField fullWidth label={f.t('emailLabel')} type="email" value={f.email} onChange={(e) => f.setEmail(e.target.value)} error={!!f.fieldErrors.email} helperText={f.fieldErrors.email} margin="normal" autoComplete="email" />
      <TextField fullWidth label={f.t('passwordLabel')} type="password" value={f.password} onChange={(e) => f.setPassword(e.target.value)} error={!!f.fieldErrors.password} helperText={f.fieldErrors.password} margin="normal" autoComplete="new-password" />
      <TextField fullWidth label={f.t('confirmPasswordLabel')} type="password" value={f.confirmPassword} onChange={(e) => f.setConfirmPassword(e.target.value)} error={!!f.fieldErrors.confirmPassword} helperText={f.fieldErrors.confirmPassword} margin="normal" autoComplete="new-password" />
      <Button type="submit" fullWidth variant="contained" size="large" disabled={f.loading} sx={{ mt: 3, mb: 2 }}>
        {f.loading ? <CircularProgress size={24} color="inherit" /> : f.t('registerButton')}
      </Button>
      <Typography variant="body2" textAlign="center">
        {f.t('hasAccount')} <MuiLink component={Link} href="/login">{f.t('loginLink')}</MuiLink>
      </Typography>
    </Box>
  );
}
