
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Rocket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col">
        <div className="flex flex-1 items-center justify-center text-center">
            <div>
                <Rocket className="mx-auto h-16 w-16 text-primary" />
                <PageHeader 
                    title="404 - Page Not Found"
                    description="Oops! It looks like you've ventured into uncharted territory. The page you're looking for doesn't exist."
                />
                <Button asChild>
                    <Link href="/">Return to Home</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
