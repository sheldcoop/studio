import numpy as np

def cholesky_decomposition(A):
    """
    Performs Cholesky decomposition on a symmetric, positive-definite matrix A.
    Returns the lower triangular matrix L such that A = L * L.T.
    """
    n = len(A)
    L = np.zeros_like(A, dtype=float)

    for i in range(n):
        for j in range(i + 1):
            s = sum(L[i, k] * L[j, k] for k in range(j))
            if i == j:
                # Diagonal elements
                val = A[i, i] - s
                if val <= 0:
                    raise np.linalg.LinAlgError("Matrix is not positive-definite.")
                L[i, j] = np.sqrt(val)
            else:
                # Off-diagonal elements
                if L[j, j] == 0:
                    raise np.linalg.LinAlgError("Division by zero. Matrix might not be positive-definite.")
                L[i, j] = (A[i, j] - s) / L[j, j]
    return L

# Example usage:
A = np.array([[4, 2, -2], 
              [2, 10, 2], 
              [-2, 2, 6]])

try:
    L = cholesky_decomposition(A)
    print("Original Matrix A:\n", A)
    print("\nLower triangular matrix L:\n", L)
    # Verification:
    # A_reconstructed = np.dot(L, L.T)
    # print("\nReconstructed Matrix (L * L.T):\n", A_reconstructed)
    # print("\nVerification successful:", np.allclose(A, A_reconstructed))
except np.linalg.LinAlgError as e:
    print(e)
