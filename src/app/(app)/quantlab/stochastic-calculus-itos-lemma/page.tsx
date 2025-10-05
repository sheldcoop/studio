
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function ItosLemmaPage() {
  return (
    <>
      <PageHeader
        title="Stochastic Calculus & Itô's Lemma"
        description="The calculus of random walks, essential for derivatives pricing."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Why Normal Calculus Fails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Classical calculus (the kind taught in high school and early college) deals with smooth, predictable functions. However, financial markets are anything but smooth. Stock prices, for example, are modeled as stochastic processes, which have a random component and are non-differentiable everywhere.
            </p>
            <p>
              Stochastic calculus, and particularly Itô's Lemma, provides the mathematical toolkit to handle differentiation and integration for these random processes. It's the language used to describe the evolution of asset prices and is the absolute foundation of modern derivatives pricing.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Itô's Lemma: The Chain Rule for Randomness</CardTitle>
                 <CardDescription>Itô's Lemma is essentially the chain rule of stochastic calculus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    If a random variable <InlineMath math="x" /> follows an Itô process: <InlineMath math="dx = a(x,t)dt + b(x,t)dW_t" />, then for a function <InlineMath math="G(x,t)" /> which is twice-differentiable in <InlineMath math="x" /> and once in <InlineMath math="t" />, its differential <InlineMath math="dG" /> is given by:
                </p>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="dG = \left( \frac{\partial G}{\partial x}a + \frac{\partial G}{\partial t} + \frac{1}{2}\frac{\partial^2 G}{\partial x^2}b^2 \right)dt + \frac{\partial G}{\partial x}b dW_t" />
                </div>
                 <p className="font-semibold text-primary">
                    The key insight is the new term: <InlineMath math="\frac{1}{2}\frac{\partial^2 G}{\partial x^2}b^2" />. This term arises because in stochastic calculus, <InlineMath math="(dW_t)^2 = dt" />, whereas in normal calculus, second-order terms like <InlineMath math="(dt)^2" /> go to zero. This extra term accounts for the convexity (or curvature) of the function and the inherent volatility of the process.
                 </p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Application: Deriving Black-Scholes</CardTitle>
             <CardDescription>
                The most famous application of Itô's Lemma is in the derivation of the Black-Scholes-Merton partial differential equation for option pricing.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Assume a stock price <InlineMath math="S" /> follows Geometric Brownian Motion: <InlineMath math="dS = \mu S dt + \sigma S dW" />.</li>
                <li>Consider an option whose price is a function of the stock price and time, <InlineMath math="f(S, t)" />.</li>
                <li>Apply Itô's Lemma to find the differential <InlineMath math="df" />.</li>
                <li>Construct a risk-free portfolio by shorting one option and holding a certain number (<InlineMath math="\Delta" />) of shares of the underlying stock.</li>
                <li>The change in this portfolio's value must, by a no-arbitrage argument, equal the return from a risk-free investment.</li>
                <li>Setting these equal and simplifying eliminates the random <InlineMath math="dW" /> term, resulting in the famous Black-Scholes PDE.</li>
             </ol>
             <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 mt-6">
                <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
