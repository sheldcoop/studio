
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function DotProductPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Dot Product, Norms, and Angles"
        description="The tools for measuring length, distance, and relationships between vectors."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>So far, we've treated vectors as directions and data points. We know how to add and scale them. But this leaves us with some fundamental unanswered questions:</p>
        <ul className="list-disc pl-6">
            <li>How <strong>long</strong> is a vector?</li>
            <li>What's the <strong>distance</strong> between two vectors?</li>
            <li>How can we measure the <strong>relationship</strong> or "agreement" between two vectors?</li>
        </ul>
        <p>To answer these, we need to introduce a new set of tools for measurement. We'll start with the concept of "length," formally known as the <strong>norm</strong>.</p>
      </article>

      <PageSection title="How Long is a Vector? The Norm">
        <DefinitionCard title="The L2 Norm (The One You Know)">
            <p>Let's take our vector <InlineMath math="v = [3, 4]" />. When we draw it, what's its length? You probably see the answer instantly. The vector forms the hypotenuse of a right-angled triangle with sides of length 3 and 4. We can use the Pythagorean theorem!</p>
            <p className="font-mono bg-muted p-2 rounded-md">Length² = 3² + 4² = 9 + 16 = 25<br/>Length = √25 = 5</p>
            <p>This is the <strong>L2 Norm</strong>. It's the standard, "as the crow flies" Euclidean distance.</p>
            <FormulaBlock>
                <h4 className="font-semibold mb-2">The Formula: L2 Norm</h4>
                <p className="text-sm text-muted-foreground mb-2">For a vector <InlineMath math="v = [v₁, v₂, ..., vₙ]" />, its L2 norm, written as <InlineMath math="\|v\|_2" />, is:</p>
                <BlockMath math="\|v\|_2 = \sqrt{v_1^2 + v_2^2 + \dots + v_n^2}" />
            </FormulaBlock>
        </DefinitionCard>
        <DefinitionCard title='The L1 Norm (The "Manhattan" Distance)'>
            <p>What if you're not a crow? What if you're a taxi driver in Manhattan, forced to travel along a grid? The distance you'd travel for the vector <InlineMath math="[3, 4]" /> is simply <InlineMath math="3 + 4 = 7" />. This is the <strong>L1 Norm</strong>. You just sum the absolute values of the components.</p>
            <FormulaBlock>
                <h4 className="font-semibold mb-2">The Formula: L1 Norm</h4>
                <p className="text-sm text-muted-foreground mb-2">For a vector <InlineMath math="v" />, its L1 norm, written as <InlineMath math="\|v\|_1" />, is:</p>
                <BlockMath math="\|v\|_1 = |v_1| + |v_2| + \dots + |v_n|" />
            </FormulaBlock>
        </DefinitionCard>
      </PageSection>

      <PageSection title="The Dot Product: The Engine of Measurement">
        <DefinitionCard title="The Data Scientist's View (The Calculation)">
          <p>The dot product of two vectors, <InlineMath math="v" /> and <InlineMath math="w" />, is found by multiplying their corresponding components and then summing the results. Let <InlineMath math="v = [2, 1]" /> and <InlineMath math="w = [1, 3]" />. The dot product, written <InlineMath math="v \cdot w" />, is:</p>
          <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="v \cdot w = (2 \times 1) + (1 \times 3) = 2 + 3 = 5" /></p>
        </DefinitionCard>
        <DefinitionCard title='The Physicist\'s View (The "Projection" Intuition)'>
          <p>The dot product tells us about the <strong>agreement</strong> between two vectors. It answers the question: "How much is vector <InlineMath math="v" /> pointing in the same direction as vector <InlineMath math="w" />?"</p>
          <p>This relationship between the dot product and the angle between vectors is formalized by this crucial equation:</p>
          <FormulaBlock>
              <h4 className="font-semibold mb-2">The Geometric Definition of the Dot Product</h4>
              <BlockMath math="v \cdot w = \|v\| \|w\| \cos(\theta)" />
              <p className="text-sm text-muted-foreground mt-2">Where <InlineMath math="\|v\|" /> and <InlineMath math="\|w\|" /> are the L2 norms (lengths) of the vectors, and <InlineMath math="\theta" /> (theta) is the angle between them.</p>
          </FormulaBlock>
        </DefinitionCard>
      </PageSection>

      <PageSection title="Application: Cosine Similarity">
        <p className="prose prose-invert max-w-none">We can rearrange that magic formula to solve for what we're often most interested in: the angle. This value is called the Cosine Similarity.</p>
        <FormulaBlock>
          <BlockMath math="\cos(\theta) = \frac{v \cdot w}{\|v\| \|w\|}" />
        </FormulaBlock>
        <p className="prose prose-invert max-w-none">It will always be between -1 and 1, and it's one of the most important metrics in all of data science.</p>
        <ul className="list-disc pl-6 space-y-2 text-sm prose prose-invert max-w-none">
            <li><strong>Value of 1:</strong> The vectors point in the exact same direction (angle is 0°).</li>
            <li><strong>Value of 0:</strong> The vectors are orthogonal (angle is 90°).</li>
            <li><strong>Value of -1:</strong> The vectors point in opposite directions (angle is 180°).</li>
        </ul>
        <KeyConceptAlert title="Real-World Example: Recommending Movies" icon="brain">
            <p>Imagine a streaming service. Your taste is a vector, where each component is your rating for a movie:</p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1 font-mono">
                <li>You = [5, 4, 1, ..., 5]</li>
                <li>Alice = [5, 5, 2, ..., 4]</li>
                <li>Bob = [2, 1, 5, ..., 1]</li>
            </ul>
            <p className="mt-2">To find who is most similar to you, the service computes the cosine similarity between your vector and everyone else's. It then recommends movies that Alice loves but you haven't seen yet. This is the core principle behind many recommendation engines.</p>
        </KeyConceptAlert>
      </PageSection>

      <LessonSummaryCard title="Summary: Your Measurement Toolkit">
        <li><strong>Norm (Length):</strong> L2 for Euclidean distance, L1 for "Manhattan" distance.</li>
        <li><strong>Dot Product (<InlineMath math="v \cdot w" />):</strong> A simple calculation that reveals the geometric relationship between two vectors.</li>
        <li><strong>Cosine Similarity:</strong> A value from -1 to 1 that normalizes the dot product to give a pure measure of directional "agreement." The workhorse of similarity tasks.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/orthogonality">
        Orthogonality
      </NextUpNavigation>
    </div>
  );
}
