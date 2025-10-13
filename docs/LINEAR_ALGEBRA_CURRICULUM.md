# Learning Path: Linear Algebra for Quants

## Module 1: Foundations of Vectors & Matrices

- **Lesson 1: The Two Views of a Vector:** Vectors as geometric arrows vs. vectors as ordered lists of numbers (the data science view).
- **Lesson 2: Vector Operations:** Addition, subtraction (tip-to-tail rule), and scalar multiplication (stretching/shrinking).
- **Lesson 3: The Dot Product, Norms, and Angles:** The dot product as a measure of "projection" or "agreement." L1 and L2 norms as measures of length/magnitude. Cosine similarity as a practical application.
- **Lesson 4: Orthogonality:** The concept of perpendicular vectors (dot product = 0) and its meaning: independence.
- **Lesson 5: The Two Views of a Matrix:** A matrix as a container for data (a collection of vectors) vs. a matrix as a linear transformation that moves, rotates, and scales space.
- **Lesson 6: Matrix Operations:** Addition, scalar multiplication, and the transpose.
- **Lesson 7: Matrix Multiplication:** Taught not just as a rule, but as the composition of linear transformations. This explains why AB ≠ BA.
- **Lesson 8: Special Matrices:** Identity matrix (the "do nothing" operation), inverse matrix (the "undo" operation), diagonal, triangular, and symmetric matrices.
- **Lesson 9: Linear Combinations and Span:** What can you build with a set of vectors?
- **Lesson 10: Linear Independence:** Identifying and removing redundant vectors.
- **Lesson 11: Basis and Dimension:** The minimal set of vectors needed to define a space and the concept of its dimension.
- **Lesson 12: Vector Spaces and Subspaces:** Formalizing these concepts. A subspace as a "plane" or "line" within a higher-dimensional space that passes through the origin.

## Module 2: Solving Linear Systems & The Four Subspaces

- **Lesson 1: Framing the Problem: Ax=b:** Understanding Ax=b from the row picture (intersection of planes) and the column picture (linear combination of columns).
- **Lesson 2: Gaussian Elimination:** The core algorithm for solving linear systems. Row operations, row echelon form (REF), and reduced row echelon form (RREF).
- **Lesson 3: The Solutions to Ax=b:** Identifying if a system has a unique solution, no solution, or infinitely many solutions from its RREF.
- **Lesson 4: LU Decomposition:** The 'matrix version' of Gaussian Elimination. Solving Ax=b becomes a fast, two-step process of forward and back substitution.
- **Lesson 5: Column Space & Rank:** The space of all possible outputs of A. The concept of rank as the "true dimension" of the output space.
- **Lesson 6: The Null Space:** The space of all inputs that map to the zero vector. Its connection to multicollinearity in data.
- **Lesson 7: Row Space & Left Null Space:** Completing the picture of the four fundamental subspaces.
- **Lesson 8: The Fundamental Theorem of Linear Algebra:** How the four subspaces relate to each other and partition the input and output spaces.

## Module 3: Determinants

- **Lesson 1: The Geometric Meaning of the Determinant:** The determinant as the scaling factor of area/volume.
- **Lesson 2: Calculation and Properties:** Cofactor expansion and the properties of determinants. A determinant of zero means the matrix squishes space into a lower dimension (i.e., it's not invertible).

## Module 4: Eigenvalues, Eigenvectors, & Eigendecompositions

- **Lesson 1: Eigenvalues & Eigenvectors:** Finding the 'special' vectors that are only scaled by a transformation, not rotated off their span (Ax = λx).
- **Lesson 2: The Characteristic Equation:** The calculation behind eigenvalues: solving det(A - λI) = 0.
- **Lesson 3: Diagonalization (PDP⁻¹):** Decomposing a matrix into its core components: 'changing to the eigenbasis, scaling, and changing back.'
- **Lesson 4: Applications of Eigen-analysis:** Using eigenvalues for tasks like calculating matrix powers (e.g., for Markov chains).
- **Lesson 5: The Spectral Theorem:** For symmetric matrices (like covariance matrices), the eigendecomposition is especially beautiful and stable (A = QDQᵀ). This is the theoretical foundation of PCA.
- **Lesson 6: The Cholesky Decomposition (LLᵀ):** A highly efficient specialization for symmetric, positive-definite matrices, often used in optimization and financial modeling.

## Module 5: The Inexact Problem: Least Squares & QR Decomposition

- **Lesson 1: The Best Possible Solution:** What to do when `Ax=b` has no exact solution. Introducing the goal of minimizing the error `||Ax - b||`.
- **Lesson 2: The Geometry of "Best Fit": Projections:** How to find the closest point in a subspace (the Column Space) to an external vector (`b`).
- **Lesson 3: The Algebraic Solution: The Normal Equations:** Deriving `AᵀAx̂ = Aᵀb` from the projection geometry. This is the engine of **Linear Regression**.
- **Lesson 4: The Problem with the Normal Equations:** Understanding why `AᵀA` can be ill-conditioned and lead to numerical errors.
- **Lesson 5: The Stable Solution: The Gram-Schmidt Process:** An algorithm for creating a "nice" orthonormal basis from any starting basis.
- **Lesson 6: The QR Decomposition:** Using Gram-Schmidt to factor `A=QR`. This makes solving the least squares problem trivial and numerically robust.

## Module 6: The Grand Finale - SVD & Its Applications

- **Lesson 1: The Singular Value Decomposition (SVD):** The ultimate decomposition (`A = UΣVᵀ`) that works for any matrix and finds orthonormal bases for all four fundamental subspaces simultaneously.
- **Lesson 2: Principal Component Analysis (PCA):** A direct, powerful application of SVD on the data matrix for dimensionality reduction.
- **Lesson 3: Advanced SVD Applications:** Low-rank approximation for noise reduction, and the core ideas behind recommendation systems.

## Module 7: Applications in Finance

- **Lesson 1: Portfolio Optimization & The Efficient Frontier**
- **Lesson 2: The Capital Asset Pricing Model (CAPM)**
- **Lesson 3: Risk Management & Factor Models**
- **Lesson 4: Arbitrage & The Fundamental Theorem of Asset Pricing**
- **Lesson 5: Fixed Income (Bond) Mathematics**
