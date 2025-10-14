
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function VectorOperationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Vector Operations"
        description="The Rules of Moving in Space"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>In the last lesson, we established our "Grand Unified Theory" of vectors: a list of numbers is an arrow in space. This insight is powerful, but it’s just the beginning.</p>
        <p>Now, we need to define the rules for how these vectors interact. How do they move? How can we combine them? These rules are called operations, and the two most fundamental are <strong>addition</strong> and <strong>scalar multiplication</strong>.</p>
        <p>They might sound fancy, but as you'll see, they have simple, beautiful geometric interpretations.</p>
      </article>

      <PageSection title="Vector Addition: Combining Journeys">
        <DefinitionCard title="The Data Scientist's View (The Easy Part)">
            <p>Let's say we have two vectors, <InlineMath math="v" /> and <InlineMath math="w" />.</p>
            <BlockMath math="v = [2, 1] \quad w = [1, 3]" />
            <p>From the "list of numbers" perspective, the answer is incredibly simple. To add two vectors, you just add their corresponding components.</p>
            <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="v + w = [2+1, 1+3] = [3, 4]" /></p>
        </DefinitionCard>
        <DefinitionCard title="The Physicist's View (The 'Aha!' Moment)">
            <p>Geometrically, adding vectors is like combining a series of movements. Imagine a vector as a journey: "walk 2 steps east, then 1 step north."</p>
            <p>To add vector <InlineMath math="w" /> to <InlineMath math="v" />, we simply start the journey of <InlineMath math="w" /> where the journey of <InlineMath math="v" /> ended.</p>
            <ol className="list-decimal pl-6">
                <li><strong>Draw v:</strong> Start at the origin and draw the arrow for <InlineMath math="[2, 1]" />.</li>
                <li><strong>Draw w:</strong> Start at the tip of <InlineMath math="v" /> and draw the arrow for <InlineMath math="[1, 3]" /> (1 step east, 3 steps north).</li>
                <li><strong>The Result:</strong> The sum, <InlineMath math="v + w" />, is the new vector that starts at the origin and ends at the tip of the final vector, <InlineMath math="w" />.</li>
            </ol>
            <p>This is the "tip-to-tail" rule, and it perfectly matches our numerical result! The final destination is indeed <InlineMath math="[3, 4]" />.</p>
        </DefinitionCard>
      </PageSection>

      <PageSection title="Scalar Multiplication: Scaling Vectors">
         <DefinitionCard title="The Data Scientist's View (Again, The Easy Part)">
            <p>Let's take our vector <InlineMath math="v = [2, 1]" /> and multiply it by the scalar 3.</p>
            <p>Just like with addition, the rule is simple: you multiply every component of the vector by the scalar.</p>
            <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="3 \times v = [3 \times 2, 3 \times 1] = [6, 3]" /></p>
        </DefinitionCard>
         <DefinitionCard title="The Physicist's View (The Intuition)">
            <p>Geometrically, multiplying a vector by a scalar scales its length.</p>
            <ul className="list-disc pl-6">
              <li>Multiplying by a scalar &gt; 1 stretches the vector.</li>
              <li>Multiplying by a scalar between 0 and 1 shrinks it.</li>
              <li>Multiplying by a negative scalar flips its direction and then scales it.</li>
            </ul>
            <p>The new vector <InlineMath math="[6, 3]" /> points in the exact same direction as <InlineMath math="[2, 1]" />, but it's exactly three times as long.</p>
        </DefinitionCard>
      </PageSection>

      <LessonSummaryCard title="Summary: The Two Fundamental Rules">
        <li><strong>Vector Addition (<InlineMath math="v + w" />):</strong> Combine vectors by adding their components. Geometrically, this is the "tip-to-tail" rule for combining journeys.</li>
        <li><strong>Scalar Multiplication (<InlineMath math="c \cdot v" />):</strong> Scale a vector by multiplying every component by a scalar. Geometrically, this stretches, shrinks, or flips the vector without changing its fundamental direction.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-dot-product-norms-and-angles">
        The Dot Product, Norms, and Angles
      </NextUpNavigation>
    </div>
  );
}
