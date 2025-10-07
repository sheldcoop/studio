
export const luDecompositionSolverCode = `
import numpy as np
from scipy.linalg import lu_solve, lu_factor

# Define our matrix A and vector b
A = np.array([[2., 1., 1.], [4., 5., 2.], [2., -2., 0.]])
b = np.array([5., 14., -2.])

# 1. Decompose A into P, L, and U
# For performance, when solving for the same A many times,
# it's best to factor once and solve many times.
lu_piv = lu_factor(A)

# 2. Solve the system for x
x = lu_solve(lu_piv, b)

# Prepare the output string
result_string = f"""--- System Matrices ---
Matrix A:
{A}

Vector b:
{b}

--- Solution ---
The solution vector x is:
{np.round(x, 4)}

--- Verification (A @ x) ---
{np.round(A @ x, 4)}
"""
pyscript.write("output-lu-solver", result_string)
`

    