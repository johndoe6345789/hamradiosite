'use client';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  );
}
