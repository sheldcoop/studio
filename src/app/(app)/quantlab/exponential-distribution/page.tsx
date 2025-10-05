
'use client';
import { PageHeader } from '@/components/app/page-header';

export default function ExponentialDistributionPage() {
    return (
        <>
        <PageHeader
            title="Exponential Distribution"
            description="Modeling the time until an event occurs in a Poisson process."
            variant="aligned-left"
        />
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
            <p className="text-muted-foreground">This page is temporarily unavailable while under maintenance.</p>
        </div>
        </>
    );
}
