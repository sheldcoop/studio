
/**
 * Generates normally distributed random data.
 * @param mean - The desired mean.
 * @param stdDev - The desired standard deviation.
 * @param n - The number of data points.
 * @returns An array of normally distributed numbers.
 */
export const generateNormalData = (mean: number, stdDev: number, n: number) =>
  Array.from(
    { length: n },
    () =>
      mean +
      stdDev *
        (Math.random() * 2 -
          1 +
          (Math.random() * 2 - 1) +
          (Math.random() * 2 - 1))
  );

/**
 * Generates skewed data using a log-normal distribution.
 * @param mu - The mean of the underlying normal distribution.
 * @param sigma - The standard deviation of the underlying normal distribution.
 * @param n - The number of data points.
 * @returns An array of log-normally distributed numbers.
 */
export const generateLogNormalData = (mu: number, sigma: number, n: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    data.push(Math.exp(mu + sigma * z));
  }
  return data;
};

/**
 * Generates uniformly distributed random data.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param n - The number of data points.
 * @returns An array of uniformly distributed numbers.
 */
export const generateUniformData = (min: number, max: number, n: number) => {
    return Array.from({ length: n }, () => min + Math.random() * (max - min));
}

/**
 * Generates exponentially distributed random data.
 * @param rate - The rate parameter (lambda).
 * @param n - The number of data points.
 * @returns An array of exponentially distributed numbers.
 */
export const generateExponentialData = (rate: number, n: number) => {
    return Array.from({ length: n }, () => -Math.log(Math.random()) / rate);
}

/**
 * Generates Poisson-distributed random data using the Knuth algorithm.
 * @param lambda - The average rate of events.
 * @param n - The number of data points to generate.
 * @returns An array of Poisson-distributed numbers.
 */
export const generatePoissonData = (lambda: number, n: number) => {
    const data = [];
    for (let i = 0; i < n; i++) {
        let L = Math.exp(-lambda);
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
 * Calculates the standard normal cumulative distribution function (CDF).
 * @param x The value to calculate the CDF for.
 * @returns The probability P(Z <= x) for a standard normal variable Z.
 */
export const standardNormalCdf = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) prob = 1 - prob;
    return prob;
};

    