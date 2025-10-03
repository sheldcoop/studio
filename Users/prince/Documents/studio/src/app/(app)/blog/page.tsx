
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles, insights, and updates from the QuantPrep team.',
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="QuantPrep Blog"
        description="Articles, insights, and updates from our team."
        variant="aligned-left"
      />
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">
              Our blog is currently under construction.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We're preparing insightful articles and will launch this section soon. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
