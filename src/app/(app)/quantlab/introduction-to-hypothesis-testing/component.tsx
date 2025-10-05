'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TestTube2, Scale, BarChart, Forward, BrainCircuit, Sigma } from 'lucide-react';
import { BlockMath } from 'react-katex';
import Link from 'next/link';
import 'katex/dist/katex.min.css';

export default function DemystifyingHypothesisTestingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="An Introduction to Hypothesis Testing"
        description="A practical guide to deciding if your results are a real breakthrough or just random noise."
        variant="aligned-left"
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
           Introduction: The Two Stories
          </CardTitle>
          <CardDescription>
            Ever see a headline like "New Trading Strategy Boosts Profits!" and wonder if it's true? Hypothesis testing is the tool that helps us find out. We'll follow two stories from start to finish.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-semibold text-primary flex items-center gap-2"><TestTube2 /> The Coffee Experiment</h4>
                    <p className="text-sm text-muted-foreground mt-1">We want to know if a new coffee bean actually makes students more alert.</p>
                 </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-semibold text-primary flex items-center gap-2"><BarChart /> The Trading Algorithm</h4>
                    <p className="text-sm text-muted-foreground mt-1">We need to decide if a new trading algorithm truly performs better than our current one.</p>
                 </div>
             </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sigma /> Step 1: Ask a Question (The Hypotheses)
          </CardTitle>
          <CardDescription>
           We formalize our question into two competing statements. Think of this as a statistical courtroom drama.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold text-lg">On Trial: The Null Hypothesis (H₀)</h4>
            <p className="text-sm text-muted-foreground">This is the "skeptic's view" or the "status quo." It assumes there's no real effect or difference.</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                <li><strong className="text-primary">☕ Coffee (H₀):</strong> The new coffee has no effect on alertness. Any difference in scores is just random.</li>
                <li><strong className="text-primary">📈 Trading (H₀):</strong> The new algorithm is not better than the old one. Any difference in returns is just market noise.</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold text-lg">The Challenger: The Alternative Hypothesis (Hₐ)</h4>
            <p className="text-sm text-muted-foreground">This is the new idea we're testing. It's the claim we want to see if we have evidence for.</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                <li><strong className="text-primary">☕ Coffee (Hₐ):</strong> The new coffee <span className="underline">does</span> increase student alertness.</li>
                <li><strong className="text-primary">📈 Trading (Hₐ):</strong> The new algorithm <span className="underline">does</span> generate higher average returns.</li>
            </ul>
          </div>
           <Alert>
              <BrainCircuit className="h-4 w-4" />
              <AlertTitle>Our Goal</AlertTitle>
              <AlertDescription>
                Our mission is to see if we have enough evidence in our data to **reject the skeptic's view (H₀)** and accept the new idea (Hₐ). From here, you can dive into a range of specific tests in our <Link href="/quantlab/hypothesis-testing-guide" className="font-semibold text-primary hover:underline">Quant's Detective Kit</Link>.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Scale className="text-primary" /> Step 2: Set the Rules (Confidence & Significance)
          </CardTitle>
          <CardDescription>
            Before we analyze the data, we must define what counts as "strong enough" evidence. This is deeply related to <Link href="/quantlab/confidence-intervals-interactive-guide" className="font-semibold text-primary hover:underline">Confidence Intervals</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>We choose how confident we want to be in our conclusion. The standard is 95% confidence. This means we accept there's a 5% risk that we might be wrong. This risk is the <strong>Significance Level (Alpha α)</strong>.</p>
             <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <BlockMath math="\alpha = 1 - \text{Confidence Level}" />
                <p className="text-sm text-muted-foreground">For 95% confidence, α = 1 - 0.95 = 0.05</p>
            </div>
            <p><strong>The Bottom Line:</strong> Any result with less than a 5% probability of occurring by random chance will be considered "statistically significant."</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Forward className="text-primary" /> Step 3: The Verdict (The P-Value)
          </CardTitle>
          <CardDescription>
            The p-value is the probability of seeing your data, or something even more extreme, *assuming the null hypothesis (the skeptic's view) is true*.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-primary">Case Result: ☕ The Coffee Experiment</h4>
                    <p className="text-sm mt-2"><strong className="text-foreground">Finding:</strong> The "new coffee" group had an average alertness score 10 points higher.</p>
                    <p className="text-sm"><strong className="text-foreground">P-Value:</strong> 0.02</p>
                    <p className="text-sm mt-2"><strong className="text-foreground">Verdict:</strong> There's only a 2% chance we'd see this result if the coffee had no real effect. Since 0.02 is **less than** our 0.05 significance level, we have a winner!</p>
                    <p className="font-bold text-sm mt-2">Conclusion: We reject H₀. The evidence suggests the new coffee really does increase alertness.</p>
                </div>
                 <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-primary">Case Result: 📈 The Trading Algorithm</h4>
                    <p className="text-sm mt-2"><strong className="text-foreground">Finding:</strong> The new algorithm's average daily return was 0.05% higher.</p>
                    <p className="text-sm"><strong className="text-foreground">P-Value:</strong> 0.25</p>
                    <p className="text-sm mt-2"><strong className="text-foreground">Verdict:</strong> There is a 25% chance we'd see this result even if the new algorithm was no better than the old one. Since 0.25 is much greater than 0.05, the evidence is weak.</p>
                    <p className="font-bold text-sm mt-2">Conclusion: We fail to reject H₀. We don't have enough evidence to invest in the new algorithm.</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                Step 4: Know the Risks (When Your Conclusion is Wrong)
            </CardTitle>
            <CardDescription>
                Even with this process, we can still make an error. It's crucial to understand the two types. For an interactive visualization, see our guide on <Link href="/quantlab/type-i-and-type-ii-errors" className="font-semibold text-primary hover:underline">Type I & Type II Errors</Link>.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Type I Error: The False Alarm 🚨</AlertTitle>
                <AlertDescription>
                    <p>This happens when you **reject the null hypothesis when it was actually true**. You claimed something special was happening, but it was just a fluke.</p>
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Coffee:</strong> We buy a massive supply of the "miracle" coffee, but it has no real effect.</li>
                        <li><strong>Trading:</strong> We switch to the new "genius" algorithm and lose money because its past performance was just luck.</li>
                    </ul>
                </AlertDescription>
            </Alert>
            <Alert className="border-yellow-500/50 bg-yellow-500/5 text-yellow-700 dark:text-yellow-300 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Type II Error: The Missed Opportunity 🤦‍♂️</AlertTitle>
                <AlertDescription>
                   <p>This is the opposite: you **fail to reject the null hypothesis when it was actually false**. You missed a real discovery.</p>
                   <ul className="list-disc pl-5 mt-2">
                        <li><strong>Coffee:</strong> We dismiss the new coffee, but it actually worked and we missed out.</li>
                        <li><strong>Trading:</strong> We don't adopt the new algorithm, but it was genuinely better and we missed out on profits.</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>

    </div>
  );
}