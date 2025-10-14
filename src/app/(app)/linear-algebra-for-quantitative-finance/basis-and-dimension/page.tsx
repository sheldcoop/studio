
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function BasisAndDimensionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Basis and Dimension"
        description="The Perfect Building Blocks"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>We've spent the last two lessons developing two critical ideas: Span (what we can build) and Linear Independence (are our building blocks redundant?).</p>
        <p>Now, we combine these two ideas to answer the ultimate question: <strong>What is the perfect, most efficient set of building blocks for a given space?</strong> The answer is a <strong>basis</strong>.</p>
      </article>

      <DefinitionCard title="What is a Basis?">
        <p>A basis for a vector space is a set of vectors that satisfies two conditions simultaneously:</p>
        <ol className="list-decimal pl-6 space-y-2 font-semibold">
          <li>The set must be <strong>linearly independent</strong>. (No redundant vectors.)</li>
          <li>The <strong>span</strong> of the set must be the entire space. (The vectors must be powerful enough to build everything.)</li>
        </ol>
        <p className="mt-4">A basis is the goldilocks set of vectors—not too few and not too many. It is the minimal set of vectors required to describe an entire space.</p>
      </DefinitionCard>

      <PageSection title="The Standard Basis: The Simplest Example">
        <p className="prose prose-invert max-w-none">In the 2D xy-plane, the standard basis vectors are <InlineMath math="i = [1, 0]" /> and <InlineMath math="j = [0, 1]" />. They are linearly independent and they span all of <InlineMath math="\mathbb{R}^2" />. Thus, they form a basis.</p>
      </PageSection>

      <PageSection title="Many Bases, One Space">
        <p className="prose prose-invert max-w-none">A crucial point: a vector space can have infinitely many different bases. For example, the vectors <InlineMath math="v = [1, 2]" /> and <InlineMath math="w = [-3, 1]" /> are also linearly independent and span <InlineMath math="\mathbb{R}^2" />, so they too form a valid basis.</p>
      </PageSection>
      
      <DefinitionCard title="Dimension: The Unchanging Number">
        <p>This is the beautiful, unifying idea. The number of vectors in <strong>any</strong> basis for a vector space is always the same. This unique number is called the <strong>dimension</strong> of the space.</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Any basis for the 2D plane (<InlineMath math="\mathbb{R}^2" />) will have exactly <strong>two</strong> vectors. Therefore, <InlineMath math="\mathbb{R}^2" /> has a dimension of 2.</li>
            <li>Any basis for 3D space (<InlineMath math="\mathbb{R}^3" />) will have exactly <strong>three</strong> vectors. Therefore, <InlineMath math="\mathbb{R}^3" /> has a dimension of 3.</li>
        </ul>
      </DefinitionCard>

      <KeyConceptAlert title="The Core Idea for Quants & ML" icon="brain">
        <p>When we talk about **Dimensionality Reduction**, we are talking about finding a lower-dimensional subspace that captures most of the important information in our high-dimensional data.</p>
        <p className="mt-2">Imagine a dataset of stocks with 50 features (50 dimensions). **Principal Component Analysis (PCA)** is an algorithm that finds a new, more efficient **basis** for this data. By projecting your data onto the first few vectors of this new basis, you reduce the dimension from 50 to maybe 3 or 4, making your models simpler and more robust.</p>
      </KeyConceptAlert>

      <LessonSummaryCard title="Summary: The Essential Framework">
        <li><strong>Basis:</strong> A set of vectors that is both <strong>linearly independent</strong> and **spans the entire space**.</li>
        <li><strong>Dimension:</strong> The one thing all bases for a space share is the **number of vectors** they contain. This number is the dimension of the space.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/vector-spaces-and-subspaces">
        Vector Spaces and Subspaces
      </NextUpNavigation>
    </div>
  );
}
