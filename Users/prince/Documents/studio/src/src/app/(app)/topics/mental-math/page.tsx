'use client';

import { PageHeader } from '@/components/app/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MentalMathQuiz = dynamic(
  () => import('@/components/app/mental-math-quiz').then((mod) => mod.MentalMathQuiz),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full max-w-2xl" />,
  }
);

export default function MentalMathPage() {
  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title="Mental Math Practice"
        description="Sharpen your calculation speed for quant interviews. Every second counts."
      />
      <div className="flex flex-1 items-center justify-center">
        <MentalMathQuiz />
      </div>
    </div>
  );
}
