
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type HighlightState = 'A' | 'B' | 'AnB' | 'A_given_B' | 'B_given_A' | 'none';

const VennDiagram = ({
  highlight,
  labelA = 'A',
  labelB = 'B',
}: {
  highlight: HighlightState;
  labelA?: string;
  labelB?: string;
}) => {
  const getCircleOpacity = (circle: 'A' | 'B') => {
    if (highlight === 'A_given_B' && circle === 'A') return 0.2;
    if (highlight === 'B_given_A' && circle === 'B') return 0.2;
    return 1;
  };

  const getUniverseOpacity = () => {
    if (highlight === 'A_given_B' || highlight === 'B_given_A') return 0.1;
    return 1;
  };
  
  const isIntersectionHighlighted = highlight === 'AnB' || highlight === 'A_given_B' || highlight === 'B_given_A';

  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto transition-all duration-500">
      {/* Universe */}
      <rect
        width="400"
        height="200"
        fill="hsl(var(--muted))"
        opacity={getUniverseOpacity()}
        className="transition-opacity duration-500"
      />

      {/* Clip path for intersection */}
      <defs>
        <clipPath id="clip-b">
          <circle cx="250" cy="100" r="80" />
        </clipPath>
      </defs>

      {/* Circle A */}
      <circle
        cx="150"
        cy="100"
        r="80"
        fill="hsl(var(--chart-1))"
        opacity={getCircleOpacity('A')}
        className="transition-all duration-500"
      />
      <text x="100" y="100" className="font-bold fill-primary-foreground" fontSize="24">{labelA}</text>
      
      {/* Circle B */}
      <circle
        cx="250"
        cy="100"
        r="80"
        fill="hsl(var(--chart-2))"
        opacity={getCircleOpacity('B')}
        className="transition-all duration-500"
      />
       <text x="300" y="100" className="font-bold fill-primary-foreground" fontSize="24">{labelB}</text>

      {/* Intersection Highlight */}
      <circle
          cx="150"
          cy="100"
          r="80"
          fill="hsl(var(--primary))"
          clipPath="url(#clip-b)"
          className="transition-opacity duration-300"
          opacity={isIntersectionHighlighted ? 1 : 0}
        />
       <text x="195" y="105" className="font-bold fill-primary-foreground transition-opacity duration-300" opacity={isIntersectionHighlighted ? 1 : 0} fontSize="16">A ∩ B</text>
    </svg>
  );
};


export default function BayesTheoremPage() {
  const [highlight, setHighlight] = useState<HighlightState>('none');

  return (
    <>
      <PageHeader
        title="Bayes' Theorem: A Visual Derivation"
        description="Understanding where the famous formula comes from, one step at a time."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Goal: Updating Our Beliefs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Bayes' Theorem is a formal way to do something we all do intuitively: **update our beliefs in light of new evidence**. The formula itself can look intimidating, but it's built from a few simple, visual ideas. Our goal here is not just to see the formula, but to understand why it *must* be true.
            </p>
            <p>
                Let's use a common financial scenario:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-primary">Event A:</strong> A stock's price goes up.</li>
                <li><strong className="text-primary">Event B:</strong> A positive news article about the company is released.</li>
            </ul>
             <p>The question we want to answer is: "If we see a positive news article, what is the new probability that the stock's price will go up?" This is written as **P(A|B)**.</p>
          </CardContent>
        </Card>
        
        <div onMouseLeave={() => setHighlight('none')}>
            <VennDiagram highlight={highlight} labelA="Stock Up" labelB="Positive News" />
        </div>

        {/* Step 1 */}
        <Card onMouseEnter={() => setHighlight('AnB')}>
            <CardHeader>
                <Badge variant="outline" className="w-fit">Step 1 of 4</Badge>
                <CardTitle className="mt-2">Joint Probability: The Overlap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground">The probability of two events happening at the same time is their **joint probability**. Visually, it's the area where their circles overlap. Hover over the formula to see it highlighted.</p>
                 <div className="text-center font-mono text-lg p-2 bg-background rounded-md border" onMouseEnter={() => setHighlight('AnB')}>
                    P(A ∩ B) = Probability(Stock Goes Up AND Positive News is Released)
                </div>
            </CardContent>
        </Card>

        {/* Step 2 */}
        <Card onMouseEnter={() => setHighlight('A_given_B')}>
            <CardHeader>
                <Badge variant="outline" className="w-fit">Step 2 of 4</Badge>
                <CardTitle className="mt-2">Conditional Probability: The World Shrinks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">Now, let's ask: "What is the probability the stock goes up, **given that we know** there was positive news?" This is the conditional probability **P(A|B)**. When we are 'given' that Event B happened, our entire universe of possibilities shrinks to just the 'Positive News' circle. Hover to see this effect.</p>
                <p className="text-muted-foreground">Within this new, smaller world (Circle B), the only way for Event A to also happen is in the intersection area. Therefore, the conditional probability is the size of the intersection relative to the size of our new world.</p>
                 <div className="text-center font-mono text-lg p-2 bg-background rounded-md border" onMouseEnter={() => setHighlight('A_given_B')}>
                    P(A|B) = P(A ∩ B) / P(B)
                </div>
            </CardContent>
        </Card>

        {/* Step 3 */}
        <Card onMouseEnter={() => setHighlight('B_given_A')}>
            <CardHeader>
                 <Badge variant="outline" className="w-fit">Step 3 of 4</Badge>
                <CardTitle className="mt-2">Symmetry: The Other Side of the Coin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">The logic is perfectly symmetrical. We can also ask: "What is the probability there was positive news, **given that we know** the stock went up?" This is **P(B|A)**. Now, our universe shrinks to the 'Stock Up' circle. Hover to see it.</p>
                <p className="text-muted-foreground">The formula is the same, just with the roles of A and B swapped. The probability is the intersection relative to the new, smaller world (Circle A).</p>
                 <div className="text-center font-mono text-lg p-2 bg-background rounded-md border" onMouseEnter={() => setHighlight('B_given_A')}>
                    P(B|A) = P(A ∩ B) / P(A)
                </div>
            </CardContent>
        </Card>
        
        {/* Step 4 */}
        <Card>
            <CardHeader>
                <Badge variant="outline" className="w-fit">Step 4 of 4</Badge>
                <CardTitle className="mt-2">The Final Derivation: Putting It All Together</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground">We have two different ways to express the same thing: the intersection **P(A ∩ B)**. By rearranging our two conditional probability formulas, we get:</p>
                 <ul className="list-none space-y-2 font-mono text-center text-base">
                    <li className="p-2 bg-background rounded-md border">1. P(A ∩ B) = P(A|B) * P(B)</li>
                    <li className="p-2 bg-background rounded-md border">2. P(A ∩ B) = P(B|A) * P(A)</li>
                 </ul>
                <p className="text-muted-foreground">Since both right-hand sides are equal to the intersection, they must be equal to each other:</p>
                <div className="text-center font-mono text-lg p-2 bg-background rounded-md border">
                    P(A|B) * P(B) = P(B|A) * P(A)
                </div>
                <p className="text-muted-foreground">With one final step of algebra (dividing both sides by P(B)), we arrive at the famous Bayes' Theorem:</p>
                 <div className="text-center font-mono text-xl p-4 bg-primary/10 text-primary-foreground rounded-lg border-2 border-primary">
                    P(A|B) = (P(B|A) * P(A)) / P(B)
                </div>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
