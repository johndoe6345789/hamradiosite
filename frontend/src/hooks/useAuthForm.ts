import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, registerUser, clearError } from '@/store/slices/authSlice';
import { loginSchema, registerSchema } from '@/lib/validators';
import { useRouter } from '@/i18n/navigation';

function validateWithZod(schema: typeof loginSchema | typeof registerSchema, data: Record<string, string>) {
  const result = schema.safeParse(data);
  if (result.success) return null;
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    errors[issue.path[0] as string] = issue.message;
  });
  return errors;
}

export function useLoginForm() {
  const t = useTranslations('auth');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setFieldErrors({});
    const errors = validateWithZod(loginSchema, { email, password });
    if (errors) { setFieldErrors(errors); return; }
    const action = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(action)) router.push('/');
  };

  return { t, loading, error, email, setEmail, password, setPassword, fieldErrors, handleSubmit, clearError: () => dispatch(clearError()) };
}

export function useRegisterForm() {
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
    if (password !== confirmPassword) { setFieldErrors({ confirmPassword: t('passwordsMustMatch') }); return; }
    const errors = validateWithZod(registerSchema, { username, email, password });
    if (errors) { setFieldErrors(errors); return; }
    const action = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(action)) router.push('/');
  };

  return { t, loading, error, username, setUsername, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, fieldErrors, handleSubmit, clearError: () => dispatch(clearError()) };
}
