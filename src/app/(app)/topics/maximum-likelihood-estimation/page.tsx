'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function MLEPage() {
  return (
    <>
      <PageHeader
        title="Unlocking Model Insights: A Quant's Guide to Maximum Likelihood Estimation"
        description="Discover how MLE finds the 'best-fit' parameters for a model by maximizing the likelihood of observing your data."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              What is Maximum Likelihood Estimation, Really?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-base text-foreground/90">
            <p>
              Ever wondered how we find the best parameters for a financial
              model? Whether you're modeling asset returns, default
              probabilities, or market volatility, you need a way to fit your
              model to the data you have. One of the most powerful and
              fundamental tools in our quantitative toolkit for this job is
              Maximum Likelihood Estimation (MLE).
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              "Given the data we've observed, what are the model parameters
              that make this data the most probable?"
            </blockquote>
            <p>
              Let's use a finance example. Say we're analyzing a stock's daily
              returns for the past year. We might assume the returns follow a
              Normal (Gaussian) distribution, but we don't know the mean (μ) or
              the standard deviation (σ). MLE is the tool that looks at all the
              return data and finds the specific values of μ and σ that best
              explain the price movements we've seen.
            </p>
            <h3 className="text-xl font-semibold text-primary">
              Why is MLE a Quant's Best Friend?
            </h3>
            <p>
              MLE is the engine behind many of the models we use daily. It's how we **fit a model to our data**.
            </p>
             <ul className="list-disc pl-5">
                <li>
                  <strong>Modeling Binary Events:</strong> We can use it to estimate the probability (p) of an event, like a stock finishing the day up or down, or a borrower defaulting on a loan.
                </li>
                <li>
                  <strong>Fitting Distributions to Asset Returns:</strong> This is a classic. MLE is how we determine the mean and volatility parameters for distributions (like the Normal or Student's t-distribution) to model how asset prices change.
                </li>
                <li>
                  <strong>Powering Complex Models:</strong> Its principles are at the heart of more advanced quantitative models, from GARCH models that capture volatility clustering to logistic regression used in credit risk and algorithmic trading signals.
                </li>
              </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Let's Get Our Hands Dirty: The Math Behind MLE
            </CardTitle>
            <CardDescription>
              We'll use a simple one—the coin flip—because it makes the math clear. Imagine we're testing a trading signal that is either profitable (Heads) or not (Tails) each day. Over 10 days, we observe: {' '}
              <strong>H, T, H, H, H, T, H, H, T, H</strong> (7 Heads and 3
              Tails).
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-4 text-base text-foreground/90">
            
            <div className="space-y-2">
              <h4 className="font-semibold">Step 1: Define the Likelihood Function, L(p|data)</h4>
              <p>
                Next, we write a formula for the probability (or likelihood) of getting our exact observed sequence, given some value of p. Since each day is independent, we just multiply their probabilities together.
              </p>
              <div className="my-4 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                L(p|data) = p⁷ (1-p)³
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Step 2: Take the Log-Likelihood, ln(L)</h4>
              <p>
                Multiplying many small numbers together can be messy. To make our lives easier, we take the natural logarithm of the likelihood. Because the logarithm is a monotonically increasing function, the value of p that maximizes the original likelihood is the exact same value that maximizes the log-likelihood.
              </p>
              <div className="my-4 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                ln(L) = 7ln(p) + 3ln(1-p)
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Step 3: Maximize with Calculus</h4>
              <p>
                How do you find the peak of any function? You find the point where its slope is zero by taking the derivative and setting it to zero. Let's take the derivative with respect to p:
              </p>
              <div className="my-4 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                d/dp [ln(L)] = 7/p - 3/(1-p)
              </div>
              <p>Now, set it to zero to find the maximum and solve for p:</p>
              <div className="my-4 space-y-2 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                <div>7/p = 3/(1-p)</div>
                <div>7(1-p) = 3p</div>
                <div>7 - 7p = 3p</div>
                <div>7 = 10p</div>
                <div className="font-bold">p = 0.7</div>
              </div>
            </div>
            
            <p className="font-semibold">
              And there you have it! The Maximum Likelihood Estimate for the probability of success is 0.7. This makes perfect sense—the most likely parameter is the one that matches the frequency we actually saw in our data.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
