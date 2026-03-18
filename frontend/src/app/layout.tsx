import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HamPrep - Foundation Ham Radio Exam',
  description:
    'Interactive preparation for the UK Foundation Amateur Radio Examination',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
