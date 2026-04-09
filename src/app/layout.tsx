import type { Metadata, Viewport } from 'next';
import type { ThemeProviderProps } from 'next-themes';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme/AppThemeProvider';
import { AppShell } from './AppShell';
import { generateWebsiteSchema, generateOrganizationSchema } from '@/lib/seo';
import { buildThemeHeadScript } from '@/lib/theme-head-inline';

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
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://calc-hub.site'),
  title: {
    default: 'صِحتي | حاسباتك الصحية الذكية',
    template: '%s | صِحتي',
  },
  description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية. حاسبات السعرات ومؤشر كتلة الجسم، مقالات صحية متخصصة، جداول تغذية، ونصائح صحية موثوقة.',
  keywords: [
    'صحتي',
    'حاسبة السعرات الحرارية',
    'BMI حاسبة',
    'حاسبة الماء',
    'الوزن المثالي',
    'تغذية صحية',
    'صحة وغذاء',
    'لياقة بدنية',
    'إنقاص الوزن',
    'بناء العضلات',
    'رياضة وصحة',
    'حمية غذائية',
    'معدل الأيض',
    'صحة عامة',
  ],
  authors: [{ name: 'صِحتي', url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: 'صِحتي',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    countryName: 'Saudi Arabia',
    siteName: 'صِحتي',
    title: 'صِحتي | حاسباتك الصحية الذكية',
    description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'صِحتي - حاسباتك الصحية الذكية',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'صِحتي',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'صِحتي | حاسباتك الصحية الذكية',
    description: 'منصة عربية متخصصة في الصحة واللياقة والتغذية',
    images: ['/og-image.png'],
    creator: '@sahti',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'صِحتي',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    'bingbot': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'YOUR_YANDEX_CODE',
    // bing: 'YOUR_BING_CODE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();

  const themeBootstrap: Pick<
    ThemeProviderProps,
    'attribute' | 'storageKey' | 'defaultTheme' | 'themes' | 'enableSystem' | 'enableColorScheme'
  > = {
    attribute: 'class',
    storageKey: 'theme',
    defaultTheme: 'light',
    themes: ['light', 'dark'],
    enableSystem: true,
    enableColorScheme: true,
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
          suppressHydrationWarning
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: buildThemeHeadScript(themeBootstrap),
          }}
        />
      </head>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider {...themeBootstrap} disableTransitionOnChange>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
