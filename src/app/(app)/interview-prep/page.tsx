import { InterviewGenerator } from '@/components/app/interview-generator';
import { PageHeader } from '@/components/app/page-header';

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
