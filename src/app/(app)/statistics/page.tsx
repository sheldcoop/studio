import { PageHeader } from '@/components/app/page-header';

export default function StatisticsPage() {
  return (
    <>
      <PageHeader
        title="Statistics"
        description="The science of collecting, analyzing, and interpreting data."
      />
      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
        <p className="text-muted-foreground">
          Content for this page is coming soon.
        </p>
      </div>
    </>
  );
}
