import '@testing-library/jest-dom';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const messages = require('./src/messages/en.json');

jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    const section = namespace
      ? namespace.split('.').reduce((obj: Record<string, unknown>, key: string) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] as Record<string, unknown> : {}), messages as Record<string, unknown>)
      : messages;
    return (key: string, params?: Record<string, string | number>) => {
      const value = section && typeof section === 'object' ? (section as Record<string, string>)[key] : undefined;
      if (typeof value === 'string' && params) {
        return value.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`));
      }
      return typeof value === 'string' ? value : key;
    };
  },
  useLocale: () => 'en',
  useMessages: () => messages,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((_config: unknown, reducer: unknown) => reducer),
    persistStore: jest.fn().mockReturnValue({
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
      purge: jest.fn(),
      flush: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
    }),
  };
});

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: { children: React.ReactNode }) => children,
}));
