
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function VectorSpacesAndSubspacesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Vector Spaces and Subspaces"
        description="The Arenas of Data"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Throughout this entire module, we've been playing in a specific kind of mathematical "arena." We've been taking vectors, adding them, scaling them, and seeing what we can build.
        </p>
        <p>
          These arenas have a formal name: <strong>Vector Spaces</strong>.
        </p>
        <p>
            This final lesson of our foundational module won't introduce any new complex mechanics. Instead, it will give you the precise definitions and "rules of the game" that formally describe the world we've been intuitively exploring.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">What is a Vector Space? (The Official Rules)</CardTitle>
          <CardDescription>
            A vector space is a collection of objects (which we call "vectors") for which two operations are defined: Vector Addition and Scalar Multiplication. For a collection to be a true vector space, these operations must obey a set of ten simple, intuitive rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <p>You don't need to memorize them, but it's good to see them once. They are things you would naturally assume to be true. For example:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineMath math="v + w = w + v" /> (The order of addition doesn't matter)</li>
                <li><InlineMath math="c \cdot (v + w) = c \cdot v + c \cdot w" /> (The distributive property holds)</li>
                <li>There must be a **zero vector** (<InlineMath math="\vec{0}" />) such that <InlineMath math="v + \vec{0} = v" />.</li>
                <li>For every vector <InlineMath math="v" />, there is an opposite vector <InlineMath math="-v" /> such that <InlineMath math="v + (-v) = \vec{0}" />.</li>
            </ul>
             <p className="mt-4">The set of all 2D vectors (<InlineMath math="\mathbb{R}^2" />) that we've been working with is a vector space. So is <InlineMath math="\mathbb{R}^3" />, <InlineMath math="\mathbb{R}^4" />, and so on. The real power of this abstract definition is that it allows things other than lists of numbers to be considered "vectors," like the set of all continuous functions.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">What is a Subspace? (A Space Within a Space)</CardTitle>
          <CardDescription>
            A subspace is a vector space that is contained inside another, larger vector space. For example, a plane passing through the origin is a subspace of 3D space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>The **span** of any set of vectors is a subspace.</p>
            <p><strong>The Three Requirements for a Subspace:</strong> For a collection of vectors <InlineMath math="S" /> to be a subspace, it must satisfy three conditions:</p>
            <ol className="list-decimal pl-6 space-y-2 font-semibold">
                <li>`S` must contain the **zero vector**. (All subspaces must pass through the origin).</li>
                <li>`S` must be **closed under addition**. (If <InlineMath math="v" /> and <InlineMath math="w" /> are in <InlineMath math="S" />, then <InlineMath math="v+w" /> must also be in <InlineMath math="S" />).</li>
                <li>`S` must be **closed under scalar multiplication**. (If <InlineMath math="v" /> is in <InlineMath math="S" />, then <InlineMath math="c \cdot v" /> must also be in <InlineMath math="S" />).</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-2">A line or a plane *not* passing through the origin is **not** a subspace.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Why We Care: The Column Space and Null Space</CardTitle>
           <CardDescription>
            This language of subspaces is the essential language for describing the most important ideas related to matrices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>When we solve systems of equations, we will meet two incredibly important subspaces associated with every matrix <InlineMath math="A" />:</p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>
                    <strong>The Column Space of A (C(A)):</strong> This is the **span of the column vectors of A**. It is the subspace containing all possible outputs of the transformation <InlineMath math="Ax" />. It answers the question, "Where can our input vectors possibly land?"
                </li>
                 <li>
                    <strong>The Null Space of A (N(A)):</strong> This is the set of all input vectors <InlineMath math="x" /> that get "squashed" to the zero vector by the transformation (i.e., all <InlineMath math="x" /> such that <InlineMath math="Ax = \vec{0}" />). This subspace answers the question, "What information is lost by the transformation?"
                </li>
            </ol>
             <p className="mt-2">Understanding that these are not just random collections of vectors, but are in fact self-contained **subspaces** with their own **basis** and **dimension**, is the key to unlocking the Fundamental Theorem of Linear Algebra.</p>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 border-primary">
        <CardHeader>
          <CardTitle>Module 1 Summary: A New Worldview</CardTitle>
          <CardDescription>Congratulations! You've completed the foundational module. You started with the simple idea of a vector and have now built a complete conceptual framework for describing the spaces they live in.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>You have learned the vocabulary:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                <li>**Vectors** and **Matrices** as both data and transformations.</li>
                <li>**Operations** like the Dot Product and Matrix Multiplication.</li>
                <li>The creative tools of **Span** and **Linear Combination**.</li>
                <li>The efficiency test of **Linear Independence**.</li>
                <li>The perfect structure of a **Basis** and the concept of **Dimension**.</li>
                <li>The formal arenas of **Vector Spaces** and **Subspaces**.</li>
            </ul>
            <p className="mt-4 font-semibold">You now have a powerful new geometric intuition for data. You are no longer just looking at spreadsheets; you are looking at points in high-dimensional space, ready to be transformed, projected, and understood.</p>
        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground">
        <strong>Up Next in Module 2:</strong> It's time to put this new worldview into practice. We will tackle the most fundamental problem in linear algebra: solving the system of equations <InlineMath math="Ax = b" />, and in doing so, we will explore the four fundamental subspaces that define every matrix.
      </p>
    </div>
  );
}
