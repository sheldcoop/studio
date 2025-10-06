

const EPSILON = 1e-9; // Epsilon for floating point comparisons

/**
 * Solves a 2x2 system of linear equations Ax = b.
 * @param m - An object representing the augmented matrix [A|b].
 * @returns An object with x and y coordinates of the solution, or null if no unique solution exists.
 */
export const calculate2x2Solution = (m: { a11: number; a12: number; b1: number; a21: number; a22: number; b2: number; }) => {
    const det = m.a11 * m.a22 - m.a12 * m.a21;
    if (Math.abs(det) < EPSILON) return null;
    const x = (m.b1 * m.a22 - m.b2 * m.a12) / det;
    const y = (m.a11 * m.b2 - m.a21 * m.b1) / det;
    return { x, y };
};

/**
 * Calculates the eigenvalues and eigenvectors of a 2x2 matrix.
 * @param a - The top-left element of the matrix.
 * @param b - The top-right element of the matrix.
 * @param c - The bottom-left element of the matrix.
 * @param d - The bottom-right element of the matrix.
 * @returns An object containing the eigenvalues (lambda1, lambda2) and eigenvectors (v1, v2), or null if there are no real eigenvalues.
 */
export const calculateEigen = (a: number, b: number, c: number, d: number) => {
    const trace = a + d;
    const det = a * d - b * c;
    const discriminant = trace * trace - 4 * det;

    if (discriminant < 0) {
        return null; // No real eigenvalues
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const lambda1 = (trace + sqrtDiscriminant) / 2;
    const lambda2 = (trace - sqrtDiscriminant) / 2;

    const v1 = { x: 0, y: 0 };
    if (Math.abs(c) > EPSILON) {
        v1.x = lambda1 - d;
        v1.y = c;
    } else if (Math.abs(b) > EPSILON) {
        v1.x = b;
        v1.y = lambda1 - a;
    } else {
        v1.x = 1;
        v1.y = 0;
    }

    const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    if (len1 > 0) {
        v1.x /= len1;
        v1.y /= len1;
    }

    const v2 = { x: 0, y: 0 };
    if (Math.abs(lambda1 - lambda2) < EPSILON) {
        // Repeated eigenvalue: any perpendicular vector works for v2
        v2.x = -v1.y;
        v2.y = v1.x;
    } else {
        // Distinct eigenvalues: compute v2 normally
        if (Math.abs(c) > EPSILON) {
            v2.x = lambda2 - d;
            v2.y = c;
        } else if (Math.abs(b) > EPSILON) {
            v2.x = b;
            v2.y = lambda2 - a;
        } else {
            v2.x = 0;
            v2.y = 1;
        }
        
        const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        if (len2 > 0) {
            v2.x /= len2;
            v2.y /= len2;
        }
    }
    
    return { lambda1, lambda2, v1, v2 };
};

/**
 * Applies a 2x2 matrix transformation to a 2D vector.
 * Essential for visualizing linear transformations, rotations, scaling, and shearing operations.
 * @param v The vector to transform.
 * @param m The matrix to apply.
 * @returns The transformed vector.
 */
export const applyMatrix = (v: { x: number; y: number }, m: { a: number; b: number; c: number; d: number }): { x: number; y: number } => {
    return {
        x: m.a * v.x + m.b * v.y,
        y: m.c * v.x + m.d * v.y,
    };
};

/**
 * Returns the determinant value ad - bc for a 2x2 matrix.
 * @param matrix - The 2x2 matrix.
 * @returns The determinant of the matrix.
 */
export const calculateDeterminant = (matrix: { a: number, b: number, c: number, d: number }): number => {
    return matrix.a * matrix.d - matrix.b * matrix.c;
};

/**
 * Computes the product of two 2x2 matrices and returns the result matrix.
 * @param m1 - The first matrix.
 * @param m2 - The second matrix.
 * @returns The resulting matrix from m1 * m2.
 */
export const matrixMultiply = (m1: { a: number, b: number, c: number, d: number }, m2: { a: number, b: number, c: number, d: number }): { a: number, b: number, c: number, d: number } => {
    return {
        a: m1.a * m2.a + m1.b * m2.c,
        b: m1.a * m2.b + m1.b * m2.d,
        c: m1.c * m2.a + m1.d * m2.c,
        d: m1.c * m2.b + m1.d * m2.d,
    };
};

/**
 * Returns a rotation matrix for the given angle in radians.
 * @param angle - The angle in radians.
 * @returns A 2x2 rotation matrix.
 */
export const createRotationMatrix = (angle: number): { a: number, b: number, c: number, d: number } => {
    return {
        a: Math.cos(angle),
        b: -Math.sin(angle),
        c: Math.sin(angle),
        d: Math.cos(angle),
    };
};

/**
 * Returns a scaling matrix.
 * @param sx - The scaling factor in the x-direction.
 * @param sy - The scaling factor in the y-direction.
 * @returns A 2x2 scaling matrix.
 */
export const createScalingMatrix = (sx: number, sy: number): { a: number, b: number, c: number, d: number } => {
    return { a: sx, b: 0, c: 0, d: sy };
};

/**
 * Returns a shear matrix.
 * @param shx - The horizontal shear factor.
 * @param shy - The vertical shear factor.
 * @returns A 2x2 shear matrix.
 */
export const createShearMatrix = (shx: number, shy: number): { a: number, b: number, c: number, d: number } => {
    return { a: 1, b: shx, c: shy, d: 1 };
};

/**
 * Returns a reflection matrix across a specified axis.
 * @param axis - The axis of reflection ('x', 'y', or a vector).
 * @returns A 2x2 reflection matrix.
 */
export const createReflectionMatrix = (axis: 'x' | 'y' | { x: number, y: number }): { a: number, b: number, c: number, d: number } => {
    if (axis === 'x') {
        return { a: 1, b: 0, c: 0, d: -1 };
    }
    if (axis === 'y') {
        return { a: -1, b: 0, c: 0, d: 1 };
    }
    // Reflection across a line defined by a vector
    const lenSq = axis.x * axis.x + axis.y * axis.y;
    if (lenSq === 0) return { a: 1, b: 0, c: 0, d: 1 }; // Identity if zero vector
    const x2 = axis.x * axis.x;
    const y2 = axis.y * axis.y;
    const xy = axis.x * axis.y;
    return {
        a: (x2 - y2) / lenSq,
        b: 2 * xy / lenSq,
        c: 2 * xy / lenSq,
        d: (y2 - x2) / lenSq,
    };
};

/**
 * Inverts a 2x2 matrix.
 * @param matrix The matrix to invert.
 * @returns The inverted matrix, or null if the matrix is singular (not invertible).
 */
export const invertMatrix = (matrix: { a: number, b: number, c: number, d: number }): { a: number, b: number, c: number, d: number } | null => {
    const det = calculateDeterminant(matrix);
    if (Math.abs(det) < EPSILON) return null;
    const invDet = 1 / det;
    return {
        a: invDet * matrix.d,
        b: invDet * -matrix.b,
        c: invDet * -matrix.c,
        d: invDet * matrix.a,
    };
};

/**
 * Returns a 2x2 identity matrix.
 * @returns The identity matrix.
 */
export const identityMatrix = (): { a: number, b: number, c: number, d: number } => {
    return { a: 1, b: 0, c: 0, d: 1 };
};

/**
 * Creates a projection matrix that projects vectors onto the line defined by the 'onto' vector.
 * @param onto The vector defining the line to project onto.
 * @returns A 2x2 projection matrix.
 */
export const createProjectionMatrix = (onto: { x: number, y: number }): { a: number, b: number, c: number, d: number } => {
    const lenSq = onto.x * onto.x + onto.y * onto.y;
    if (lenSq === 0) return { a: 0, b: 0, c: 0, d: 0 };
    return {
        a: (onto.x * onto.x) / lenSq,
        b: (onto.x * onto.y) / lenSq,
        c: (onto.x * onto.y) / lenSq,
        d: (onto.y * onto.y) / lenSq,
    };
};

/**
 * Transposes a 2x2 matrix.
 * @param matrix The matrix to transpose.
 * @returns The transposed matrix.
 */
export const transposeMatrix = (matrix: { a: number, b: number, c: number, d: number }): { a: number, b: number, c: number, d: number } => {
    return { a: matrix.a, b: matrix.c, c: matrix.b, d: matrix.d };
};

/**
 * Calculates the trace of a 2x2 matrix (sum of diagonal elements).
 * @param matrix The matrix.
 * @returns The trace of the matrix.
 */
export const trace = (matrix: { a: number, b: number, c: number, d: number }): number => {
    return matrix.a + matrix.d;
};

/**
 * Calculates the dot product of two vectors.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @returns The dot product.
 */
export const dotProduct = (v1: { x: number, y: number }, v2: { x: number, y: number }): number => {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Calculates the 2D cross product of two vectors (magnitude of the resulting z-component).
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @returns The 2D cross product.
 */
export const crossProduct2D = (v1: { x: number, y: number }, v2: { x: number, y: number }): number => {
    return v1.x * v2.y - v1.y * v2.x;
};

/**
 * Computes the Singular Value Decomposition (SVD) of a 2x2 matrix A = UΣVᵀ.
 * @param matrix The matrix A = {a, b, c, d}.
 * @returns An object containing U, Sigma, and V, or null if decomposition fails.
 */
export const calculateSVD = (matrix: {a: number, b: number, c: number, d: number}) => {
    const { a, b, c, d } = matrix;
    const AtA = {
        a: a * a + c * c,
        b: a * b + c * d,
        c: a * b + c * d,
        d: b * b + d * d,
    };

    const trace = AtA.a + AtA.d;
    const det = AtA.a * AtA.d - AtA.b * AtA.c;
    const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));

    const lambda1 = (trace + discriminant) / 2;
    const lambda2 = (trace - discriminant) / 2;

    const s1 = Math.sqrt(lambda1);
    const s2 = Math.sqrt(lambda2);

    let v1 = { x: (Math.abs(AtA.c) < EPSILON) ? 1 : lambda1 - AtA.d, y: (Math.abs(AtA.c) < EPSILON) ? 0 : AtA.c };
    let len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    if (len1 > EPSILON) { v1.x /= len1; v1.y /= len1; }

    let v2 = { x: -v1.y, y: v1.x };
    
    let u1 = { x: 0, y: 0 };
    if (s1 > EPSILON) {
        u1 = { x: (a * v1.x + b * v1.y) / s1, y: (c * v1.x + d * v1.y) / s1 };
        const len_u1 = Math.sqrt(u1.x * u1.x + u1.y * u1.y);
        if (len_u1 > EPSILON) { u1.x /= len_u1; u1.y /= len_u1; }
    }

    let u2 = { x: 0, y: 0 };
    if (s2 > 1e-4) {
        const Av2_x = a * v2.x + b * v2.y;
        const Av2_y = c * v2.x + d * v2.y;
        u2 = { x: Av2_x / s2, y: Av2_y / s2 };
        const len_u2 = Math.sqrt(u2.x*u2.x + u2.y*u2.y);
        if (len_u2 > EPSILON) {
            u2.x /= len_u2;
            u2.y /= len_u2;
        }
    } else {
        u2 = { x: -u1.y, y: u1.x };
    }

    // Validate orthogonality
    const u_orthogonal = Math.abs(u1.x*u2.x + u1.y*u2.y) < 0.01;
    const v_orthogonal = Math.abs(v1.x*v2.x + v1.y*v2.y) < 0.01;

    if (!u_orthogonal || !v_orthogonal) {
        console.error('SVD orthogonality check failed', {
            u_dot: u1.x*u2.x + u1.y*u2.y,
            v_dot: v1.x*v2.x + v1.y*v2.y
        });
        return null;
    }
    
    return {
        U: { u1, u2 },
        Sigma: { s1, s2 },
        V: { v1, v2 }
    };
};
