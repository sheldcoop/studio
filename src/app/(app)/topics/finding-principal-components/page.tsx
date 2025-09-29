'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubTopicPage() {
  return (
    <div className="mx-auto max-w-4xl">
        <PageHeader 
            title="Finding Principal Components using Eigendecomposition"
            description="Using eigenvalues and eigenvectors to find principal components."
            variant="aligned-left"
        />
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Core Concept</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    This page is dedicated to the sub-topic "Finding Principal Components using Eigendecomposition". Detailed content, interactive examples, and step-by-step guides will be added here.
                </p>
            </CardContent>
        </Card>

        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
            <p className="text-muted-foreground">Content for Finding Principal Components using Eigendecomposition is under construction.</p>
        </div>
    </div>
  );
}

    