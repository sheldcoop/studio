
import {
  getMean,
  getVariance,
  getStdDev,
  getMedian,
  standardNormalPdf,
  standardNormalCdf,
  inverseStandardNormalCdf,
  generateNormalData,
} from '@/lib/math';

describe('math.ts utility functions', () => {
  describe('getMean', () => {
    it('calculates the mean of a set of numbers', () => {
      expect(getMean([1, 2, 3, 4, 5])).toBe(3);
    });

    it('returns 0 for an empty array', () => {
      expect(getMean([])).toBe(0);
    });

    it('handles negative numbers', () => {
      expect(getMean([-1, 0, 1])).toBe(0);
    });
  });

  describe('getVariance', () => {
    it('calculates the sample variance of a set of numbers', () => {
      // For [2, 4, 4, 4, 5, 5, 7, 9], variance is approx 4.57
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      expect(getVariance(data)).toBeCloseTo(4.5714, 4);
    });

    it('returns 0 for an array with less than 2 elements', () => {
      expect(getVariance([5])).toBe(0);
      expect(getVariance([])).toBe(0);
    });
  });

  describe('getStdDev', () => {
    it('calculates the sample standard deviation', () => {
      // Variance is 4.5714, so std dev is sqrt(4.5714) approx 2.138
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      expect(getStdDev(data)).toBeCloseTo(2.138, 3);
    });
  });

  describe('getMedian', () => {
    it('calculates the median for an odd number of elements', () => {
      expect(getMedian([1, 5, 2, 8, 7])).toBe(5);
    });

    it('calculates the median for an even number of elements', () => {
      expect(getMedian([1, 6, 2, 8, 7, 4])).toBe(5); // (4+6)/2
    });

     it('returns 0 for an empty array', () => {
      expect(getMedian([])).toBe(0);
    });
  });

  describe('standardNormalPdf', () => {
    it('calculates the PDF at the mean (z=0)', () => {
      expect(standardNormalPdf(0)).toBeCloseTo(0.3989, 4);
    });

    it('calculates the PDF for a value away from the mean', () => {
      expect(standardNormalPdf(1)).toBeCloseTo(0.242, 3);
      expect(standardNormalPdf(-1)).toBeCloseTo(0.242, 3);
    });
  });

  describe('standardNormalCdf', () => {
    it('calculates the CDF at the mean (z=0)', () => {
      expect(standardNormalCdf(0)).toBeCloseTo(0.5, 4);
    });

    it('calculates the CDF for positive and negative values', () => {
      expect(standardNormalCdf(1.96)).toBeCloseTo(0.975, 3);
      expect(standardNormalCdf(-1.96)).toBeCloseTo(0.025, 3);
    });
  });

   describe('inverseStandardNormalCdf', () => {
    it('calculates the Z-score for a given probability at the mean', () => {
      expect(inverseStandardNormalCdf(0.5)).toBeCloseTo(0);
    });

    it('calculates the Z-score for common confidence levels', () => {
      // 95% confidence interval two-tail
      expect(inverseStandardNormalCdf(0.975)).toBeCloseTo(1.96, 2);
      expect(inverseStandardNormalCdf(0.025)).toBeCloseTo(-1.96, 2);
      // 99% confidence interval two-tail
      expect(inverseStandardNormalCdf(0.995)).toBeCloseTo(2.576, 3);
    });

     it('returns NaN for probabilities outside (0, 1)', () => {
        expect(inverseStandardNormalCdf(0)).toBeNaN();
        expect(inverseStandardNormalCdf(1)).toBeNaN();
        expect(inverseStandardNormalCdf(-0.1)).toBeNaN();
        expect(inverseStandardNormalCdf(1.1)).toBeNaN();
    });
  });

  describe('generateNormalData', () => {
    it('generates the correct number of data points', () => {
        const data = generateNormalData(100, 15, 50);
        expect(data.length).toBe(50);
    });

    it('returns an empty array if n <= 0', () => {
        expect(generateNormalData(100, 15, 0)).toEqual([]);
        expect(generateNormalData(100, 15, -1)).toEqual([]);
    });
  });

});
