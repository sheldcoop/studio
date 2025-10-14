
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { PitfallAlert } from '@/components/app/pitfall-alert';
import { ExampleStep } from '@/components/app/example-step';
import { DefinitionCard } from '@/components/app/definition-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function ColumnSpaceAndRankPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Column Space & Rank"
        description="The World of Possible Outputs"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Let's stop thinking about a specific <InlineMath math="b" /> and start thinking about <strong>all possible <InlineMath math="b" />'s</strong>. When we use our matrix <InlineMath math="A" /> as a transformation, what is the entire universe of possible output vectors? Where can our input vectors possibly land?
        </p>
        <p>
          The answer to this question is a beautiful, fundamental concept: the <strong>Column Space</strong>.
        </p>
      </article>

      <DefinitionCard title="Defining the Column Space">
        <p>The Column Space of a matrix <InlineMath math="A" />, written as <InlineMath math="C(A)" />, is the set of all possible linear combinations of its column vectors. In other words, **the Column Space is the span of the columns of <InlineMath math="A" />**.</p>
        <p className="mt-4">Remember the "Column Picture" of <InlineMath math="Ax = b" />? The product <InlineMath math="Ax" /> is simply a linear combination of the columns of A, where the weights are the entries of the vector <InlineMath math="x" />.</p>
        <BlockMath math="x_1 \cdot (\text{col } 1) + x_2 \cdot (\text{col } 2) + \dots + x_n \cdot (\text{col } n) = Ax" />
        <KeyConceptAlert title="The Core Insight">
            The Column Space of <InlineMath math="A" /> is the set of all possible output vectors <InlineMath math="b" />. The equation <InlineMath math="Ax = b" /> has a solution if, and only if, the vector <InlineMath math="b" /> lives inside the Column Space of <InlineMath math="A" />. If <InlineMath math="b" /> is outside <InlineMath math="C(A)" />, the system is inconsistent.
        </KeyConceptAlert>
      </DefinitionCard>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Finding a Basis for the Column Space</CardTitle>
          <CardDescription>The columns of <InlineMath math="A" /> span the Column Space, but they might be linearly dependent. We need a non-redundant basis. The pivot columns of the original matrix <InlineMath math="A" /> form this basis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExampleStep stepNumber={1} title="Reduce A to Row Echelon Form (REF)">
            <p>For matrix `A`, we find its REF, which we'll call `U`:</p>
            <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix} \quad \xrightarrow{\text{Elim}} \quad U = \begin{bmatrix} \mathbf{1} & 2 & 3 & 4 \\ 0 & 0 & \mathbf{1} & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />
          </ExampleStep>
          <ExampleStep stepNumber={2} title="Identify the pivot columns in `U`">
            <p>The pivots (the first non-zero entries in each row) are in <strong>Column 1</strong> and <strong>Column 3</strong>.</p>
          </ExampleStep>
          <ExampleStep stepNumber={3} title="The basis is the corresponding columns from the *original* matrix `A`">
            <p>A basis for <InlineMath math="C(A)" /> is:</p>
            <BlockMath math="\left\{ \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \begin{bmatrix} 3 \\ 7 \\ 8 \end{bmatrix} \right\}" />
            <PitfallAlert title="Warning">
              Do NOT use the pivot columns from `U`. Row operations change the column space. You must use the columns from the original `A`. The REF simply tells you *which* columns to pick.
            </PitfallAlert>
          </ExampleStep>
        </CardContent>
      </Card>

      <DefinitionCard title="The Concept of Rank">
        <p>The **rank** of a matrix <InlineMath math="A" /> is the **dimension of its Column Space**.</p>
        <p className="mt-2">Equivalently, and more practically: The **rank of <InlineMath math="A" /> is the number of pivots** in its row echelon form.</p>
        <p className="mt-4">In our example, we found 2 pivots, so the **rank of <InlineMath math="A" /> is 2**. This means the four column vectors of <InlineMath math="A" />, which live in 3D space, actually only span a 2-dimensional subspace (a plane).</p>
      </DefinitionCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-null-space">
        The Null Space
      </NextUpNavigation>
    </div>
  );
}
