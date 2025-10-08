import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/app/theme-provider';
import { OrientationBanner } from '@/components/app/orientation-banner';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'),
  title: {
    template: '%s | QuantPrep',
    default: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
  },
  description: 'Master the core concepts of quantitative finance with AI-powered tools, interactive guides, and a community of learners.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
    description: 'The ultimate platform for mastering quantitative finance, from theory to application.',
    url: '/',
    siteName: 'QuantPrep',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QuantPrep Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
    description: 'The ultimate platform for mastering quantitative finance, from theory to application.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'organization-schema': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'QuantPrep',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002',
      logo: new URL('/logo.png', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002').toString(),
      sameAs: [
        'https://twitter.com/QuantPrep',
        'https://www.linkedin.com/company/quantprep'
      ]
    }),
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body 
        className={cn(
          'font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['light', 'dark', 'slate', 'nocturne', 'quant']}
          disableTransitionOnChange
        >
            {children}
            <OrientationBanner />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
