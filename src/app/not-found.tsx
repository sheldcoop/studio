import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Rocket } from 'lucide-react';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center text-center p-4">
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
      </main>
      <Footer />
    </div>
  );
}
