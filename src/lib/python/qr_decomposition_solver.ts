
import numpy as np

# Let's solve a simple least-squares problem
# We want to fit a line (y = mx + c) to three data points
# (0,1), (1,3), (2,4)

# This gives the system:
# c + 0*m = 1
# c + 1*m = 3
# c + 2*m = 4

A = np.array([[1., 0.],
              [1., 1.],
              [1., 2.]])
b = np.array([1., 3., 4.])

# 1. Decompose the matrix A
Q, R = np.linalg.qr(A)

# 2. Solve Rx = Q^T b for the least-squares solution
# First, compute Q^T b
QTb = Q.T @ b

# Now, solve the simple upper-triangular system
# We can use a general solver for this last step
coeffs = np.linalg.solve(R, QTb)

c, m = coeffs[0], coeffs[1]

result_string = """--- Matrix A ---
{}

--- Decomposed Matrices ---
Q (Orthogonal):
{}

R (Upper Triangular):
{}

--- Solution ---
The best fit line is y = {:.2f}x + {:.2f}
""".format(A, np.round(Q, 4), np.round(R, 4), m, c)

pyscript.write("output-qr-solver", result_string)
`

    