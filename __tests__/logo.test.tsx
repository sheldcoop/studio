import { render, screen } from '@testing-library/react';
import { Logo } from '@/components/app/logo';

describe('Logo', () => {
  it('renders the QuantFinance Lab logo', () => {
    render(<Logo />);

    // Check if the text "QuantFinance" is present
    const quantText = screen.getByText('QuantFinance');
    expect(quantText).toBeInTheDocument();

    // Check if the text "Lab" is present
    const prepText = screen.getByText('Lab');
    expect(prepText).toBeInTheDocument();

    // Check that "Lab" is a tspan for color styling
    expect(prepText.tagName).toBe('TSPAN');
  });
});
