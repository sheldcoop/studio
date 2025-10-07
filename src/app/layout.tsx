// src/app/layout.tsx (Final Corrected Version)

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { OrientationBanner } from '@/components/app/orientation-banner';
import { Providers } from '@/components/app/providers'; // Import the new component
import Script from 'next/script'; // Make sure this import is present

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantfinancelab.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | QuantPrep',
    default: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
  },
  description: 'Master the core concepts of quantitative finance with AI-powered tools, interactive guides, and a community of learners.',
  alternates: {
    canonical: '/',
  },
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
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'QuantPrep',
  url: siteUrl,
  logo: new URL('/logo.png', siteUrl).toString(),
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
        {/* All CSS links go here */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://pyscript.net/releases/2023.11.1/css/pyscript.css" />

        {/* --- THIS IS THE FIX (PART 1) --- */}
        {/* We use next/script's onLoad to fire a custom event when PyScript is truly ready. */}
        <Script
          src="https://pyscript.net/releases/2023.11.1/core.js"
          strategy="afterInteractive"
          onLoad={() => {
            // This code runs ONLY after core.js has loaded.
            console.log("Next.js onLoad: PyScript core.js has loaded. Firing custom event.");
            document.dispatchEvent(new Event('pyscript-loaded'));
          }}
        />
      </head>
      <body 
        className={cn(
          'font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        {/* Use the Providers component to wrap children */}
        <Providers>
          {children}
          <OrientationBanner />
        </Providers>
        
        {/* Prism.js scripts can be loaded here at the end */}
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js"></script>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>
      </body>
    </html>
  );
}
