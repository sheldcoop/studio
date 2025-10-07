
'use client';

import { ThemeProvider } from '@/components/app/theme-provider';
import { AuthProvider } from '@/app/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

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

      {/* External Scripts are managed here, in a Client Component */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://pyscript.net/releases/2023.11.1/css/pyscript.css" />

      <Script
        src="https://pyscript.net/releases/2023.11.1/core.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("PyScript core.js has loaded. Firing custom event.");
          document.dispatchEvent(new Event('pyscript-loaded'));
        }}
      />
      <Script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js" />
      <Script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js" />
      <Script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js" />
      <Script async src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js" />
    </ThemeProvider>
  );
}
