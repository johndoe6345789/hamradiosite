import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(cy|en|gd|ga|kw|pirate)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
