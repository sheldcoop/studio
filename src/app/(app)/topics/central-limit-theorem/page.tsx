
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CLT_Interactive_Dashboard } from '@/components/app/clt-interactive-dashboard';

export default function CentralLimitTheoremPage() {

  return (
    <>
      <PageHeader
        title="The Central Limit Theorem (CLT)"
        description="Discover how order emerges from chaos, a cornerstone of statistics."
        variant="aligned-left"
      />

      <div className="mx-auto max-w-7xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Why is the CLT so Powerful?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In the real world, we rarely know the true distribution of a population. Are stock returns normally distributed? Is trade volume exponentially distributed? We often don't know, and the data is usually messy.
            </p>
            <p>
              The Central Limit Theorem provides a powerful, almost magical solution. It guarantees that if we take a large enough number of samples from <span className="font-semibold text-primary">any population</span> and calculate the mean of each sample, the distribution of those sample means will be approximately normal (a bell curve).
            </p>
            <p>
                This is the bridge from messy, unknown real-world data to the predictable world of statistical inference. It allows us to use the properties of the normal distribution to perform hypothesis tests and construct confidence intervals for a population's mean, even when we know nothing about the population itself.
            </p>
          </CardContent>
        </Card>
        
        <CLT_Interactive_Dashboard />
      </div>
    </>
  );
}

    
