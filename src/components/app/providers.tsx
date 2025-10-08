
'use client';

import { ThemeProvider } from '@/components/app/theme-provider';
import { AuthProvider } from '@/app/auth-provider';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      themes={['light', 'dark', 'slate', 'nocturne', 'quant']}
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}
