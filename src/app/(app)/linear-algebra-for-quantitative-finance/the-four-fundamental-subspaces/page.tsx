
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'the-four-fundamental-subspaces');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function FourFundamentalSubspacesPage() {
    const topicInfo = allTopics.find(t => t.id === 'the-four-fundamental-subspaces');
    if (!topicInfo) {
        notFound();
    }
    return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Four Fundamental Subspaces"
        description="A Complete Guide to How Matrices Transform Space"
        variant="aligned-left"
      />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-base text-foreground/90">
        <p>
            Ever wondered what a matrix *really* does? Beyond just a grid of numbers, a matrix is a machine that transforms space. It takes an input vector from one space and maps it to an output vector in another. The four fundamental subspaces give us a complete blueprint of this transformation, revealing exactly where vectors come from, where they can go, and what gets left behind.
        </p>
        <p>
            Let's explore this using a concrete example. Consider the matrix <InlineMath math="A" />:
        </p>
        <div className="text-center"><BlockMath math="A = \begin{pmatrix} 1 & 1 & 2 \\ 2 & 1 & 3 \end{pmatrix}" /></div>
        <p>
            This matrix defines a transformation that takes input vectors from a 3-dimensional space (<InlineMath math="\mathbb{R}^3" />) and produces output vectors in a 2-dimensional space (<InlineMath math="\mathbb{R}^2" />).
        </p>

        <hr />

        <h3 className="font-headline text-2xl font-bold">1. The Column Space, <InlineMath math="C(A)" />: The Range of All Possible Outputs</h3>
        <p>
            Think of the column space as the **destination**. It's the set of all possible output vectors that the transformation can actually produce. If a vector isn't in the column space, it's an impossible output for the matrix <InlineMath math="A" />.
        </p>
        <ul>
            <li><strong>Core Idea:</strong> The column space is the *span* of the column vectors of <InlineMath math="A" />. Every possible output is just some linear combination of these columns.</li>
            <li><strong>Dimension:</strong> The dimension of the column space is the **rank (r)** of the matrix.</li>
        </ul>

        <h4 className="font-headline text-xl font-bold">How to Find It: A Step-by-Step Guide</h4>
        <ol className="list-decimal pl-6">
            <li><strong>Identify the Columns:</strong> The columns of our matrix <InlineMath math="A" /> are <InlineMath math="c_1 = \begin{pmatrix} 1 \\ 2 \end{pmatrix}" />, <InlineMath math="c_2 = \begin{pmatrix} 1 \\ 1 \end{pmatrix}" />, and <InlineMath math="c_3 = \begin{pmatrix} 2 \\ 3 \end{pmatrix}" />.</li>
            <li><strong>Find the Pivot Columns:</strong> To find a basis, we find the linearly independent columns. We can do this by row-reducing A:
                <div className="text-center"><BlockMath math="\begin{pmatrix} 1 & 1 & 2 \\ 2 & 1 & 3 \end{pmatrix} \xrightarrow{R_2 \to R_2 - 2R_1} \begin{pmatrix} 1 & 1 & 2 \\ 0 & -1 & -1 \end{pmatrix}" /></div>
                The first and second columns have pivots, so the original first and second columns of <InlineMath math="A" /> form a basis.
            </li>
            <li><strong>Define the Space:</strong> The basis for <InlineMath math="C(A)" /> is <InlineMath math="\{ \begin{pmatrix} 1 \\ 2 \end{pmatrix}, \begin{pmatrix} 1 \\ 1 \end{pmatrix} \}" />.</li>
        </ol>
        <ul>
            <li><strong>Conclusion:</strong> The rank is **r = 2**. Since we have two linearly independent basis vectors in <InlineMath math="\mathbb{R}^2" />, they span the entire space.</li>
            <li><strong>Geometric Intuition:</strong> For our matrix <InlineMath math="A" />, the column space is all of <InlineMath math="\mathbb{R}^2" />. This means our transformation can produce **any** vector in the 2D output plane. There are no unreachable outputs.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">2. The Null Space, <InlineMath math="N(A)" />: What Gets Mapped to Zero</h3>
        <p>
            The null space (or kernel) is the "vanishing space." It's a collection of all input vectors that, after being transformed by <InlineMath math="A" />, land directly on the zero vector in the output space.
        </p>
        <ul>
            <li><strong>Core Idea:</strong> The null space contains all solutions to the equation <InlineMath math="A\vec{x} = \vec{0}" />.</li>
            <li><strong>Dimension:</strong> The dimension of the null space is **n - r**, where 'n' is the number of columns (the dimension of the input space).</li>
        </ul>

        <h4 className="font-headline text-xl font-bold">How to Find It: A Step-by-Step Guide</h4>
        <ol className="list-decimal pl-6">
            <li><strong>Set Up the Homogeneous Equation:</strong> We need to solve <InlineMath math="A\vec{x} = \vec{0}" />:
                <div className="text-center"><BlockMath math="\begin{pmatrix} 1 & 1 & 2 \\ 2 & 1 & 3 \end{pmatrix} \begin{pmatrix} x_1 \\ x_2 \\ x_3 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix}" /></div>
            </li>
            <li><strong>Row Reduce the Augmented Matrix:</strong>
                <div className="text-center"><BlockMath math="\begin{pmatrix} 1 & 1 & 2 & | & 0 \\ 2 & 1 & 3 & | & 0 \end{pmatrix} \rightarrow \begin{pmatrix} 1 & 0 & 1 & | & 0 \\ 0 & 1 & 1 & | & 0 \end{pmatrix}" /></div>
                (after full reduction)
            </li>
            <li><strong>Identify Pivot and Free Variables:</strong> The first two columns correspond to **pivot variables** (<InlineMath math="x_1, x_2" />), and the third column corresponds to a **free variable** (<InlineMath math="x_3" />). The free variable is what allows for non-zero solutions.</li>
            <li><strong>Express the General Solution:</strong> From the reduced form, we get the equations:
                <ul>
                    <li><InlineMath math="x_1 + x_3 = 0 \implies x_1 = -x_3" /></li>
                    <li><InlineMath math="x_2 + x_3 = 0 \implies x_2 = -x_3" /></li>
                </ul>
                Let the free variable <InlineMath math="x_3 = t" />. The solution vector is <InlineMath math="\vec{x} = \begin{pmatrix} -t \\ -t \\ t \end{pmatrix} = t \begin{pmatrix} -1 \\ -1 \\ 1 \end{pmatrix}" />.
            </li>
            <li><strong>Define the Space:</strong> A basis for the null space is the vector <InlineMath math="\begin{pmatrix} -1 \\ -1 \\ 1 \end{pmatrix}" />.</li>
        </ol>
        <ul>
            <li><strong>Conclusion:</strong> The dimension of the null space is **n - r = 3 - 2 = 1**.</li>
            <li><strong>Geometric Intuition:</strong> This is a **line** in the 3D input space. Any vector lying on this line gets "crushed" by the transformation and maps to the origin in the 2D output space.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">3. The Row Space, <InlineMath math="C(A^T)" />: The "Effective" Input Space</h3>
        <p>
            The row space is the part of the input domain that the transformation actually "sees" and acts upon. Any part of the input that is orthogonal to this space (i.e., the null space!) gets ignored by the transformation.
        </p>
        <ul>
            <li><strong>Core Idea:</strong> The row space is the span of the row vectors of <InlineMath math="A" />.</li>
            <li><strong>Dimension:</strong> The dimension of the row space is also the **rank (r)**.</li>
        </ul>

        <h4 className="font-headline text-xl font-bold">How to Find It: A Step-by-Step Guide</h4>
        <ol className="list-decimal pl-6">
            <li><strong>Identify the Rows:</strong> The rows of A are <InlineMath math="r_1 = \begin{pmatrix} 1 & 1 & 2 \end{pmatrix}" /> and <InlineMath math="r_2 = \begin{pmatrix} 2 & 1 & 3 \end{pmatrix}" />.</li>
            <li><strong>Find a Basis:</strong> The non-zero rows of the row-echelon form of A provide a clean basis. From our previous calculation: A basis for the row space is <InlineMath math="\{ \begin{pmatrix} 1 & 0 & 1 \end{pmatrix}, \begin{pmatrix} 0 & 1 & 1 \end{pmatrix} \}" />.</li>
            <li><strong>Define the Space:</strong> The span of these vectors forms the row space.</li>
        </ol>
        <ul>
            <li><strong>Conclusion:</strong> The dimension is **r = 2**.</li>
            <li><strong>Geometric Intuition:</strong> This is a **plane** in the 3D input space. The transformation takes this 2D plane from the input space and maps it perfectly onto the 2D column space in the output space.</li>
        </ul>
        <p><strong>Crucial Connection:</strong> The row space and the null space are **orthogonal complements**. Every vector in the row space is perpendicular to every vector in the null space. This is a cornerstone of linear algebra!</p>

        <hr />

        <h3 className="font-headline text-2xl font-bold">4. The Left Null Space, <InlineMath math="N(A^T)" />: The Unreachable Outputs</h3>
        <p>
            If the column space tells us where we *can* go, the left null space tells us what's fundamentally incompatible with our transformation's output. It's the set of vectors in the codomain that are orthogonal to all possible outputs.
        </p>
        <ul>
            <li><strong>Core Idea:</strong> The left null space contains all solutions to the equation <InlineMath math="A^T\vec{y} = \vec{0}" />. (It's called "left" because we can write this as <InlineMath math="\vec{y}^TA = \vec{0}^T" />).</li>
            <li><strong>Dimension:</strong> The dimension is **m - r**, where 'm' is the number of rows (the dimension of the output space).</li>
        </ul>

        <h4 className="font-headline text-xl font-bold">How to Find It: A Step-by-Step Guide</h4>
        <ol className="list-decimal pl-6">
            <li><strong>Find the Transpose:</strong> <InlineMath math="A^T = \begin{pmatrix} 1 & 2 \\ 1 & 1 \\ 2 & 3 \end{pmatrix}" />.</li>
            <li><strong>Solve <InlineMath math="A^T\vec{y} = \vec{0}" />:</strong> Row reduce the augmented matrix:
                <div className="text-center"><BlockMath math="\begin{pmatrix} 1 & 2 & | & 0 \\ 1 & 1 & | & 0 \\ 2 & 3 & | & 0 \end{pmatrix} \rightarrow \begin{pmatrix} 1 & 0 & | & 0 \\ 0 & 1 & | & 0 \\ 0 & 0 & | & 0 \end{pmatrix}" /></div>
                The only solution is <InlineMath math="y_1=0, y_2=0" />.
            </li>
        </ol>
        <ul>
            <li><strong>Conclusion:</strong> The only vector in the left null space is the zero vector <InlineMath math="\begin{pmatrix} 0 \\ 0 \end{pmatrix}" />. The dimension is **m - r = 2 - 2 = 0**.</li>
            <li><strong>Geometric Intuition:</strong> A dimension of zero means there are no constraints on the output. This confirms what we found earlier: the column space is the *entire* output space <InlineMath math="\mathbb{R}^2" />. There are no "unreachable" directions.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Summary: The Big Picture (The Fundamental Theorem of Linear Algebra)</h3>
        <p>These four spaces don't exist in isolation; they provide a perfect decomposition of our vector spaces.</p>

        <div className="not-prose">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subspace</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Dimension</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orthogonal To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><strong>Row Space</strong> <InlineMath math="C(A^T)" /></TableCell>
                <TableCell>Input Space (<InlineMath math="\mathbb{R}^3" />)</TableCell>
                <TableCell><InlineMath math="r = 2" /></TableCell>
                <TableCell>Effective Inputs</TableCell>
                <TableCell>Null Space</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Null Space</strong> <InlineMath math="N(A)" /></TableCell>
                <TableCell>Input Space (<InlineMath math="\mathbb{R}^3" />)</TableCell>
                <TableCell><InlineMath math="n - r = 1" /></TableCell>
                <TableCell>Inputs mapped to 0</TableCell>
                <TableCell>Row Space</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Column Space</strong> <InlineMath math="C(A)" /></TableCell>
                <TableCell>Output Space (<InlineMath math="\mathbb{R}^2" />)</TableCell>
                <TableCell><InlineMath math="r = 2" /></TableCell>
                <TableCell>Possible Outputs</TableCell>
                <TableCell>Left Null Space</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Left Null Space</strong> <InlineMath math="N(A^T)" /></TableCell>
                <TableCell>Output Space (<InlineMath math="\mathbb{R}^2" />)</TableCell>
                <TableCell><InlineMath math="m - r = 0" /></TableCell>
                <TableCell>Output Constraints</TableCell>
                <TableCell>Column Space</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p>The transformation <InlineMath math="A" /> acts as a bridge:</p>
        <ul>
            <li>It takes the **row space** (a plane in <InlineMath math="\mathbb{R}^3" />) and maps it one-to-one onto the **column space** (the entire plane in <InlineMath math="\mathbb{R}^2" />).</li>
            <li>It takes the **null space** (a line in <InlineMath math="\mathbb{R}^3" />) and crushes it into the **zero vector** in <InlineMath math="\mathbb{R}^2" />.</li>
        </ul>
      </div>
    </div>
  );
}
