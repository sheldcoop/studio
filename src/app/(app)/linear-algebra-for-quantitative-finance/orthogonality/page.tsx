
import { PageHeader } from '@/components/app/page-header';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { FormulaBlock } from '@/components/app/formula-block';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { PageSection } from '@/components/app/page-section';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function OrthogonalityPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Orthogonality"
        description="The profound implications of being at right angles."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>In the last lesson, we discovered the dot product and its connection to the angle between two vectors. We saw that a large positive dot product means two vectors are "aligned," while a large negative one means they are "opposed."</p>
        <p>But what about the most interesting case? What happens when the dot product is exactly zero?</p>
        <p>From our geometric formula, <InlineMath math="v \cdot w = \|v\| \|w\| \cos(\theta)" />, the only way for the dot product to be zero (assuming non-zero vectors) is if <InlineMath math="\cos(\theta) = 0" />. This happens when the angle <InlineMath math="\theta" /> is exactly 90 degrees.</p>
        <p>Vectors that are at a 90-degree angle to each other are called <strong>orthogonal</strong>. This is the precise mathematical term for "perpendicular." This simple geometric idea has profound implications in the world of data. In linear algebra, orthogonality is the mathematical embodiment of <strong>independence</strong> and <strong>non-redundancy</strong>.</p>
      </article>

      <PageSection title="The Power of Zero: Why Orthogonality Matters">
        <p className="prose prose-invert max-w-none">When two vectors are orthogonal, moving along one of them has absolutely no effect on your position relative to the other. Think of the cardinal directions: North, South, East, and West.</p>
        <ul className="list-disc pl-6 prose prose-invert max-w-none">
            <li>The direction "East" is orthogonal to the direction "North."</li>
            <li>If you walk 10 miles East, how much progress have you made in the Northerly direction? Zero.</li>
        </ul>
        <p className="prose prose-invert max-w-none">The two directions are completely independent. Your movement in one has no component, no "shadow," in the other. This is what a zero dot product signifies. The projection of one vector onto the other is zero.</p>
      </PageSection>

      <DefinitionCard title="The Orthogonality Test">
          <p>To check if two vectors <InlineMath math="v" /> and <InlineMath math="w" /> are orthogonal, simply compute their dot product.</p>
          <FormulaBlock>
            <p>If <InlineMath math="v \cdot w = 0" />, they are orthogonal.</p>
          </FormulaBlock>
          <p>Let's test <InlineMath math="v = [2, 3]" /> and <InlineMath math="w = [-3, 2]" />.</p>
          <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="v \cdot w = (2 \times -3) + (3 \times 2) = -6 + 6 = 0" /></p>
          <p>Yes, they are orthogonal! Even though it's not obvious from the numbers, these two vectors form a perfect right angle.</p>
      </DefinitionCard>

      <PageSection title="Orthogonality in Data: Non-Redundant Features">
        <p className="prose prose-invert max-w-none">Imagine you're building a machine learning model to predict house prices. You have two features:</p>
        <ul className="list-disc pl-6 prose prose-invert max-w-none">
            <li><InlineMath math="f_1" />: Size of the house in square feet.</li>
            <li><InlineMath math="f_2" />: Size of the house in square meters.</li>
        </ul>
        <p className="prose prose-invert max-w-none">These two features are almost perfectly correlated. They are redundant. As vectors in "feature space," they would point in almost the exact same direction. Their dot product would be very high.</p>
        <p className="prose prose-invert max-w-none">Now consider two different features:</p>
        <ul className="list-disc pl-6 prose prose-invert max-w-none">
          <li><InlineMath math="f_1" />: Size of the house (sq. feet).</li>
          <li><InlineMath math="f_3" />: Number of parks within a 1-mile radius.</li>
        </ul>
        <p className="prose prose-invert max-w-none">These two features are likely to be far more independent. They provide unique, non-overlapping information. As vectors, they would be close to orthogonal.</p>
        <KeyConceptAlert title="Why is this important for Quants and ML?" icon="brain">
          <p>Models, especially regression models, can become unstable and unreliable when their input features are highly correlated (redundant). This problem is called <strong>multicollinearity</strong>.</p>
          <p>By transforming our data into a set of orthogonal basis vectors, we can create a set of perfectly non-redundant, independent features. This is the entire goal of powerful techniques like <strong>Principal Component Analysis (PCA)</strong>.</p>
        </KeyConceptAlert>
      </PageSection>

      <DefinitionCard title="Orthonormal Bases: The Ideal Coordinate System">
        <p>We can take the idea of orthogonality one step further. What if we have a set of vectors that are all orthogonal to each other, and they all have a length (L2 norm) of exactly 1? Such a set of vectors is called an <strong>orthonormal set</strong>.</p>
        <p>The standard basis vectors in 2D, <InlineMath math="i = [1, 0]" /> and <InlineMath math="j = [0, 1]" />, are the perfect example.</p>
        <ul className="list-disc pl-6">
            <li>They are orthogonal: <InlineMath math="[1, 0] \cdot [0, 1] = 0" />.</li>
            <li>They have a length of 1: <InlineMath math="\|[1, 0]\| = 1" /> and <InlineMath math="\|[0, 1]\| = 1" />.</li>
        </ul>
        <p>Working with an orthonormal basis is the ideal scenario in linear algebra. The process of taking a regular basis and turning it into an orthonormal one is called the <strong>Gram-Schmidt process</strong>, a key algorithm we will visit later.</p>
      </DefinitionCard>

      <LessonSummaryCard title="Summary: The Power of Perpendicular">
        <li><strong>Orthogonal Vectors:</strong> Two vectors are orthogonal if their dot product is exactly zero (<InlineMath math="v \cdot w = 0" />).</li>
        <li><strong>The Meaning:</strong> Orthogonality represents independence and non-redundancy.</li>
        <li><strong>The Goal:</strong> Many advanced algorithms (like PCA and QR Decomposition) are fundamentally about transforming a problem into an orthonormal basis, because it makes the math simpler and the solutions more stable.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-two-views-of-a-matrix">
        The Two Views of a Matrix
      </NextUpNavigation>
    </div>
  );
}
