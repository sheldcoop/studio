import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pageHeaderVariants = cva(
  'mb-8 flex flex-col items-center justify-center text-center',
  {
    variants: {
      variant: {
        centered: 'items-center justify-center text-center',
        'aligned-left': 'items-start justify-start text-left',
      },
    },
    defaultVariants: {
      variant: 'centered',
    },
  }
);

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pageHeaderVariants> {
  title: string;
  description?: string;
  children?: ReactNode;
}


export function PageHeader({ title, description, children, variant, className }: PageHeaderProps) {
  return (
    <div className={cn(pageHeaderVariants({ variant, className }))}>
      <div className="grid flex-1 gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
