
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function LinearCombinationsAndSpanPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Linear Combinations and Span"
        description="What Can You Build With Vectors?"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>We've assembled our toolkit. We have our fundamental objects (vectors) and the rules for manipulating them (addition and scalar multiplication).</p>
        <p>Now, we can ask the most important creative question in all of linear algebra: <strong>With a given set of vectors, what can we build?</strong></p>
        <p>The answer to this question lies in two beautifully linked concepts: <strong>Linear Combinations</strong> and <strong>Span</strong>.</p>
      </article>

      <PageSection title="Linear Combinations: The Recipe">
        <DefinitionCard title="What is a Linear Combination?">
          <p>A linear combination is the fundamental "recipe" for building new vectors out of old ones. It's an expression made from two ingredients: Scalar Multiplication (scaling your ingredient vectors) and Vector Addition (mixing them together).</p>
          <p>Let's say we have two vectors, <InlineMath math="v = [1, 2]" /> and <InlineMath math="w = [-3, 1]" />. A linear combination is any vector that can be written in the form:</p>
          <BlockMath math="c_1v_1 + c_2v_2 + \dots + c_nv_n" />
          <p>Where <InlineMath math="c_1, c_2, \dots" /> are any scalars you choose. Let's compute one:</p>
          <BlockMath math="2v + 1w = 2\begin{bmatrix} 1 \\ 2 \end{bmatrix} + 1\begin{bmatrix} -3 \\ 1 \end{bmatrix} = \begin{bmatrix} -1 \\ 5 \end{bmatrix}" />
          <p>So, the vector <InlineMath math="[-1, 5]" /> is one possible linear combination of <InlineMath math="v" /> and <InlineMath math="w" />.</p>
        </DefinitionCard>
      </PageSection>

      <PageSection title="Span: All the Things You Can Possibly Build">
        <DefinitionCard title="What is Span?">
          <p>The set of <strong>all possible vectors</strong> you can create through a linear combination of a set of vectors is called the <strong>span</strong> of those vectors.</p>
          <p>If we only had vector <InlineMath math="v" />, its span would be the infinite line it sits on. But with both <InlineMath math="v" /> and <InlineMath math="w" />, which point in different directions, we can reach any point in the entire 2D plane by choosing different scalars. The span of <InlineMath math="v" /> and <InlineMath math="w" /> is all of 2D space (<InlineMath math="\mathbb{R}^2" />).</p>
        </DefinitionCard>
        <KeyConceptAlert title="The Core Idea for Quants & ML" icon="brain">
          <p>Span tells you the "expressive power" of your features. Imagine your model is `Stock Price = c₁ * (GDP Growth) + c₂ * (Interest Rate)`. The span of the "GDP" and "Interest Rate" vectors represents all possible outcomes your model can explain. If you add a new factor that is just a multiple of GDP growth, you haven't expanded the span at all. You've added redundant information.</p>
        </KeyConceptAlert>
      </PageSection>

      <LessonSummaryCard title="Summary: The Creative Tools">
        <li><strong>Linear Combination:</strong> The recipe for building new vectors. It's a weighted sum of a set of "ingredient" vectors (<InlineMath math="c_1v_1 + c_2v_2" />).</li>
        <li><strong>Span:</strong> The result of all possible recipes. It's the complete set of all vectors that can be built from your starting set.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/linear-independence">
        Linear Independence
      </NextUpNavigation>
    </div>
  );
}
