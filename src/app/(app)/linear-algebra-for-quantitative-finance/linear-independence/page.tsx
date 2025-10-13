
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function LinearIndependencePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Linear Independence"
        description="Identifying and removing redundant vectors."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we saw something interesting.
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li>When we took two vectors pointing in different directions, <InlineMath math="v = [1, 2]" /> and <InlineMath math="w = [-3, 1]" />, their span was the entire 2D plane.</li>
            <li>But when we took two vectors pointing in the same direction, <InlineMath math="v = [1, 2]" /> and <InlineMath math="u = [2, 4]" />, their span was just a line. The second vector, <InlineMath math="u" />, was **redundant**. It didn't add anything new to our span.</li>
        </ul>
        <p>
          This idea of redundancy is central to linear algebra. We need a formal way to describe it, and that language is **Linear Independence**.
        </p>
        <p>
          A set of vectors is said to be **linearly independent** if no vector in the set can be written as a linear combination of the others.
        </p>
        <p>
          Conversely, a set of vectors is **linearly dependent** if at least one vector in the set *is* a linear combination of the others—making it redundant.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Formal Definition (The "Zero" Test)</CardTitle>
          <CardDescription>
            The "can one be made from the others" intuition is great, but there's a more robust, mathematical way to define this. Consider the vector equation:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlockMath math="c_1v_1 + c_2v_2 + \dots + c_nv_n = \vec{0}" />
          <p>This asks: "Is there a linear combination of our vectors that results in the **zero vector** (the vector <InlineMath math="[0, 0, \dots]" /> at the origin)?"</p>
          <p>There is always one trivial solution: just set all the scalars to zero. <InlineMath math="0 \cdot v_1 + 0 \cdot v_2 + \dots = \vec{0}" />. This is the "boring" solution.</p>
          <p>The real question is: **Is the trivial solution the *only* solution?**</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>If the only way to get the zero vector is the trivial solution (all <InlineMath math="c" />'s are zero), then the set of vectors <InlineMath math="\{v_1, v_2, \dots\}" /> is **linearly independent**.</li>
            <li>If there is *any* non-trivial solution (where at least one <InlineMath math="c" /> is not zero), then the set is **linearly dependent**.</li>
          </ul>
           <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold">Why This Test Works</h4>
                <p>Let's see this in action with our dependent set <InlineMath math="\{v, u\}" /> where <InlineMath math="v = [1, 2]" /> and <InlineMath math="u = [2, 4]" />. We know that <InlineMath math="u = 2v" />, which can be rewritten as:</p>
                <BlockMath math="2v - u = \vec{0}" />
                <p>This is <InlineMath math="2 \cdot v + (-1) \cdot u = \vec{0}" />. This is a non-trivial linear combination (the scalars are 2 and -1) that equals the zero vector! This proves that the set is linearly dependent. It captures the redundancy perfectly.</p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Visualizing Linear Dependence</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>In 2D:</strong>
              <ul className="list-circle pl-6 mt-2 space-y-1">
                <li>Two vectors are linearly dependent if they are **collinear** (they lie on the same line).</li>
                <li>Three or more vectors in 2D are *always* linearly dependent. You can always make one from the other two.</li>
              </ul>
            </li>
            <li>
              <strong>In 3D:</strong>
              <ul className="list-circle pl-6 mt-2 space-y-1">
                <li>Two vectors are linearly dependent if they are collinear.</li>
                <li>Three vectors are linearly dependent if they are **coplanar** (they lie on the same plane). One vector's contribution is redundant because you can already reach its tip using a combination of the other two.</li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="border p-4 rounded-lg bg-muted/50">
        <h4 className="font-semibold font-headline">The Core Idea for Quants & ML</h4>
        <p className="mt-2 text-sm">Linear dependence in your features is called **multicollinearity**, and it's a major headache for many statistical models, especially linear regression.</p>
        <p className="mt-2 text-sm">Imagine you're predicting a company's stock price using these three features:</p>
        <ol className="list-decimal pl-6 mt-2 text-sm space-y-1">
            <li><InlineMath math="f_1" />: Company's quarterly revenue in USD.</li>
            <li><InlineMath math="f_2" />: Company's quarterly revenue in EUR.</li>
            <li><InlineMath math="f_3" />: Number of employees.</li>
        </ol>
        <p className="mt-2 text-sm">The feature vectors for <InlineMath math="f_1" /> and <InlineMath math="f_2" /> are almost perfectly linearly dependent. A regression model would have a terrible time trying to figure out how to assign importance. Identifying and removing linearly dependent features is a crucial step in building robust quantitative models.</p>
    </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary: The Efficiency Test</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Linearly Independent:</strong> A set of vectors containing no redundant information. Each vector adds a new dimension to the span. The only linear combination that equals the zero vector is the trivial one.</li>
            <li><strong>Linearly Dependent:</strong> A set of vectors containing redundant information. At least one vector is a combination of the others and does not expand the span. There is a non-trivial linear combination that equals the zero vector.</li>
          </ul>
        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We will combine the ideas of Span and Linear Independence to define a **Basis**—the perfect, minimal set of building blocks for any vector space.
      </p>
    </div>
  );
}
