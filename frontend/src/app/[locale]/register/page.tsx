'use client';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <RegisterForm />
      </Box>
    </Container>
  );
}
