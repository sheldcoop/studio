
import numpy as np
from scipy.linalg import cholesky, cho_solve, lu_solve, lu_factor
from pyscript.ffi import to_py

def solve_cholesky(A_js, b_js):
    """Solves Ax = b using Cholesky decomposition."""
    try:
        A = np.array(to_py(A_js))
        b = np.array(to_py(b_js))
        
        L = cholesky(A, lower=True)
        x = cho_solve((L, True), b)
        
        return f"""--- Cholesky Decomposition ---
Matrix A:
{A}

Vector b:
{b}

--- Decomposition ---
Factor L:
{np.round(L, 4)}

--- Solution ---
Solution x: {np.round(x, 4)}
Verification (A @ x): {np.round(A @ x, 4)}
"""
    except Exception as e:
        return f"Error in Cholesky decomposition: {e}"

def solve_lu(A_js, b_js):
    """Solves Ax = b using LU decomposition."""
    try:
        A = np.array(to_py(A_js))
        b = np.array(to_py(b_js))

        lu_piv = lu_factor(A)
        x = lu_solve(lu_piv, b)

        return f"""--- LU Decomposition ---
Matrix A:
{A}

Vector b:
{b}

--- Solution ---
Solution x: {np.round(x, 4)}
Verification (A @ x): {np.round(A @ x, 4)}
"""
    except Exception as e:
        return f"Error in LU decomposition: {e}"

def solve_qr(A_js, b_js):
    """Solves Ax = b using QR decomposition for least-squares."""
    try:
        A = np.array(to_py(A_js))
        b = np.array(to_py(b_js))

        Q, R = np.linalg.qr(A)
        QTb = Q.T @ b
        coeffs = np.linalg.solve(R, QTb)
        
        c, m = coeffs[0], coeffs[1]

        return f"""--- QR Decomposition (Least Squares) ---
Matrix A (for y=mx+c):
{A}

Vector b:
{b}

--- Decomposed Matrices ---
Q (Orthogonal):
{np.round(Q, 4)}

R (Upper Triangular):
{np.round(R, 4)}

--- Solution ---
The best fit line is y = {m:.2f}x + {c:.2f}
"""
    except Exception as e:
        return f"Error in QR decomposition: {e}"

def solve_decomposition(matrix_js, vector_js, operation):
    """Main function to be called from JavaScript."""
    if operation == 'cholesky':
        return solve_cholesky(matrix_js, vector_js)
    elif operation == 'lu':
        return solve_lu(matrix_js, vector_js)
    elif operation == 'qr':
        return solve_qr(matrix_js, vector_js)
    else:
        return f"Unknown operation: {operation}"

# Make the function available in the global scope for JS to call
from pyscript import __all__
__all__.append('solve_decomposition')
