import { loginSchema, registerSchema } from './validators';

describe('loginSchema', () => {
  it('validates a correct login payload', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'notanemail', password: 'secret123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address');
    }
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '12345' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
    }
  });

  it('accepts a password of exactly 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('registerSchema', () => {
  const validPayload = { username: 'User1', email: 'test@example.com', password: 'Abcdefg1' };

  it('validates a correct register payload', () => {
    const result = registerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  describe('username validation', () => {
    it('rejects username shorter than 3 characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, username: 'ab' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username must be at least 3 characters');
      }
    });

    it('rejects username longer than 20 characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, username: 'A1bcdefghijklmnopqrstu' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username must be at most 20 characters');
      }
    });

    it('rejects username with special characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, username: 'user_name!' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'Username must contain only letters and numbers')).toBe(true);
      }
    });

    it('accepts username of exactly 3 characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, username: 'abc' });
      expect(result.success).toBe(true);
    });

    it('accepts username of exactly 20 characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, username: 'Abcdefghij1234567890' });
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('rejects an invalid email', () => {
      const result = registerSchema.safeParse({ ...validPayload, email: 'bademail' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });
  });

  describe('password validation', () => {
    it('rejects password shorter than 8 characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, password: 'Abcde1' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'Password must be at least 8 characters')).toBe(true);
      }
    });

    it('rejects password without an uppercase letter', () => {
      const result = registerSchema.safeParse({ ...validPayload, password: 'abcdefg1' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'Password must contain at least one uppercase letter')).toBe(true);
      }
    });

    it('rejects password without a lowercase letter', () => {
      const result = registerSchema.safeParse({ ...validPayload, password: 'ABCDEFG1' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'Password must contain at least one lowercase letter')).toBe(true);
      }
    });

    it('rejects password without a digit', () => {
      const result = registerSchema.safeParse({ ...validPayload, password: 'Abcdefgh' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'Password must contain at least one digit')).toBe(true);
      }
    });

    it('accepts password of exactly 8 valid characters', () => {
      const result = registerSchema.safeParse({ ...validPayload, password: 'Abcdefg1' });
      expect(result.success).toBe(true);
    });
  });
});
