import numpy as np

def lu_decomposition(A):
    """
    Perform LU decomposition on matrix A.
    Returns L (lower triangular) and U (upper triangular) matrices.
    """
    n = len(A)
    L = np.eye(n)
    U = A.copy()
    
    for i in range(n):
        for j in range(i + 1, n):
            factor = U[j, i] / U[i, i]
            L[j, i] = factor
            U[j, i:] -= factor * U[i, i:]
    
    return L, U

# Example usage
A = np.array([[4, 3], [6, 3]])
L, U = lu_decomposition(A)
print("L matrix:\n", L)
print("U matrix:\n", U)
