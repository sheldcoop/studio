
# solver.py

import numpy as np
from scipy.linalg import lu, qr, cholesky, svd, solve
from pyscript import document

def get_matrix_string(m):
    return '\n'.join(['\t'.join([f'{cell:.2f}' for cell in row]) for row in m])

def get_vector_string(v):
    return '\t'.join([f'{cell:.2f}' for cell in v])

def solve_decomposition(matrix_js, vector_js, operation):
    """
    Solves a system of linear equations using a specified decomposition method
    or performs SVD-based image compression.
    """
    output_id = f"output-{operation}-solver"
    output_div = document.querySelector(f"#{output_id}")

    try:
        if operation == 'svd':
            # This is a special case for the SVD image compression demo.
            # It doesn't use the input matrix/vector.
            import io
            import matplotlib.pyplot as plt
            from PIL import Image

            # Generate a sample image with NumPy instead of downloading one
            width, height = 128, 128
            image_array = np.zeros((height, width), dtype=np.uint8)
            for i in range(height):
                for j in range(width):
                    image_array[i, j] = (i + j) % 256
            
            img = Image.fromarray(image_array, 'L') # 'L' for grayscale

            # Convert image to numpy array
            img_grey = np.array(img)

            # Perform SVD
            U, s, Vt = svd(img_grey)

            output_str = "SVD Image Compression Demo\n"
            output_str += "----------------------------\n"
            output_str += f"Original image shape: {img_grey.shape}\n"
            output_str += f"U shape: {U.shape}\n"
            output_str += f"s (singular values) shape: {s.shape}\n"
            output_str += f"Vt shape: {Vt.shape}\n\n"
            output_str += "Reconstructing image with different numbers of singular values...\n"

            # Reconstruct with different numbers of components
            num_components = [5, 15, 50]
            for k in num_components:
                # Reconstruct the matrix using the first k singular values
                reconst_matrix = np.dot(U[:, :k], np.dot(np.diag(s[:k]), Vt[:k, :]))
                output_str += f"\nReconstructed with k={k}:\n"
                output_str += f"  - Shape: {reconst_matrix.shape}\n"
                # Here you would typically display the image, but in this text-based output,
                # we'll just confirm the reconstruction happened.
                output_str += f"  - Min/Max pixel value: {reconst_matrix.min():.2f} / {reconst_matrix.max():.2f}\n"

            output_str += "\nThis demonstrates how an image can be approximated with fewer singular values, forming the basis of compression."
            pyscript.write(output_id, output_str)

        else:
            # Handle standard matrix decompositions (LU, QR, Cholesky)
            A = np.array(matrix_js)
            b = np.array(vector_js)

            if operation == 'lu':
                P, L, U = lu(A)
                y = solve(L, P @ b)
                x = solve(U, y)
                output_str = (
                    f"LU Decomposition:\n"
                    f"A:\n{get_matrix_string(A)}\n\n"
                    f"L (Lower):\n{get_matrix_string(L)}\n\n"
                    f"U (Upper):\n{get_matrix_string(U)}\n\n"
                    f"Solution x:\n{get_vector_string(x)}"
                )
            elif operation == 'qr':
                Q, R = qr(A)
                y = Q.T @ b
                x = solve(R, y)
                output_str = (
                    f"QR Decomposition:\n"
                    f"A:\n{get_matrix_string(A)}\n\n"
                    f"Q (Orthogonal):\n{get_matrix_string(Q)}\n\n"
                    f"R (Upper Triangular):\n{get_matrix_string(R)}\n\n"
                    f"Solution x:\n{get_vector_string(x)}"
                )
            elif operation == 'cholesky':
                L = cholesky(A, lower=True)
                y = solve(L, b)
                x = solve(L.T, y)
                output_str = (
                    f"Cholesky Decomposition:\n"
                    f"A:\n{get_matrix_string(A)}\n\n"
                    f"L (Lower Triangular):\n{get_matrix_string(L)}\n\n"
                    f"L Transpose:\n{get_matrix_string(L.T)}\n\n"
                    f"Solution x:\n{get_vector_string(x)}"
                )
            else:
                output_str = f"Error: Unknown operation '{operation}'"
            
            pyscript.write(output_id, output_str)

    except Exception as e:
        # This will catch Python-side errors (e.g., matrix is not invertible)
        pyscript.write(output_id, f"An error occurred in the Python calculation:\n{str(e)}")

```