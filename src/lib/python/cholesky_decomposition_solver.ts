
export const choleskyDecompositionSolverCode = `
import numpy as np
from scipy.linalg import cholesky, cho_solve

# Our symmetric positive definite matrix A and vector b
A = np.array([[4., 2., -2.],
              [2., 10., 2.],
              [-2., 2., 6.]])
b = np.array([2., 14., 6.])

# 1. Decompose the matrix A
# The 'cholesky' function expects a lower triangular matrix by default
L = cholesky(A, lower=True)

# 2. Solve the system Ax = b using the factor L
# This internally solves Ly=b and then L^T x = y
x = cho_solve((L, True), b)

# Prepare the output string
result_string = f"""--- System Matrices ---
Matrix A:
{A}

Vector b:
{b}

--- Decomposition ---
Cholesky Factor L:
{L}

--- Solution ---
The solution vector x is:
{x}

--- Verification (A @ x) ---
{A @ x}
"""
pyscript.write("output-cholesky-solver", result_string)
`;
