import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Search, Lightbulb, Scale } from 'lucide-react';
import { BlockMath } from 'react-katex';

export default function DemystifyingHypothesisTestingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Demystifying Hypothesis Testing: A Beginner's Guide"
        description="A step-by-step guide to making decisions from data. Is it a real effect or just random chance? Let's find out."
        variant="aligned-left"
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Search className="text-primary" /> The Data Detective Analogy
          </CardTitle>
          <CardDescription>
            The easiest way to understand hypothesis testing is to think like a
            detective at a crime scene.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            You arrive at the scene with a default assumption: the person is
            innocent until proven guilty. This is your starting point, the{' '}
            <strong>Null Hypothesis (H₀)</strong>. It represents the "status
            quo" or "no effect" scenario. In finance, this could be "This trading
            strategy has no effect on returns" or "The average return of this
            stock is zero."
          </p>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-bold">
              Null Hypothesis (H₀): The default assumption; the status quo.
            </p>
            <p className="text-sm text-muted-foreground">
              Example: The suspect is innocent.
            </p>
          </div>
          <p>
            As a detective, you don't try to prove innocence. Instead, you look for{' '}
            <strong>evidence to reject innocence</strong>. You collect
            fingerprints, interview witnesses, and analyze data. This evidence
            forms your case against the null hypothesis, which we call the{' '}
            <strong>Alternative Hypothesis (H₁)</strong>.
          </p>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-bold">
              Alternative Hypothesis (H₁): The new theory you are trying to
              find evidence for.
            </p>
            <p className="text-sm text-muted-foreground">
              Example: The suspect is guilty.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Scale className="text-primary" /> Weighing the Evidence: The P-Value
          </CardTitle>
          <CardDescription>
            The p-value is the heart of hypothesis testing. It's the probability
            of seeing your collected evidence if the suspect were actually
            innocent (if the null hypothesis were true).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            Let's say you find the suspect's fingerprint on the murder weapon.
            The p-value answers the question: "How likely would it be to find this
            fingerprint here just by pure chance, assuming the suspect is totally
            innocent and was never at the scene?"
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>A large p-value</strong> (e.g., > 0.05) means the evidence is weak. It's reasonably likely you'd find this evidence even if the null hypothesis were true. (e.g., "The suspect is a handyman who works in the building, so finding his fingerprint isn't that surprising."). You cannot reject the null hypothesis. You fail to prove guilt.
            </li>
            <li>
              <strong>A small p-value</strong> (e.g., &lt; 0.05) means the evidence is strong. It's very unlikely you'd find this evidence if the null hypothesis were true. (e.g., "The suspect lives across the country and has no reason to be here. Finding his fingerprint is highly suspicious."). You have enough evidence to{' '}
              <strong>reject the null hypothesis</strong> in favor of the alternative.
            </li>
          </ul>
        </CardContent>
      </Card>
      
       <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important: You Never "Accept" the Null Hypothesis</AlertTitle>
          <AlertDescription>
            Just as in a courtroom, you either find a suspect "guilty" (reject the null) or "not guilty" (fail to reject the null). You never declare them "innocent." A lack of evidence to convict is not the same as proof of innocence. In statistics, we either have enough evidence to say an effect exists, or we don't.
          </AlertDescription>
        </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Lightbulb className="text-primary" /> A Practical Finance Example
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p><strong>Scenario:</strong> You've developed a new trading algorithm and you want to know if it's better than a simple buy-and-hold strategy.</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Null Hypothesis (H₀):</strong> The new algorithm's average return is the same as the buy-and-hold strategy. (There is no effect).</li>
                <li><strong>Alternative Hypothesis (H₁):</strong> The new algorithm's average return is different from (or greater than) the buy-and-hold strategy.</li>
            </ul>
            <p>You run a backtest for 100 days. You perform a statistical test (like a t-test) and get a p-value of <strong>0.03</strong>.</p>
            <p><strong>Interpretation:</strong> This p-value means there is only a 3% chance that you would see your algorithm's performance results if it were truly no better than buy-and-hold. Since 3% is less than the standard significance level of 5% (0.05), you have a statistically significant result!</p>
            <p><strong>Conclusion:</strong> You can <strong>reject the null hypothesis</strong>. You have strong evidence to suggest that your new algorithm's performance is not just a random fluke and it likely does have a real effect on returns.</p>
        </CardContent>
      </Card>
    </div>
  );
}
