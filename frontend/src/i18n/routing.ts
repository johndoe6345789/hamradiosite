import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'cy'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
