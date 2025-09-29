
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
import { Siren, ArrowRight, Lightbulb } from 'lucide-react';


export default function CorrelationVsCausationPage() {
  return (
    <>
      <PageHeader
        title="Correlation vs. Causation"
        description="The most important rule in data analysis: just because two things move together, doesn't mean one causes the other."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Quant's Golden Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Correlation tells you that two variables tend to move in the same, opposite, or random directions. Causation means that a change in one variable <span className="font-bold text-primary">directly causes</span> a change in another. It's a simple distinction, but confusing them is one of the most common and dangerous mistakes in quantitative analysis and data science.
            </p>
            <p>
              A model built on a spurious (false) correlation may work for a while, but it will fail unpredictably because it hasn't captured a true underlying relationship.
            </p>
          </CardContent>
        </Card>
        
        <Alert variant="destructive" className="bg-destructive/5">
            <Siren className="h-4 w-4" />
            <AlertTitle className="font-headline text-lg">A Classic (and Silly) Example</AlertTitle>
            <AlertDescription className="mt-2 text-base">
                <p className="mb-2">For years, a strong positive correlation was observed between ice cream sales and the number of shark attacks. As ice cream sales went up, so did shark attacks.</p>
                <p className="mb-4 font-semibold text-destructive-foreground/90">Does eating ice cream cause shark attacks?</p>
                <p>Of course not. The real cause is a third, hidden variable: <strong className="text-foreground">warm weather</strong>. When it's hot, more people go to the beach (increasing potential shark encounters) AND more people buy ice cream. The two are correlated, but one does not cause the other.</p>
                <div className="mt-4 rounded-md border border-destructive/20 bg-background/30 p-4 text-center">
                  <p className="font-medium">Warm Weather (Lurking Variable)</p>
                  <div className="flex items-center justify-center gap-4 text-2xl font-bold text-destructive-foreground/80">
                    <span>→</span>
                    <div className="flex-1 rounded-md bg-background/50 p-2">Ice Cream Sales ↑</div>
                    <span>and</span>
                     <div className="flex-1 rounded-md bg-background/50 p-2">Shark Attacks ↑</div>
                     <span>→</span>
                  </div>
                   <p className="mt-2 text-sm text-muted-foreground">Both ice cream sales and beach visits are driven by summer heat.</p>
                </div>
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Why This Matters in Finance</CardTitle>
                <CardDescription>Mistaking correlation for causation in finance can be an expensive lesson.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> The Hidden Variable (Lurking Variable)</h4>
                    <p className="text-muted-foreground mt-1 pl-6">Just like "warm weather" in our example, a hidden economic factor often drives two seemingly related assets. For example, the prices of luxury cars and high-end watches might be correlated. The lurking variable is <strong className="text-foreground/90">global wealth concentration</strong>. One doesn't cause the other; they are both driven by the same underlying factor.</p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> Coincidence (Spurious Correlation)</h4>
                    <p className="text-muted-foreground mt-1 pl-6">With millions of financial time series in the world, some will correlate purely by random chance. A famous example found a strong correlation between the butter production in Bangladesh and the performance of the S&P 500. This is meaningless. Building a trading strategy on this would be financial suicide.</p>
                </div>
                <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> Reverse Causality</h4>
                    <p className="text-muted-foreground mt-1 pl-6">Sometimes you have the relationship backward. For instance, you might observe that companies that spend more on advertising have higher sales. Does advertising cause higher sales, or do companies with high sales have more money to spend on advertising? The causal link might be the reverse of what you assume.</p>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
                <CardTitle className="font-headline flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-primary" />How to Move from Correlation to Causation</CardTitle>
                <CardDescription>This is one of the hardest problems in statistics, but here are the key approaches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="text-base">
                    <h4 className="font-semibold">1. Controlled Experiments (A/B Testing)</h4>
                    <p className="text-muted-foreground text-sm">The gold standard. By randomly assigning subjects to a control group and a treatment group, you can isolate the effect of a single variable. In finance, this is rare but possible (e.g., testing two different portfolio rebalancing strategies on two identical, isolated pools of capital).</p>
                </div>
                 <div className="text-base">
                    <h4 className="font-semibold">2. Economic Rationale &amp; Domain Knowledge</h4>
                    <p className="text-muted-foreground text-sm">Before you even run a regression, ask: "Is there a plausible economic reason why X would cause Y?" A correlation between oil prices and airline stock prices makes economic sense (fuel is a major cost). A correlation between butter production and the stock market does not. Your domain expertise is your first and best filter.</p>
                </div>
                 <div className="text-base">
                    <h4 className="font-semibold">3. Advanced Econometric Techniques</h4>
                    <p className="text-muted-foreground text-sm">Techniques like Granger Causality, Instrumental Variables, and Difference-in-Differences are designed specifically to probe for causal relationships in observational data where controlled experiments aren't possible. These are advanced tools for the professional quant's toolkit.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
