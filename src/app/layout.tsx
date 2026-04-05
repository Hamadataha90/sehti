import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { AppShell } from './AppShell';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'صِحتي | حاسباتك الصحية الذكية',
  description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية. حاسبات السعرات ومؤشر كتلة الجسم، مقالات صحية متخصصة، ونصائح غذائية مجانية.',
  keywords: [
    'صحتي',
    'حاسبة السعرات',
    'حاسبة BMI',
    'حاسبة الماء',
    'الوزن المثالي',
    'تغذية',
    'صحة',
    'لياقة',
    'إنقاص الوزن',
    'بناء العضلات',
    'رياضة',
    'حمية',
  ],
  authors: [{ name: 'صِحتي' }],
  openGraph: {
    title: 'صِحتي | حاسباتك الصحية الذكية',
    description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'صِحتي',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'صِحتي | حاسباتك الصحية الذكية',
    description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
