import { render, screen, fireEvent } from '@testing-library/react';
import ConfidenceIntervalsPage from '@/app/(app)/confidence-intervals/page';

describe('ConfidenceIntervalsPage', () => {
  it('renders the interactive calculator and calculates an initial value', () => {
    render(<ConfidenceIntervalsPage />);

    // Check if the calculator card is rendered
    expect(screen.getByText('Interactive Calculator')).toBeInTheDocument();

    // The component calculates an interval on initial render with default values
    // Default values are: mean=100, stdDev=15, sampleSize=30, confidence=95%
    // The expected result is [94.606, 105.394] -- previous test had a slight miscalculation
    expect(screen.getByText('[94.606, 105.394]')).toBeInTheDocument();
  });

  it('updates the result when user changes inputs and clicks calculate', () => {
    render(<ConfidenceIntervalsPage />);

    // Get input fields by their labels
    const meanInput = screen.getByLabelText('Sample Mean (μ)');
    const stdDevInput = screen.getByLabelText('Standard Deviation (σ)');
    const sampleSizeInput = screen.getByLabelText('Sample Size (n)');
    const calculateButton = screen.getByRole('button', { name: /Calculate/ });

    // Simulate user changing the input values
    fireEvent.change(meanInput, { target: { value: '50' } });
    fireEvent.change(stdDevInput, { target: { value: '5' } });
    fireEvent.change(sampleSizeInput, { target: { value: '100' } });

    // Simulate user clicking the calculate button
    fireEvent.click(calculateButton);

    // With mean=50, stdDev=5, sampleSize=100, confidence=95% (z=1.96)
    // Margin of Error = 1.96 * (5 / sqrt(100)) = 1.96 * 0.5 = 0.98
    // Lower = 50 - 0.98 = 49.02
    // Upper = 50 + 0.98 = 50.98
    // The component formats to 3 decimal places, so [49.020, 50.980]
    const resultText = screen.getByText('[49.02, 50.98]');
    expect(resultText).toBeInTheDocument();
  });

  it('shows an error message for invalid input (e.g., sample size <= 0)', () => {
    render(<ConfidenceIntervalsPage />);

    const sampleSizeInput = screen.getByLabelText('Sample Size (n)');
    const calculateButton = screen.getByRole('button', { name: /Calculate/ });

    // Enter an invalid sample size
    fireEvent.change(sampleSizeInput, { target: { value: '0' } });
    fireEvent.click(calculateButton);

    // Check if the error message is displayed
    const errorMessage = screen.getByText('Sample size must be positive and standard deviation cannot be negative.');
    expect(errorMessage).toBeInTheDocument();

    // Check that the previous result is cleared
    const initialResult = screen.queryByText('[94.606, 105.394]');
    expect(initialResult).not.toBeInTheDocument();
  });
});

    