


/**
 * Generates normally distributed random data using the central limit theorem approximation.
 * @param mean - The desired mean.
 * @param stdDev - The desired standard deviation.
 * @param n - The number of data points.
 * @returns An array of normally distributed numbers.
 */
export const generateNormalData = (mean: number, stdDev: number, n: number) => {
  if (stdDev < 0 || n <= 0) return [];
  return Array.from(
    { length: n },
    () =>
      mean +
      stdDev *
        (Math.random() * 2 -
          1 +
          (Math.random() * 2 - 1) +
          (Math.random() * 2 - 1))
  );
}

/**
 * Generates skewed data using a log-normal distribution.
 * This is a standard method for creating skewed data, often used to model
 * variables that cannot be negative, like stock prices.
 * @param mu - The mean of the underlying normal distribution.
 * @param sigma - The standard deviation of the underlying normal distribution.
 * @param n - The number of data points.
 * @returns An array of log-normally distributed numbers.
 */
export const generateLogNormalData = (mu: number, sigma: number, n: number) => {
  if (sigma < 0 || n <= 0) return [];
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    // Use the Box-Muller transform to get a standard normal random number
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    // Exponentiate the normal random number to get a log-normal one
    data.push(Math.exp(mu + sigma * z));
  }
  return data;
};


/**
 * Generates beta-distributed random data.
 * The Beta distribution is defined on the interval [0, 1] and is controlled by two shape parameters, alpha and beta.
 * @param alpha - The alpha shape parameter.
 * @param beta - The beta shape parameter.
 * @param n - The number of data points.
 * @returns An array of beta-distributed numbers.
 */
export const generateBetaData = (alpha: number, beta: number, n: number) => {
    if (alpha <= 0 || beta <= 0 || n <= 0) return [];
    
    // This is a simplified method for generating Beta variates.
    // It's not the most efficient but works for visualization.
    const gamma = (a: number): number => {
        // A simple approximation for the gamma function
        if (a === 1) return 1;
        if (a === 0.5) return Math.sqrt(Math.PI);
        return (a - 1) * gamma(a - 1);
    }
    
    const data = [];
    for(let i = 0; i < n; i++) {
        const x = Math.pow(Math.random(), 1/alpha);
        const y = Math.pow(Math.random(), 1/beta);
        // This is a simplification; a full implementation is more complex
        const rand = x / (x + y); 
        if(isFinite(rand)) {
            data.push(rand);
        }
    }
    return data;
}

/**
 * Generates uniformly distributed random data.
 * @param min The minimum value of the distribution.
 * @param max The maximum value of the distribution.
 * @param n The number of data points.
 * @returns An array of uniformly distributed numbers.
 */
export const generateUniformData = (min: number, max: number, n: number) => {
  if (n <= 0) return [];
  return Array.from({ length: n }, () => min + Math.random() * (max - min));
};


/**
 * Generates exponentially distributed random data.
 * @param rate - The rate parameter (lambda).
 * @param n - The number of data points.
 * @returns An array of exponentially distributed numbers.
 */
export const generateExponentialData = (rate: number, n: number) => {
    if (rate <= 0 || n <= 0) return [];
    return Array.from({ length: n }, () => -Math.log(Math.random()) / rate);
}

/**
 * Generates Poisson-distributed random data using the Knuth algorithm.
 * @param lambda - The average rate of events.
 * @param n - The number of data points to generate.
 * @returns An array of Poisson-distributed numbers.
 */
export const generatePoissonData = (lambda: number, n: number) => {
    if (lambda < 0 || n <= 0) return [];
    const data = [];
    for (let i = 0; i < n; i++) {
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        data.push(k - 1);
    }
    return data;
}

/**
 * Calculates the mean of a set of numbers.
 * @param data - An array of numbers.
 * @returns The mean of the numbers.
 */
export const getMean = (data: number[]) =>
  data.length > 0 ? data.reduce((a, b) => a + b, 0) / data.length : 0;

/**
 * Calculates the sample variance of a set of numbers.
 * @param data - An array of numbers.
 * @returns The sample variance.
 */
export const getVariance = (data: number[]) => {
  if (data.length < 2) return 0;
  const mean = getMean(data);
  return (
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    (data.length - 1)
  );
};

/**
 * Calculates the standard deviation of a set of numbers.
 * @param data An array of numbers.
 * @returns The standard deviation.
 */
export const getStdDev = (data: number[]): number => {
    if (data.length < 2) return 0;
    return Math.sqrt(getVariance(data));
}


