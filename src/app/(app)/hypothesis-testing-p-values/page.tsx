'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { allTopics } from '@/lib/curriculum';
import Link from 'next/link';

export default function HypothesisTestingPage() {
  const parametricTests = allTopics.filter(t => t.category === 'parametric');
  const nonParametricTests = allTopics.filter(
    t => t.category === 'non-parametric'
  );

  return (
    <>
      <PageHeader
        title="Hypothesis Testing & P-Values"
        description="The detective work of data science: making decisions under uncertainty."
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Core Idea: What is Hypothesis Testing?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Think of hypothesis testing as being a data detective. You start
              with a default assumption, the{' '}
              <strong>Null Hypothesis (H₀)</strong>, which states there is no
              effect or no difference (e.g., "a new drug has no effect"). Then,
              you gather evidence (your sample data) to see if you have enough
              proof to reject that default assumption in favor of an
              alternative, the <strong>Alternative Hypothesis (H₁)</strong>{' '}
              (e.g., "the new drug has an effect").
            </p>
            <p>
              The <strong>p-value</strong> is the crucial piece of evidence. It's
              the probability of observing your data (or something even more
              extreme) if the null hypothesis were actually true. A small
              p-value (typically &lt; 0.05) suggests that your observed data is
              very unlikely under the null hypothesis, giving you a reason to
              reject it.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
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

        <section>
          <div className="mb-8 text-center">
            <h2 className="font-headline text-3xl font-bold">
              The Two Paths: Parametric vs. Non-Parametric
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              The type of data you have determines the statistical test you can
              use. The main fork in the road is between parametric and
              non-parametric tests.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                  👨‍🍳 Parametric Tests
                </CardTitle>
                <CardDescription>
                  The Professional Chef: Assumes ingredients (data) meet
                  certain standards (e.g., normal distribution). Precise and
                  powerful when assumptions are met.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {parametricTests.map((test) => (
                    <li key={test.id}>
                      <Link
                        href={test.href}
                        className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                      >
                        <h4 className="font-semibold">{test.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {test.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                  🏕️ Non-Parametric Tests
                </CardTitle>
                <CardDescription>
                  The Campfire Cook: Makes no strict assumptions about
                  ingredients. More flexible and robust, especially with
                  unusual, ranked, or non-normal data.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {nonParametricTests.map((test) => (
                    <li key={test.id}>
                      <Link
                        href={test.href}
                        className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                      >
                        <h4 className="font-semibold">{test.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {test.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
