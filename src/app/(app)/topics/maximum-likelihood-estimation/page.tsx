'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

// Define the type for the MathJax object on the window
declare global {
  interface Window {
    MathJax: {
      typeset: () => void;
    };
  }
}

export default function MLEPage() {
  // This useEffect hook is crucial for ensuring MathJax re-renders the equations
  // when the component mounts on the client side. In a Next.js App Router environment,
  // client-side navigation doesn't trigger a full page reload, so we need to
  // manually tell MathJax to process the page.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax) {
      window.MathJax.typeset();
    }
  }, []);

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
              Imagine you're a detective who's found a series of footprints. You have several suspects, each with a different shoe size. Your goal is to figure out which suspect is the most likely culprit. You'd compare their shoe size to the prints you found. If the prints are a size 9, the suspect with size 9 shoes is your most likely candidate.
            </p>
             <p>
              MLE does the exact same thing, but with data and statistical models. It answers the question:
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              "Given the data we've observed, what are the model parameters that make this data the most probable?"
            </blockquote>
            <p>
              Let's use a finance example. Say we're analyzing a stock's daily returns for the past year. We might assume the returns follow a Normal (Gaussian) distribution, but we don't know the mean ($\mu$) or the standard deviation ($\sigma$). MLE is the tool that looks at all the return data and finds the specific values of $\mu$ and $\sigma$ that best explain the price movements we've seen.
            </p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle className="font-headline">
              Why is MLE a Quant's Best Friend?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-base text-foreground/90">
             <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Modeling Binary Events:</strong> We can use it to estimate the probability ($p$) of an event, like a stock finishing the day up or down, or a borrower defaulting on a loan.
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

        <div className="text-center">
            <h2 className="font-headline text-2xl font-bold">Let's Get Our Hands Dirty: The Math Behind MLE</h2>
            <p className="mt-1 text-muted-foreground">The best way to understand MLE is to walk through an example. We'll use a simple one—the coin flip—because it makes the math clear.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>The Scenario: A Simple Trading Signal</CardTitle>
            <CardDescription>
                Imagine we're testing a trading signal that is either profitable (Heads) or not (Tails) each day. Over 10 days, we observe: {' '}
              <strong>H, T, H, H, H, T, H, H, T, H</strong> (7 Heads and 3 Tails). Our goal is to find the most likely probability of success ($p$) for this signal.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Step 1: Write Down the Likelihood Function</CardTitle>
                <CardDescription>
                First, we write a formula for the probability (likelihood) of getting our exact sequence. Since each day is independent, we just multiply their probabilities together. The probability of a Head is $p$ and a Tail is $(1-p)$.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-lg">
                $$L(p|\\text{data}) = p^7(1-p)^3$$
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Step 2: Take the Log-Likelihood (A Nifty Trick)</CardTitle>
                <CardDescription>
                To make the calculus easier, we take the natural log. The value of $p$ that maximizes the likelihood also maximizes the log-likelihood.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-lg">
                 $$\ln(L) = 7\ln(p) + 3\ln(1-p)$$
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Step 3: Maximize with Calculus</CardTitle>
                <CardDescription>
                To find the peak of the function, we take the derivative with respect to $p$ and set it to zero.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center text-lg">
                <div>$$ \frac{d}{dp}[\ln(L)] = \frac{7}{p} - \frac{3}{1-p} $$</div>
                <p className="text-sm text-muted-foreground">Now, set to zero and solve for $p$:</p>
                <div>$$ \frac{7}{p} = \frac{3}{1-p} $$</div>
                <div>$$ 7(1-p) = 3p $$</div>
                <div>$$ 7 - 7p = 3p $$</div>
                <div>$$ 7 = 10p $$</div>
            </CardContent>
        </Card>
        
        <Card className="border-primary bg-primary/10">
             <CardHeader>
                <CardTitle>The Result</CardTitle>
                <CardDescription>
                The Maximum Likelihood Estimate for the probability of a profitable day is:
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-3xl font-bold">
                 $$p = 0.7$$
            </CardContent>
        </Card>
        
      </div>
    </>
  );
}
