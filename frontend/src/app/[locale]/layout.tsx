import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import StoreProvider from '@/store/StoreProvider';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'cy')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StoreProvider>
        <ThemeRegistry>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 128px)' }}>{children}</main>
          <Footer />
        </ThemeRegistry>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}
