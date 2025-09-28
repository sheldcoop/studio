import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import Script from 'next/script';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});


export const metadata: Metadata = {
  title: {
    template: '%s | QuantPrep',
    default: 'QuantPrep | AI-Powered Learning for Quantitative Finance',
  },
  description: 'Master the core concepts of quantitative finance with AI-powered tools, interactive guides, and a community of learners.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body 
        className={cn(
          'font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
