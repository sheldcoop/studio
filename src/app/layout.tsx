
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/app/theme-provider';
import { AuthProvider } from '@/app/auth-provider';
import { OrientationBanner } from '@/components/app/orientation-banner';

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
      </head>
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
          <AuthProvider>
            {children}
            <OrientationBanner />
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