/**
 * Calculates the median of a set of numbers.
 * @param data An array of numbers.
 * @returns The median.
 */
export const getMedian = (data: number[]): number => {
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculates the mode of a set of numbers based on histogram bins.
 * This is an approximation for continuous data.
 * @param data An array of numbers.
 * @param bins The number of bins to use for the histogram.
 * @returns The midpoint of the most frequent bin.
 */
export const getMode = (data: number[], bins = 30): number => {
    if (data.length === 0) return 0;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogram = new Map<number, number>();

    for (const val of data) {
        const bin = Math.floor((val - min) / binWidth);
        histogram.set(bin, (histogram.get(bin) || 0) + 1);
    }

    let maxFreq = 0;
    let modeBin = -1;
    for (const [bin, freq] of histogram.entries()) {
        if (freq > maxFreq) {
            maxFreq = freq;
            modeBin = bin;
        }
    }
    
    return min + (modeBin + 0.5) * binWidth;
}

/**
 * Calculates the skewness of a set of numbers.
 * @param data An array of numbers.
 * @returns The sample skewness.
 */
export const getSkewness = (data: number[]): number => {
    if (data.length < 3) return 0;
    const n = data.length;
    const mean = getMean(data);
    const stdDev = getStdDev(data);
    if (stdDev === 0) return 0;
    
    const m3 = data.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
    return (m3 / Math.pow(stdDev, 3)) * (n * n) / ((n-1) * (n-2)); // Adjusted Fisher-Pearson coefficient
}

/**
 * Calculates the excess kurtosis of a set of numbers.
 * @param data An array of numbers.
 * @returns The sample excess kurtosis.
 */
export const getKurtosis = (data: number[]): number => {
    if (data.length < 4) return 0;
    const n = data.length;
    const mean = getMean(data);
    const stdDev = getStdDev(data);
    if (stdDev === 0) return 0;

    const m4 = data.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / n;
    const numerator = (n + 1) * (n - 1) * ((m4 / Math.pow(stdDev, 4)) - 3 + (6 / (n + 1)));
    const denominator = (n - 2) * (n - 3);

    return numerator / denominator;
}

/**
 * Calculates the standard normal cumulative distribution function (CDF).
 * @param x The value to calculate the CDF for.
 * @returns The probability P(Z <= x) for a standard normal variable Z.
 */
export const standardNormalCdf = (x: number): number => {
    // Abramowitz and Stegun approximation
    const p  =  0.2316419;
    const b1 =  0.319381530;
    const b2 = -0.356563782;
    const b3 =  1.781477937;
    const b4 = -1.821255978;
    const b5 =  1.330274429;
    const t = 1 / (1 + p * Math.abs(x));
    const term = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
    const cdf = standardNormalPdf(x) * term;
    return x > 0 ? 1 - cdf : cdf;
};

/**
 * Calculates the standard normal probability density function (PDF).
 * @param x The value to calculate the PDF for.
 * @returns The density of the standard normal distribution at x.
 */
export const standardNormalPdf = (x: number): number => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Calculates the inverse of the standard normal CDF (quantile function).
 * Uses the Peter John Acklam's algorithm for high precision.
 * @param p The probability (must be between 0 and 1).
 * @returns The Z-score corresponding to the given probability.
 */
export const inverseStandardNormalCdf = (p: number): number => {
    if (p <= 0 || p >= 1) return NaN;

    // Constants for the approximation
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

    if (p < 0.02425) {
        const q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / (((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1));
    } else if (p > 0.97575) {
        const q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / (((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1));
    } else {
        const q = p - 0.5;
        const r = q * q;
        return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / ((((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)));
    }
}

/**
 * Solves a 2x2 system of linear equations Ax = b.
 * @param m - An object representing the augmented matrix [A|b].
 * @returns An object with x and y coordinates of the solution, or null if no unique solution exists.
 */
export const calculate2x2Solution = (m: { a11: number; a12: number; b1: number; a21: number; a22: number; b2: number; }) => {
    const det = m.a11 * m.a22 - m.a12 * m.a21;
    if (Math.abs(det) < 1e-9) return null;
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
    if (Math.abs(c) > 0.001) {
        v1.x = lambda1 - d;
        v1.y = c;
    } else if (Math.abs(b) > 0.001) {
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
    if (Math.abs(c) > 0.001) {
        v2.x = lambda2 - d;
        v2.y = c;
    } else if (Math.abs(b) > 0.001) {
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
    


