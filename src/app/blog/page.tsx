import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, articles, and updates from the QuantPrep team.',
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Blog"
        description="Insights, articles, and updates from the QuantPrep team."
      />
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-96">
            <Newspaper className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">
              Our blog is coming soon!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back later for articles on quantitative finance, interview tips, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
