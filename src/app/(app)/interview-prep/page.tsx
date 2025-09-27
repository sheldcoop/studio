import type { Metadata } from 'next';
import { InterviewGenerator } from '@/components/app/interview-generator';
import { PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = {
  title: 'AI Interview Question Generator',
  description: 'Leverage AI to generate unlimited, realistic practice questions for your upcoming quantitative finance interviews and sharpen your skills.',
};

export default function InterviewPrepPage() {
  return (
    <>
      <PageHeader
        title="Interview Question Generator"
        description="Leverage AI to generate unlimited practice questions for your quant interviews."
      />
      <InterviewGenerator />
    </>
  );
}
