
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function BasisAndDimensionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Basis and Dimension"
        description="The Perfect Building Blocks"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've spent the last two lessons developing two critical ideas:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Span:</strong> What is the set of all vectors we can build?</li>
            <li><strong>Linear Independence:</strong> Are our building blocks redundant?</li>
        </ol>
        <p>
          Now, we combine these two ideas to answer the ultimate question: <strong>What is the perfect, most efficient set of building blocks for a given space?</strong>
        </p>
        <p>The answer is a <strong>basis</strong>.</p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">What is a Basis?</CardTitle>
          <CardDescription>
            A basis for a vector space is a set of vectors that satisfies two conditions simultaneously:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2 font-semibold">
            <li>The set must be <strong>linearly independent</strong>. (No redundant vectors.)</li>
            <li>The <strong>span</strong> of the set must be the entire space. (The vectors must be powerful enough to build everything.)</li>
          </ol>
          <p className="mt-4">A basis is the goldilocks set of vectors—not too few (they wouldn't span the whole space) and not too many (they would be linearly dependent). It is the minimal set of vectors required to describe an entire space.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Standard Basis: The Simplest Example</CardTitle>
          <CardDescription>You've been using a basis your entire life without knowing it. In the 2D xy-plane, the standard basis vectors are:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-center">
                <InlineMath math="i = [1, 0]" />
                <span className="mx-4">and</span>
                <InlineMath math="j = [0, 1]" />
            </div>
            <p>Let's check if they form a basis for all of 2D space (<InlineMath math="\mathbb{R}^2" />):</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Are they linearly independent?</strong> Yes. You can't make <InlineMath math="j" /> by just scaling <InlineMath math="i" />.</li>
                <li><strong>Do they span all of <InlineMath math="\mathbb{R}^2" />?</strong> Yes. Any vector <InlineMath math="[x, y]" /> can be written as <InlineMath math="x \cdot i + y \cdot j" />.</li>
            </ul>
            <p>Since they satisfy both conditions, <InlineMath math="\{i, j\}" /> is a basis for <InlineMath math="\mathbb{R}^2" />. Similarly, in 3D, the standard basis is <InlineMath math="\{ [1,0,0], [0,1,0], [0,0,1] \}" />.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Many Bases, One Space</CardTitle>
          <CardDescription>
            A crucial point: a vector space can have infinitely many different bases. The standard basis is not the only one. Consider our old friends, <InlineMath math="v = [1, 2]" /> and <InlineMath math="w = [-3, 1]" />.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Let's check if <InlineMath math="\{v, w\}" /> is a basis for <InlineMath math="\mathbb{R}^2" />:</p>
             <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Are they linearly independent?</strong> Yes, we already established this. They don't lie on the same line.</li>
                <li><strong>Do they span all of <InlineMath math="\mathbb{R}^2" />?</strong> Yes, we established this too. Their combinations can reach any point on the plane.</li>
            </ul>
            <p><InlineMath math="\{v, w\}" /> is also a perfectly valid basis for 2D space! It defines a different "coordinate system." While there can be many bases for a space, they all have one thing in common...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Dimension: The Unchanging Number</CardTitle>
          <CardDescription>
            This is the beautiful, unifying idea. The number of vectors in **any** basis for a vector space is always the same. This unique number is called the **dimension** of the space.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <ul className="list-disc pl-6 space-y-2">
                <li>Any basis for the 2D plane (<InlineMath math="\mathbb{R}^2" />) will have exactly **two** vectors. Therefore, <InlineMath math="\mathbb{R}^2" /> has a dimension of 2.</li>
                <li>Any basis for 3D space (<InlineMath math="\mathbb{R}^3" />) will have exactly **three** vectors. Therefore, <InlineMath math="\mathbbR}^3" /> has a dimension of 3.</li>
                <li>The span of two non-collinear vectors in 3D is a plane. Any basis for that plane will have **two** vectors. We say that plane is a 2-dimensional subspace of <InlineMath math="\mathbb{R}^3" />.</li>
            </ul>
        </CardContent>
      </Card>

      <div className="border p-4 rounded-lg bg-muted/50">
        <h4 className="font-semibold font-headline">The Core Idea for Quants & ML</h4>
        <p className="mt-2 text-sm">When we talk about **Dimensionality Reduction**, we are talking about finding a lower-dimensional subspace that captures most of the important information in our high-dimensional data.</p>
        <p className="mt-2 text-sm">Imagine a dataset of stocks with 50 features. This data lives in a 50-dimensional space. **Principal Component Analysis (PCA)** is an algorithm that finds a new, more efficient **basis** for this data. The first few vectors in this new basis define a lower-dimensional subspace. By projecting your data onto this subspace, you reduce the dimension from 50 to maybe 3 or 4, making your models simpler and more robust.</p>
    </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary: The Essential Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Basis:</strong> A set of vectors that is both **linearly independent** and **spans the entire space**.</li>
            <li><strong>Multiple Bases:</strong> A single space can have infinitely many different bases, each representing a different coordinate system.</li>
            <li><strong>Dimension:</strong> The one thing all bases for a space share is the **number of vectors** they contain. This number is the dimension of the space.</li>
          </ol>
        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We'll wrap up our foundational module by giving a formal name to the "arenas" where all this action takes place: **Vector Spaces and Subspaces**.
      </p>
    </div>
  );
}
