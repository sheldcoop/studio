
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DefinitionCard } from '@/components/app/definition-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

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
          We have spent a great deal of time focusing on the **columns** of our matrix `A`, which gave us the **Column Space** (`C(A)`) and the **Null Space** (`N(A)`).
        </p>
        <p>
          But what about the **rows**? The rows of a matrix are vectors too. By exploring the world of the rows, we will uncover the final two pieces of our puzzle: the **Row Space** and the **Left Null Space**.
        </p>
      </article>

      <DefinitionCard title="The Row Space: The World of 'Effective' Inputs">
        <p>The **Row Space** of a matrix `A`, written as `C(Aᵀ)`, is the **span of the row vectors of `A`**.</p>
        <p className="mt-2">It represents the space of **"effective" inputs**—the part of the input space that the matrix `A` actually "pays attention to." Any part of an input vector that is orthogonal to the Row Space will be "ignored" by the transformation and sent to zero. In fact, the Row Space is the **orthogonal complement** of the Null Space.</p>
        <KeyConceptAlert title="Key Idea">
          The matrix `A` acts as a perfect, one-to-one mapping from its Row Space to its Column Space.
        </KeyConceptAlert>
      </DefinitionCard>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Finding a Basis for the Row Space</CardTitle>
          <CardDescription>
            The **non-zero rows of the Row Echelon Form (REF)** of `A` form a basis for the Row Space of `A`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>For our familiar matrix `A` and its REF, `U`:</p>
          <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix} \quad \xrightarrow{} \quad U = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />
          <p>A basis for the Row Space of `A` is:</p>
          <BlockMath math="\{ [1, 2, 3, 4], [0, 0, 1, 1] \}" />
          <KeyConceptAlert title="Profound Result">
            The dimension of the Row Space is always equal to the dimension of the Column Space. <br/> <strong className="font-mono">dim(Row Space) = dim(Column Space) = rank(A)</strong>
          </KeyConceptAlert>
        </CardContent>
      </Card>

      <DefinitionCard title="The Left Null Space: The Final Piece">
        <p>The **Left Null Space** of `A` is the Null Space of `Aᵀ`. It is the set of all vectors `y` such that `Aᵀy = 0`.</p>
        <p className="mt-2">It's called the "Left" Null Space because if we transpose the equation `Aᵀy = 0`, we get `yᵀA = 0`, so the vector `y` is on the *left* of `A`.</p>
        <p className="mt-2">The Left Null Space is the orthogonal complement to the Column Space.</p>
      </DefinitionCard>
      
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
                        <TableHead>Dimension</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow><TableCell className="font-semibold">Column Space <InlineMath math="C(A)"/></TableCell><TableCell>Output Space (<InlineMath math="\mathbb{R}^m"/>)</TableCell><TableCell className="font-bold">`r`</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Null Space <InlineMath math="N(A)"/></TableCell><TableCell>Input Space (<InlineMath math="\mathbb{R}^n"/>)</TableCell><TableCell className="font-bold">`n - r`</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Row Space <InlineMath math="C(A^T)"/> </TableCell><TableCell>Input Space (<InlineMath math="\mathbb{R}^n"/>)</TableCell><TableCell className="font-bold">`r`</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Left Null Space <InlineMath math="N(A^T)"/> </TableCell><TableCell>Output Space (<InlineMath math="\mathbb{R}^m"/>)</TableCell><TableCell className="font-bold">`m - r`</TableCell></TableRow>
                </TableBody>
            </Table>
            <p className="prose-p:my-0">This is the big picture. This is the complete, elegant, geometric theory of what any matrix `A` *is* and *does*. It takes the entire input space, splits it into two perpendicular subspaces (Row Space and Null Space), and transforms one into the Column Space while annihilating the other.</p>
          </CardContent>
      </Card>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-geometric-meaning-of-the-determinant">
        Determinants
      </NextUpNavigation>
    </div>
  );
}
