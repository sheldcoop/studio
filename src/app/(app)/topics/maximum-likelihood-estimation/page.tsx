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
        title="An Interactive Guide to Maximum Likelihood Estimation (MLE)"
        description="Discover how MLE finds the 'best-fit' parameters for a model by maximizing the likelihood of observing your data."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              So, What IS Maximum Likelihood Estimation?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-base text-foreground/90">
            <p>
              Imagine you're a detective 🕵️‍♀️. You arrive at a crime scene and
              find some clues. Your job is to figure out which suspect's story
              best explains the clues you've found. That's *exactly* what MLE
              does, but with data. It answers the question:
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              "Given the data I've collected, what is the most likely story (or
              model) that produced it?"
            </blockquote>
            <p>
              Let's use the **Archer Analogy** 🎯. Imagine we find a target
              covered in arrow holes. We didn't see the archer shoot, but we
              want to figure out where they were aiming. The data we have is
              where the arrows landed. The parameter we want to find is the spot
              the archer was aiming for. Where would you guess they were aiming?
              Right in the middle of the cluster, right? Of course! Because if
              they *were* aiming there, it's the most believable explanation for
              the pattern we see. With MLE, we are just finding the parameter
              that **maximizes the likelihood** of seeing our data.
            </p>
            <h3 className="text-xl font-semibold text-primary">
              What Do We Use It For?
            </h3>
            <p>
              MLE is the engine behind a huge number of things in statistics
              and data science. It's how we **fit a model to our data**. It's the core principle that allows algorithms like Logistic Regression to "learn" from data and make predictions, and it's how we find the parameters (like mean and standard deviation) that best describe a dataset.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Math: How Is It Calculated?
            </CardTitle>
            <CardDescription>
              Let's walk through the calculation with a classic example: the
              mystery coin 🪙.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-4 text-base text-foreground/90">
            <p>
              We flip a coin 10 times and get this sequence (our data):{' '}
              <strong>H, T, H, H, H, T, H, H, T, H</strong> (7 Heads and 3
              Tails). Our goal is to find the most likely probability of heads
              (<i>p</i>) for this coin.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">
                Step 1: Define the Likelihood Function, L(p|data)
              </h4>
              <p>
                We write a formula for the probability of getting our *exact*
                sequence. Since flips are independent, we multiply their
                probabilities:
              </p>
              <div className="my-4 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                L(p|data) = p⁷ (1-p)³
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">
                Step 2: Take the Log-Likelihood, ln(L)
              </h4>
              <p>
                Multiplying many small numbers is messy. Taking the natural log
                turns multiplication into simpler addition. The value of <i>p</i>{' '}
                that maximizes the likelihood is the *same* value that maximizes
                the log-likelihood.
              </p>
              <div className="my-4 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                ln(L) = 7ln(p) + 3ln(1-p)
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Step 3: Maximize with Calculus</h4>
              <p>
                To find the maximum point of the function, we take the
                derivative with respect to <i>p</i> and set it to zero.
              </p>
              <div className="my-4 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                d/dp [ln(L)] = 7/p - 3/(1-p)
              </div>
              <p>Setting it to zero and solving for <i>p</i>:</p>
              <div className="my-4 space-y-2 rounded-md bg-muted/50 p-4 text-center font-mono text-lg">
                <div>7/p = 3/(1-p)</div>
                <div>7(1-p) = 3p</div>
                <div>7 = 10p</div>
                <div>p = 0.7</div>
              </div>
            </div>
            <p className="font-semibold">
              And there it is! Our Maximum Likelihood Estimate is 0.7, which
              matches our intuition perfectly.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}