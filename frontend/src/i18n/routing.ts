import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'cy', 'gd', 'ga', 'kw', 'pirate'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
