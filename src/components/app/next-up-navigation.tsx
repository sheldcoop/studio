
import Link from 'next/link';

interface NextUpNavigationProps {
    href: string;
    children: React.ReactNode;
}

export function NextUpNavigation({ href, children }: NextUpNavigationProps) {
  return (
    <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong>{' '}
        <Link href={href} className="font-semibold text-primary hover:underline">
            {children}
        </Link>
    </p>
  );
}
