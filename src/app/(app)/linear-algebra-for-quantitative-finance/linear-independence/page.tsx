
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function LinearIndependencePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Linear Independence"
        description="Identifying and removing redundant vectors."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>In our last lesson, we saw that when we took two vectors pointing in different directions, their span was the entire 2D plane. But when we took two collinear vectors, the second vector was <strong>redundant</strong>; it didn't add anything new to our span.</p>
        <p>This idea of redundancy is central to linear algebra. A set of vectors is said to be <strong>linearly independent</strong> if no vector in the set can be written as a linear combination of the others. Conversely, a set is <strong>linearly dependent</strong> if at least one vector is a combination of the others.</p>
      </article>

      <PageSection title='The Formal Definition (The "Zero" Test)'>
        <DefinitionCard title="How the Test Works">
          <p>Consider the vector equation: <BlockMath math="c_1v_1 + c_2v_2 + \dots + c_nv_n = \vec{0}" /></p>
          <p>This asks: "Is there a linear combination of our vectors that results in the <strong>zero vector</strong>?" There is always one trivial solution: set all the scalars to zero. The real question is: **Is the trivial solution the *only* solution?**</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>If the only way to get the zero vector is the trivial solution (all <InlineMath math="c" />'s are zero), then the set of vectors is <strong>linearly independent</strong>.</li>
            <li>If there is *any* non-trivial solution (where at least one <InlineMath math="c" /> is not zero), then the set is <strong>linearly dependent</strong>.</li>
          </ul>
        </DefinitionCard>
      </PageSection>

      <PageSection title="Visualizing Linear Dependence">
        <ul className="list-disc pl-6 space-y-4 prose prose-invert max-w-none">
          <li><strong>In 2D:</strong> Two vectors are linearly dependent if they are <strong>collinear</strong>. Three or more vectors in 2D are *always* linearly dependent.</li>
          <li><strong>In 3D:</strong> Three vectors are linearly dependent if they are <strong>coplanar</strong> (they lie on the same plane).</li>
        </ul>
      </PageSection>

      <KeyConceptAlert title="The Core Idea for Quants & ML" icon="brain">
        <p>Linear dependence in your features is called <strong>multicollinearity</strong>, and it's a major headache for many statistical models, especially linear regression.</p>
        <p className="mt-2">Imagine you're predicting a stock price using: (1) revenue in USD, (2) revenue in EUR, and (3) number of employees. The revenue features are almost perfectly linearly dependent. A regression model would struggle to assign importance. Identifying and removing linearly dependent features is a crucial step in building robust quantitative models.</p>
      </KeyConceptAlert>

      <LessonSummaryCard title="Summary: The Efficiency Test">
        <li><strong>Linearly Independent:</strong> A set of vectors containing no redundant information. Each vector adds a new dimension to the span.</li>
        <li><strong>Linearly Dependent:</strong> A set of vectors containing redundant information. At least one vector is a combination of the others.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/basis-and-dimension">
        Basis and Dimension
      </NextUpNavigation>
    </div>
  );
}
