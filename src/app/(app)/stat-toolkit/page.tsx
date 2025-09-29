
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { allTopics } from '@/lib/curriculum';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STATS_TIERS = [
  'stats-foundations',
  'stats-intermediate',
  'stats-advanced',
] as const;

export default function StatToolkitPage() {
  const tiers = STATS_TIERS.map(tierId => {
    const tierInfo = allTopics.find(t => t.id === tierId);
    const concepts = allTopics.filter(t => t.parent === tierId);
    return {
      ...tierInfo,
      concepts,
    };
  });
  
  const hypothesisTestingTopic = allTopics.find(t => t.id === 'hypothesis-testing-p-values');

  return (
    <>
      <PageHeader
        title="Statistician's Toolkit"
        description="Explore and understand the core concepts of statistics for quantitative analysis."
      />

      {hypothesisTestingTopic && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">A Quant's Detective Kit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{hypothesisTestingTopic.title}</h3>
                <p className="text-muted-foreground">{hypothesisTestingTopic.description}</p>
              </div>
              <Link href={hypothesisTestingTopic.href} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                Explore Tests <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6 bg-card/70">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Demystifying Hypothesis Testing: A Beginner's Guide
          </CardTitle>
          <CardDescription>
            Is it a real effect or just random chance? Let's find out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-base leading-relaxed text-foreground/90">
          <p>
            Ever see a headline like "New Trading Strategy Boosts Profits!"
            and wonder if it's true? Hypothesis testing is the statistical
            tool that helps us determine if a claim has real evidence to back
            it up. We'll follow two stories: the **☕ Coffee Experiment** and
            the **📈 Trading Algorithm**.
          </p>

          <div>
            <h4 className="font-semibold text-lg">Step 1: It All Starts with Data</h4>
            <p className="text-muted-foreground mt-1">
              Before we can make any claims, we need evidence. For the coffee
              experiment, this is alertness scores from two groups. For the
              trading algorithm, it's daily returns from the new vs. old
              strategy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg">
              Step 2: Ask a Question (The Hypotheses)
            </h4>
            <p className="text-muted-foreground mt-1">
              We formalize our question into two competing statements.
            </p>
            <div className="mt-2 space-y-2 rounded-lg border p-4">
              <p>
                <strong>On Trial: The Null Hypothesis (H₀)</strong>
                <br />
                This is the skeptic's view. It assumes no effect.
                <br />
                <span className="text-sm">
                  <em>
                    ☕ Coffee H₀: The new coffee has no effect on alertness.
                  </em>
                </span>
              </p>
              <p>
                <strong>The Challenger: The Alternative Hypothesis (Hₐ)</strong>
                <br />
                This is the new idea we're testing.
                <br />
                <span className="text-sm">
                  <em>
                    ☕ Coffee Hₐ: The new coffee does increase alertness.
                  </em>
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg">
              Step 3: Set the Rules (Confidence &amp; Significance)
            </h4>
            <p className="text-muted-foreground mt-1">
              Before we analyze, we define what counts as "strong enough"
              evidence. We choose a **95% confidence level**, which sets our
              **Significance Level (Alpha α) to 0.05**. Any result with less
              than a 5% probability of occurring by chance is considered
              "statistically significant."
            </p>
          </div>
           <div>
            <h4 className="font-semibold text-lg">
              Step 4: The Verdict (The P-Value)
            </h4>
            <p className="text-muted-foreground mt-1">
              The p-value is the probability of seeing our data if the null hypothesis is true.
            </p>
             <div className="mt-2 space-y-2 rounded-lg border p-4">
               <p>
                <strong>📈 Trading Algorithm Result: p-value = 0.25</strong>
                <br />
                There's a 25% chance of seeing these returns even if the new algorithm is no better. Since 0.25 is greater than our α of 0.05, the evidence is weak.
                <br/>
                <strong>Conclusion: Fail to reject the null hypothesis.</strong> We don't have enough evidence.
              </p>
            </div>
          </div>
           <div>
            <h4 className="font-semibold text-lg">
              Step 5: Know the Risks (When Your Conclusion is Wrong)
            </h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <h5 className="font-semibold text-destructive-foreground/90">Type I Error: The False Alarm 🚨</h5>
                  <p className="text-sm mt-1">You reject H₀ when it was true. You claimed the new algorithm worked, but it was a fluke. This can be a costly mistake.</p>
               </div>
                <div className="rounded-lg border-amber-500/50 bg-amber-500/10 p-4">
                  <h5 className="font-semibold text-amber-600 dark:text-amber-400">Type II Error: The Missed Opportunity 🤦‍♂️</h5>
                  <p className="text-sm mt-1">You fail to reject H₀ when it was false. The algorithm was truly better, but you missed it.</p>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          tier.title && tier.concepts ? (
            <Card key={tier.id} className="flex flex-col bg-card/70">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">
                  {tier.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2">
                  {tier.concepts.map((concept) => (
                    <li key={concept.id}>
                      <Link
                        href={concept.href}
                        className="group flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <CheckCircle className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        <span className="font-medium text-foreground/80 group-hover:text-foreground">
                          {concept.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null
        ))}
      </div>
    </>
  );
}
