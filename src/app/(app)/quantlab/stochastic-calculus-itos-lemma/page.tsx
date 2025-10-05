
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';


// --- Main Page Component ---
export default function ItosLemmaComponent() {

  return (
    <>
      <PageHeader
        title="Stochastic Calculus & Itô's Lemma"
        description="The chain rule for random processes, and the foundation of modern derivatives pricing."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Calculus for Randomness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Standard calculus deals with smooth, predictable changes. But what about processes that have a random component, like the path of a stock price? Stochastic calculus, and specifically Itô's Lemma, provides the mathematical framework for handling this.
            </p>
            <p>
              Itô's Lemma is essentially the chain rule of stochastic calculus. It tells us how to find the differential of a function of a random process. The surprising result is an extra term that arises purely from the randomness, a term that is zero in normal calculus. This term is the key to almost all of modern quantitative finance.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Itô's Lemma</CardTitle>
                 <CardDescription>
                    If a variable <InlineMath math="x" /> follows an Itô process of the form <InlineMath math="dx = a(x,t)dt + b(x,t)dW_t" />, then for some function <InlineMath math="G(x,t)" />, its differential is:
                 </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="dG = \left( \frac{\partial G}{\partial t} + a \frac{\partial G}{\partial x} + \frac{1}{2} b^2 \frac{\partial^2 G}{\partial x^2} \right) dt + b \frac{\partial G}{\partial x} dW_t" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li>The first part (in parentheses) is the deterministic "drift" of G.</li>
                    <li>The second part is the random "diffusion" of G.</li>
                    <li>The term <InlineMath math="\frac{1}{2} b^2 \frac{\partial^2 G}{\partial x^2}" /> is the **Itô term**. It's non-zero because in a random walk, the variance grows with time (<InlineMath math="(dW_t)^2 = dt" />), unlike in deterministic calculus where squared differentials vanish.</li>
                </ul>
                 <p className="mt-4">This lemma is used to derive the Black-Scholes equation, the foundational equation for pricing options.</p>
            </CardContent>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Simulation vs. Reality</CardTitle>
            </CardHeader>
            <CardContent className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center">
                <p className="text-muted-foreground">An interactive simulation for Itô's Lemma is currently under development. Stay tuned!</p>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
