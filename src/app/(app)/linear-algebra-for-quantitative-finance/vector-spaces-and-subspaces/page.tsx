
import { PageHeader } from '@/components/app/page-header';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function VectorSpacesAndSubspacesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Vector Spaces and Subspaces"
        description="The Arenas of Data"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>Throughout this entire module, we've been playing in a specific kind of mathematical "arena." We've been taking vectors, adding them, scaling them, and seeing what we can build. These arenas have a formal name: <strong>Vector Spaces</strong>.</p>
        <p>This final lesson of our foundational module won't introduce any new complex mechanics. Instead, it will give you the precise definitions and "rules of the game" that formally describe the world we've been intuitively exploring.</p>
      </article>

      <PageSection title="What is a Vector Space? (The Official Rules)">
        <DefinitionCard title="The Rules of the Game">
            <p>A vector space is a collection of objects (which we call "vectors") for which two operations are defined: Vector Addition and Scalar Multiplication. For a collection to be a true vector space, these operations must obey a set of ten simple, intuitive rules, such as:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineMath math="v + w = w + v" /> (The order of addition doesn't matter)</li>
                <li><InlineMath math="c \cdot (v + w) = c \cdot v + c \cdot w" /> (The distributive property holds)</li>
                <li>There must be a **zero vector** (<InlineMath math="\vec{0}" />) such that <InlineMath math="v + \vec{0} = v" />.</li>
            </ul>
        </DefinitionCard>
      </PageSection>

       <PageSection title="What is a Subspace? (A Space Within a Space)">
          <DefinitionCard title="The Three Requirements for a Subspace">
            <p>A subspace is a vector space that is contained inside another, larger vector space. For a collection of vectors <InlineMath math="S" /> to be a subspace, it must satisfy three conditions:</p>
            <ol className="list-decimal pl-6 space-y-2 font-semibold">
                <li>`S` must contain the **zero vector**. (All subspaces must pass through the origin).</li>
                <li>`S` must be **closed under addition**. (If <InlineMath math="v" /> and <InlineMath math="w" /> are in <InlineMath math="S" />, then <InlineMath math="v+w" /> must also be in <InlineMath math="S" />).</li>
                <li>`S` must be **closed under scalar multiplication**. (If <InlineMath math="v" /> is in <InlineMath math="S" />, then <InlineMath math="c \cdot v" /> must also be in <InlineMath math="S" />).</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-2">The **span** of any set of vectors is a subspace.</p>
          </DefinitionCard>
      </PageSection>

      <PageSection title="Why We Care: The Column Space and Null Space">
        <p className="prose prose-invert max-w-none">This language of subspaces is the essential language for describing the most important ideas related to matrices. When we solve systems of equations, we will meet two incredibly important subspaces associated with every matrix <InlineMath math="A" />:</p>
        <ol className="list-decimal pl-6 space-y-2 prose prose-invert max-w-none">
            <li><strong>The Column Space of A (C(A)):</strong> This is the **span of the column vectors of A**. It is the subspace containing all possible outputs of the transformation <InlineMath math="Ax" />.</li>
            <li><strong>The Null Space of A (N(A)):</strong> This is the set of all input vectors <InlineMath math="x" /> that get "squashed" to the zero vector by the transformation (i.e., all <InlineMath math="x" /> such that <InlineMath math="Ax = \vec{0}" />).</li>
        </ol>
        <p className="prose prose-invert max-w-none">Understanding that these are not just random collections of vectors, but are in fact self-contained **subspaces** with their own **basis** and **dimension**, is the key to unlocking the Fundamental Theorem of Linear Algebra.</p>
      </PageSection>

      <LessonSummaryCard title="Module 1 Summary: A New Worldview">
        <p>Congratulations! You've completed the foundational module. You started with the simple idea of a vector and have now built a complete conceptual framework for describing the spaces they live in.</p>
        <p className="font-semibold mt-2">You have learned the vocabulary:</p>
        <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
            <li>**Vectors** and **Matrices** as both data and transformations.</li>
            <li>**Operations** like the Dot Product and Matrix Multiplication.</li>
            <li>The creative tools of **Span** and **Linear Combination**.</li>
            <li>The efficiency test of **Linear Independence**.</li>
            <li>The perfect structure of a **Basis** and the concept of **Dimension**.</li>
            <li>The formal arenas of **Vector Spaces** and **Subspaces**.</li>
        </ul>
        <p className="mt-4 font-semibold">You now have a powerful new geometric intuition for data. You are no longer just looking at spreadsheets; you are looking at points in high-dimensional space, ready to be transformed, projected, and understood.</p>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/framing-the-problem-ax-b">
        Module 2: Solving Ax = b
      </NextUpNavigation>
    </div>
  );
}
