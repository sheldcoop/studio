

// src/app/layout.tsx (Correct Version)

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { OrientationBanner } from '@/components/app/orientation-banner';
import { Providers } from '@/components/app/providers';

const fontBody = Inter({ subsets: ['latin'], variable: '--font-body' });
const fontHeadline = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantfinancelab.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
    template: `%s | QuantPrep`,
  },
  description: "Master the core concepts of quantitative finance with AI-powered tools, interactive guides, and a community of learners.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
    description: 'The ultimate platform for mastering quantitative finance, from theory to application.',
    url: siteUrl,
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
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'QuantPrep',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://twitter.com/QuantPrep',
    'https://www.linkedin.com/company/quantprep',
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="stylesheet" href="https://pyscript.net/releases/2025.8.1/core.css" />
        <script type="module" src="https://pyscript.net/releases/2025.8.1/core.js"></script>
      </head>
      <body className={cn('font-body antialiased', fontBody.variable, fontHeadline.variable)}>
        <Providers>
          {children}
          <OrientationBanner />
        </Providers>
        <script type="py" src="/python/solver.py" config="/pyscript.json" worker="false"></script>
      </body>
    </html>
  );
}
