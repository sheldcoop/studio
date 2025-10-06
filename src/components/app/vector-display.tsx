
'use client';

import { cn } from "@/lib/utils";

interface VectorDisplayProps {
  label: React.ReactNode;
  coords: string; // Expecting a string like "(x.xx, y.yy)"
  labelClassName?: string;
}

export function VectorDisplay({ label, coords, labelClassName }: VectorDisplayProps) {
  // Parse the coordinates string
  const [x, y] = coords.replace(/[()]/g, '').split(',').map(s => s.trim());

  return (
    <div className="text-center">
      <p className={cn("text-sm", labelClassName)}>{label}</p>
      <div className="mt-2 flex items-center justify-center space-x-2 font-mono text-xl">
          <div className="text-muted-foreground text-4xl">[</div>
          <div className="flex flex-col items-center">
              <span>{x || '...'}</span>
              <span>{y || '...'}</span>
          </div>
          <div className="text-muted-foreground text-4xl">]</div>
      </div>
    </div>
  );
}
