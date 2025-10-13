
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


export default function RowSpaceAndLeftNullSpacePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Row Space & The Left Null Space"
        description="Completing the Picture of the Four Fundamental Subspaces"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We have spent a great deal of time focusing on the <strong>columns</strong> of our matrix `A`. The columns gave us the **Column Space** (`C(A)`), which told us about the possible outputs of our transformation. The relationship between the columns gave us the **Null Space** (`N(A)`), which told us about the inputs that get lost.
        </p>
        <p>
          But what about the **rows**? The rows of a matrix are vectors too. They must have a story to tell. By exploring the world of the rows, we will uncover the final two pieces of our puzzle: the **Row Space** and the **Left Null Space**.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Row Space: The World of "Effective" Inputs</CardTitle>
          <CardDescription>
            The **Row Space** of a matrix `A`, written as `C(Aᵀ)`, is the **span of the row vectors of `A`**.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This seems straightforward, but what does it *mean*? If the Column Space is the space of all possible outputs, the Row Space represents the space of **"effective" inputs**. It is the part of the input space that the matrix `A` actually "pays attention to" and transforms into the output space. Any part of an input vector that is orthogonal to the Row Space will be "ignored" by the transformation and sent to zero. In fact, the Row Space is the **orthogonal complement** of the Null Space.
          </p>
          <Alert>
            <AlertTitle>Key Idea</AlertTitle>
            <AlertDescription>
              The matrix `A` acts as a perfect, one-to-one mapping from its Row Space to its Column Space.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Finding a Basis for the Row Space</CardTitle>
          <CardDescription>
            This is where Gaussian Elimination shines once again, and in a much simpler way than for the other subspaces. The **non-zero rows of the Row Echelon Form (REF)** of `A` form a basis for the Row Space of `A`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h4 className="font-semibold">Example:</h4>
          <p>Let's use our familiar matrix `A`:</p>
          <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix}" />
          <p>We already found its REF, which we called `U`:</p>
          <BlockMath math="U = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />
          <p>The non-zero rows of `U` are `[1, 2, 3, 4]` and `[0, 0, 1, 1]`. A basis for the Row Space of `A` is:</p>
          <BlockMath math="\{ [1, 2, 3, 4], [0, 0, 1, 1] \}" />
          <p>The dimension of the Row Space is **Two**. What was the dimension of the Column Space (the rank)? **Two**.</p>
          <Alert variant="default" className="border-primary/50">
            <AlertTitle className="font-semibold">Profound Result</AlertTitle>
            <AlertDescription>
                The dimension of the Row Space is always equal to the dimension of the Column Space. <br/> <strong className="font-mono">dim(Row Space) = dim(Column Space) = rank(A)</strong>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Left Null Space: The Final Piece</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>To find the fourth space, we follow the pattern. The **Left Null Space** of `A` is the Null Space of `Aᵀ`. It is the set of all vectors `y` such that `Aᵀy = 0`.</p>
          <p>It's called the "Left" Null Space because if we transpose the equation `Aᵀy = 0`, we get `(Aᵀy)ᵀ = 0ᵀ`, which simplifies to `yᵀA = 0`. The vector `y` is on the *left* of `A`.</p>
          <p>The Left Null Space is the orthogonal complement to the Column Space. It is the set of all vectors that are perpendicular to every single vector in the Column Space. If the Column Space is a plane in 3D, the Left Null Space is the line (the normal vector) that is perpendicular to that plane.</p>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Grand Unification: The Fundamental Theorem of Linear Algebra</CardTitle>
            <CardDescription>
                For any `m x n` matrix `A` with rank `r`, the four fundamental subspaces have the following properties and relationships.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subspace</TableHead>
                        <TableHead>Lives In</TableHead>
                        <TableHead>Basis From</TableHead>
                        <TableHead>Dimension</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Column Space <InlineMath math="C(A)"/></TableCell>
                        <TableCell>Output Space (<InlineMath math="\mathbb{R}^m"/>)</TableCell>
                        <TableCell>Pivot columns of original `A`</TableCell>
                        <TableCell className="font-bold">rank `r`</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Null Space <InlineMath math="N(A)"/></TableCell>
                        <TableCell>Input Space (<InlineMath math="\mathbb{R}^n"/>)</TableCell>
                        <TableCell>Special solutions from RREF</TableCell>
                        <TableCell className="font-bold">`n - r`</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Row Space <InlineMath math="C(A^T)"/> </TableCell>
                        <TableCell>Input Space (<InlineMath math="\mathbb{R}^n"/>)</TableCell>
                        <TableCell>Non-zero rows of REF</TableCell>
                        <TableCell className="font-bold">rank `r`</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Left Null Space <InlineMath math="N(A^T)"/> </TableCell>
                        <TableCell>Output Space (<InlineMath math="\mathbb{R}^m"/>)</TableCell>
                        <TableCell>Free variables of `Aᵀ`</TableCell>
                        <TableCell className="font-bold">`m - r`</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div>
                <h4 className="font-semibold">Part 1: The Dimensions</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Input Space: `dim(Row Space) + dim(Null Space) = r + (n-r) = n`</li>
                    <li>Output Space: `dim(Column Space) + dim(Left Null Space) = r + (m-r) = m`</li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold">Part 2: The Orthogonality</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>The **Row Space** is the **orthogonal complement** of the **Null Space**.</li>
                    <li>The **Column Space** is the **orthogonal complement** of the **Left Null Space**.</li>
                </ul>
            </div>

             <p className="prose-p:my-0">This is the big picture. This is the complete, elegant, geometric theory of what any matrix `A` *is* and *does*. It takes the entire input space, splits it into two perpendicular subspaces (Row Space and Null Space), and transforms one into the Column Space while annihilating the other.</p>
          </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        **Up Next:** We have now completed the entire theoretical core of solving `Ax=b` and understanding the structure of `A`. We will now pivot to a new, major topic: **Determinants**.
      </p>
    </div>
  );
}
