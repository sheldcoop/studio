
import { type SubTopic } from './types';

export const matrixOperationsTheory: SubTopic[] = [
    {
        id: 'matrix-addition-subtraction',
        title: 'Matrix Addition & Subtraction',
    },
    {
        id: 'scalar-multiplication',
        title: 'Scalar Multiplication',
    },
    {
        id: 'matrix-multiplication',
        title: 'Matrix Multiplication',
    },
    {
        id: 'matrix-transpose',
        title: 'The Matrix Transpose',
    },
];

export function MatrixAdditionTheory() {
    return `
        <p>Matrix addition and subtraction are the most straightforward operations. They work just like they do with single numbers (scalars), but on an element-by-element basis. The only rule is that the matrices must have the <strong>exact same dimensions</strong>.</p>
        <p>If you have two matrices, A and B, their sum C = A + B is calculated by adding the corresponding elements: C<sub>ij</sub> = A<sub>ij</sub> + B<sub>ij</sub>.</p>
        <div class="text-center my-4 text-sm md:text-base">
            <pre class="bg-muted/50 p-2 rounded-md inline-block">
[ a , b ]   [ e , f ]   [ a+e , b+f ]
          +           =
[ c , d ]   [ g , h ]   [ c+g , d+h ]
            </pre>
        </div>
        <p>In finance, this is used to aggregate data. For example, you could add a matrix of a portfolio's returns from one month to a matrix of returns from the next month to get the total two-month return for each asset.</p>
    `;
}

export function ScalarMultiplicationTheory() {
    return `
        <p>Scalar multiplication involves multiplying an entire matrix by a single number (a scalar). This operation scales every single element in the matrix by the scalar value.</p>
        <p>If 'k' is our scalar and A is our matrix, the resulting matrix B = kA is found by B<sub>ij</sub> = k * A<sub>ij</sub>.</p>
         <div class="text-center my-4 text-sm md:text-base">
            <pre class="bg-muted/50 p-2 rounded-md inline-block">
      [ a , b ]   [ ka , kb ]
k  *  [ c , d ] = [ kc , kd ]
            </pre>
        </div>
        <p>This is frequently used for portfolio weighting. If you have a matrix representing the returns of several assets, you can multiply it by a scalar (e.g., 0.5) to see the effect of allocating 50% of your capital to that strategy.</p>
    `;
}

export function MatrixMultiplicationTheory() {
    return `
        <p>Matrix multiplication is the most complex of the basic operations, but it's also the most powerful. It represents the <strong>composition of linear transformations</strong>. If you apply one transformation (Matrix B) and then another (Matrix A), the combined effect is the same as applying their product (Matrix C = AB).</p>
        <p>To multiply two matrices, the number of columns in the first matrix must equal the number of rows in the second. The element C<sub>ij</sub> in the resulting matrix is found by taking the <strong>dot product</strong> of the i-th row of the first matrix and the j-th column of the second matrix.</p>
        <div class="text-center my-4 text-sm md:text-base">
             <pre class="bg-muted/50 p-2 rounded-md inline-block">
[ a , b ]   [ e , f ]   [ ae+bg , af+bh ]
          *           =
[ c , d ]   [ g , h ]   [ ce+dg , cf+dh ]
            </pre>
        </div>
        <p class="font-bold text-destructive">Crucially, matrix multiplication is not commutative: in general, AB ≠ BA.</p>
        <p>In finance, this is used everywhere from calculating portfolio variance (w<sup>T</sup>Σw) to transitioning between states in Markov chains for credit risk modeling.</p>
    `;
}

export function MatrixTransposeTheory() {
    return `
        <p>The transpose of a matrix, denoted as A<sup>T</sup>, is found by "flipping" the matrix over its main diagonal. The rows of the original matrix become the columns of the transposed matrix, and the columns become the rows.</p>
        <p>If A is an m x n matrix, then A<sup>T</sup> is an n x m matrix where (A<sup>T</sup>)<sub>ij</sub> = A<sub>ji</sub>.</p>
         <div class="text-center my-4 text-sm md:text-base">
            <pre class="bg-muted/50 p-2 rounded-md inline-block">
      [ a , b ] T   [ a , c ]
      [ c , d ]   = [ b , d ]
            </pre>
        </div>
        <p>The transpose is fundamental to many linear algebra concepts. For example, a matrix is <strong>symmetric</strong> if A = A<sup>T</sup>. Covariance matrices in finance are always symmetric, which grants them special properties (like having real eigenvalues and orthogonal eigenvectors) that are essential for portfolio optimization techniques like PCA.</p>
    `;
}
