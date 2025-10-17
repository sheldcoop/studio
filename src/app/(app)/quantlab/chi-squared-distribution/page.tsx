
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ChiSquaredDashboard } from '@/components/quantlab/dashboards/ChiSquaredDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { ExampleStep } from '@/components/app/example-step';

// --- Main Page Component ---
export default function ChiSquaredDistributionPage() {
  return (
    <>
      <PageHeader
        title="Chi-Squared (χ²) Distribution"
        description="The distribution of the sum of squared standard normal deviates."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Goodness of Fit" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Chi-Squared (χ²) distribution is a continuous probability distribution that is widely used in hypothesis testing. It arises as the distribution of a sum of squared independent standard normal random variables. 
            </p>
            <p>
              In finance and econometrics, it is the backbone of the Chi-Squared test, which is used to test the goodness of fit of a model, check for independence between categorical variables, and compare variances. For instance, a risk manager might use it to test if the observed frequency of portfolio losses matches the frequency predicted by their risk model.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive χ² Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the shape of the distribution changes. Notice how it becomes more symmetric and bell-shaped as the degrees of freedom increase.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChiSquaredDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts & Derivations">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by one parameter: the degrees of freedom (<InlineMath math="k" />).</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; k) = \frac{1}{2^{k/2}\Gamma(k/2)} x^{k/2-1} e^{-x/2}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="x \ge 0" /> is the variable.</li>
                      <li><InlineMath math="k" /> represents the degrees of freedom.</li>
                      <li><InlineMath math="\Gamma(k/2)" /> is the Gamma function.</li>
                  </ul>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Key Derivations</CardTitle>
                  <CardDescription>The moments of the Chi-Squared distribution are most easily derived by recognizing it as a special case of the Gamma distribution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                    A Chi-Squared distribution with <InlineMath math="k" /> degrees of freedom, <InlineMath math="\chi^2(k)" />, is equivalent to a Gamma distribution with shape parameter <InlineMath math="\alpha = k/2" /> and rate parameter <InlineMath math="\beta = 1/2" />.
                </p>
                <p>
                    We know that for a Gamma distribution <InlineMath math="\text{Gamma}(\alpha, \beta)" />, the moments are:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><InlineMath math="E[X] = \frac{\alpha}{\beta}" /></li>
                    <li><InlineMath math="Var(X) = \frac{\alpha}{\beta^2}" /></li>
                </ul>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                   <ExampleStep stepNumber={1} title="Substitute Gamma Parameters">
                      <p>Substitute <InlineMath math="\alpha = k/2" /> and <InlineMath math="\beta = 1/2" /> into the mean formula for the Gamma distribution.</p>
                      <BlockMath math="E[X] = \frac{k/2}{1/2}" />
                   </ExampleStep>
                   <ExampleStep stepNumber={2} title="Simplify">
                      <p>The 1/2 terms cancel out, leaving us with a remarkably simple result.</p>
                      <FormulaBlock>
                          <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                          <BlockMath math="E[X] = k" />
                      </FormulaBlock>
                   </ExampleStep>
                </div>
                 <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                   <ExampleStep stepNumber={1} title="Substitute Gamma Parameters">
                      <p>Substitute <InlineMath math="\alpha = k/2" /> and <InlineMath math="\beta = 1/2" /> into the variance formula for the Gamma distribution.</p>
                      <BlockMath math="Var(X) = \frac{k/2}{(1/2)^2} = \frac{k/2}{1/4}" />
                   </ExampleStep>
                   <ExampleStep stepNumber={2} title="Simplify">
                       <p>Multiplying by the reciprocal of 1/4 gives the final result.</p>
                      <FormulaBlock>
                           <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                          <BlockMath math="Var(X) = 2k" />
                      </FormulaBlock>
                   </ExampleStep>
                </div>
              </CardContent>
          </Card>
        </PageSection>

      </div>
    </>
  );
}
