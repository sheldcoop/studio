import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ProbabilityDistributionPageClient = dynamic(
  () => import('@/components/app/probability-distribution-page-client'),
  {
    ssr: false,
    loading: () => <div className="space-y-8">
      <div className="flex justify-center gap-4 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-[300px] w-full" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>,
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const path = getPathById('probability-for-quants');

  if (!path) {
    return {
      title: 'Probability Path Not Found',
    };
  }

  return {
    title: 'Probability Distributions Explorer',
    description: 'An interactive guide to the fundamental probability distributions used in quantitative finance.',
  };
}

export default function ProbabilityPage() {
  const path = getPathById('probability-for-quants');
  if (!path) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Probability Distributions Explorer"
        description="An interactive guide to the fundamental probability distributions used in quantitative finance."
        variant="aligned-left"
      />
      <ProbabilityDistributionPageClient />
    </>
  );
}
