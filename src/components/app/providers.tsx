
'use client';

import { ThemeProvider } from '@/components/app/theme-provider';
import { AuthProvider } from '@/app/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider, useFirebase } from '@/firebase/provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const { app, auth, firestore } = useFirebase();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      themes={['light', 'dark', 'slate', 'nocturne', 'quant']}
      disableTransitionOnChange
    >
      <FirebaseProvider app={app} auth={auth} firestore={firestore}>
        <AuthProvider>
            {children}
        </AuthProvider>
      </FirebaseProvider>
      <Toaster />
    </ThemeProvider>
  );
}
