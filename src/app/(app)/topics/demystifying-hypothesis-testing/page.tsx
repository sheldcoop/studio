
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function DemystifyingHypothesisTestingPage() {
  return (
    <>
      <PageHeader
        title="Demystifying Hypothesis Testing: A Beginner's Guide"
        description="Is it a real effect or just random chance? Let's find out."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">An Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Ever see a headline like "New Trading Strategy Boosts Profits!" or
              "This Coffee Makes You Smarter!" and wonder if it's true?
              Hypothesis testing is the statistical tool that helps us cut
              through the noise and determine if a claim has real evidence to
              back it up.
            </p>
            <p>
              We'll follow two stories from start to finish:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>☕ The Coffee Experiment:</strong> We want to know if a
                new coffee bean <em>actually</em> makes students more alert.
              </li>
              <li>
                <strong>📈 The Trading Algorithm:</strong> We need to decide if a
                new trading algorithm <em>truly</em> performs better than our
                current one.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Step 1: It All Starts with Data
            </CardTitle>
            <CardDescription>
              Before we can make any claims, we need evidence. This is our raw{' '}
              <strong>data</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <h4 className="font-semibold">Our Evidence Locker:</h4>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong>☕ The Coffee Experiment:</strong> We've collected
                alertness scores (from 1-100) from two groups: 50 students who
                drank the <strong>new coffee</strong> and 50 who drank the{' '}
                <strong>regular coffee</strong>.
              </li>
              <li>
                <strong>📈 The Trading Algorithm:</strong> We have the daily
                percentage returns from the <strong>new algorithm</strong> and
                the <strong>traditional strategy</strong> for the last 100
                trading days.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Step 2: Ask a Question (The Hypotheses)
            </CardTitle>
            <CardDescription>
              Now, we formalize our question into two competing statements. Think
              of this as a statistical courtroom drama.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold text-lg">
                On Trial: The Null Hypothesis (H₀)
              </h4>
              <p className="mt-1 text-muted-foreground">
                This is the "skeptic's view" or the "status quo." It assumes
                there's no real effect or difference.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  <strong>☕ Coffee (H₀):</strong> The new coffee has{' '}
                  <strong>no effect</strong> on alertness. Any difference in
                  scores is just random.
                </li>
                <li>
                  <strong>📈 Trading (H₀):</strong> The new algorithm{' '}
                  <strong>is not better</strong> than the old one. Any difference
                  in returns is just market noise.
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold text-lg">
                The Challenger: The Alternative Hypothesis (Hₐ)
              </h4>
              <p className="mt-1 text-muted-foreground">
                This is the new idea we're testing. It's the claim we *want* to
                see if we have evidence for.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  <strong>☕ Coffee (Hₐ):</strong> The new coffee{' '}
                  <strong>does increase</strong> student alertness.
                </li>
                <li>
                  <strong>📈 Trading (Hₐ):</strong> The new algorithm{' '}
                  <strong>does generate higher</strong> average returns.
                </li>
              </ul>
            </div>
            <div className="border-l-4 border-primary pl-4 text-muted-foreground">
              <p className="font-semibold text-foreground/90">The Goal:</p>
              <p>
                Our mission is to see if we have enough evidence in our data to
                reject the skeptic's view (H₀) and accept the new idea (Hₐ).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Step 3: Set the Rules (Confidence & Significance)
            </CardTitle>
            <CardDescription>
              Before we analyze the data, we must define what counts as
              "strong enough" evidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">The Confidence Level</h4>
              <p className="text-muted-foreground">
                We choose how confident we want to be in our conclusion. The
                standard is <strong>95% confidence</strong>. This means we accept
                there's a 5% risk that we might be wrong.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">The Significance Level (Alpha α)</h4>
              <p className="text-muted-foreground">
                This is the flip side of the confidence level. If we are 95%
                confident, our significance level is{' '}
                <strong>α = 5% or 0.05</strong>.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4 text-muted-foreground">
              <p className="font-semibold text-foreground/90">The Bottom Line:</p>
              <p>
                Any result with less than a 5% probability of occurring by
                random chance will be considered "statistically significant."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Step 4: The Verdict (The P-Value)
            </CardTitle>
            <CardDescription>
              The p-value is the probability of seeing your data, or something
              even more extreme, *assuming the null hypothesis (the skeptic's
              view) is true*.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-secondary/50 p-4">
              <h4 className="font-semibold text-lg">
                Case Result: ☕ The Coffee Experiment
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Finding:</strong> The "new coffee" group had an
                  average alertness score 10 points higher.
                </li>
                <li>
                  <strong>P-Value:</strong> 0.02
                </li>
                <li>
                  <strong>Verdict:</strong> There's only a{' '}
                  <strong>2% chance</strong> we'd see this result if the coffee
                  had no real effect. Since 0.02 is **less than** our 0.05
                  significance level, we have a winner!
                </li>
                <li>
                  <strong>Conclusion:</strong> We{' '}
                  <strong>reject the null hypothesis</strong>. The evidence
                  suggests the new coffee really does increase alertness.
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-secondary/50 p-4">
              <h4 className="font-semibold text-lg">
                Case Result: 📈 The Trading Algorithm
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Finding:</strong> The new algorithm's average daily
                  return was 0.05% higher.
                </li>
                <li>
                  <strong>P-Value:</strong> 0.25
                </li>
                <li>
                  <strong>Verdict:</strong> There is a{' '}
                  <strong>25% chance</strong> we'd see this result even if the new
                  algorithm was no better than the old one. Since 0.25 is{' '}
                  <strong>much greater than</strong> 0.05, the evidence is weak.
                </li>
                <li>
                  <strong>Conclusion:</strong> We{' '}
                  <strong>fail to reject the null hypothesis</strong>. We don't
                  have enough evidence to invest in the new algorithm.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <CardTitle className="font-headline">Step 5: Know the Risks (When Your Conclusion is Wrong)</CardTitle>
                 <CardDescription>Even with this process, we can still make an error. It's crucial to understand the two types.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <h5 className="font-semibold text-destructive-foreground/90 text-lg">Type I Error: The False Alarm 🚨</h5>
                  <p className="text-sm mt-2">This happens when you **reject the null hypothesis when it was actually true**. You claimed something special was happening, but it was just a fluke.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-muted-foreground">
                    <li><strong>Coffee:</strong> We buy a massive supply of the "miracle" coffee, but it has no real effect.</li>
                    <li><strong>Trading:</strong> We switch to the new "genius" algorithm and lose money because its past performance was just luck.</li>
                  </ul>
               </div>
                <div className="rounded-lg border-amber-500/50 bg-amber-500/10 p-4">
                  <h5 className="font-semibold text-amber-600 dark:text-amber-400 text-lg">Type II Error: The Missed Opportunity 🤦‍♂️</h5>
                  <p className="text-sm mt-2">This is the opposite: you **fail to reject the null hypothesis when it was actually false**. You missed a real discovery.</p>
                   <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-muted-foreground">
                    <li><strong>Coffee:</strong> We dismiss the new coffee, but it actually worked and we missed out.</li>
                    <li><strong>Trading:</strong> We don't adopt the new algorithm, but it was genuinely better and we missed out on profits.</li>
                  </ul>
               </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
