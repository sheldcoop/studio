
import numpy as np
from scipy.linalg import cholesky, lu_solve, lu_factor, qr, solve_triangular
from pyscript import document

def solve_decomposition(matrix_js, vector_js, operation):
    """
    Solves a linear system based on the specified decomposition method.
    Writes the output to a designated HTML element.
    """
    output_id = f"output-{operation}-solver"
    output_div = document.getElementById(output_id)
    
    try:
        # Convert JavaScript proxy objects to Python lists/arrays
        # .to_py() is not needed, numpy can handle the JS proxy directly
        A = np.array(matrix_js)
        if vector_js:
            b = np.array(vector_js)
        else:
            b = None
        
        result = ""
        
        if operation == 'cholesky':
            L = cholesky(A, lower=True)
            y = solve_triangular(L, b, lower=True)
            x = solve_triangular(L.T, y)
            result = f"Cholesky Factor L:\n{L}\n\nSolution x:\n{x}"
        
        elif operation == 'lu':
            lu, piv = lu_factor(A)
            x = lu_solve((lu, piv), b)
            result = f"LU Factors (packed):\n{lu}\n\nPivot indices:\n{piv}\n\nSolution x:\n{x}"
        
        elif operation == 'qr':
            Q, R = qr(A)
            # For Ax = b, we solve Rx = Q^T b
            y = np.dot(Q.T, b)
            x = solve_triangular(R, y)
            result = f"Orthogonal Matrix Q:\n{Q}\n\nUpper Triangular R:\n{R}\n\nSolution x:\n{x}"

        elif operation == 'svd':
            result = "SVD operation is for analysis, not direct solving. Please use another decomposition for solving Ax=b."
            # In a real scenario for SVD you might do image compression or analysis,
            # which would require a different setup. This is a placeholder.

        output_div.innerText = result

    except Exception as e:
        output_div.innerText = f"An error occurred:\n{e}"

