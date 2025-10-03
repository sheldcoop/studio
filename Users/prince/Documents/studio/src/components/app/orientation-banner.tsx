
'use client';

import { useState } from 'react';
import { Smartphone, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function OrientationBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const isMobile = useIsMobile();

  if (isDismissed || !isMobile) {
    return null;
  }

  return (
    <div className="landscape:hidden pointer-events-none fixed inset-x-0 bottom-0 z-50 p-4 md:hidden">
      <div className="pointer-events-auto mx-auto w-full max-w-sm rounded-lg bg-background/95 p-4 shadow-lg ring-1 ring-border backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              For a better experience, rotate your device to landscape mode.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
