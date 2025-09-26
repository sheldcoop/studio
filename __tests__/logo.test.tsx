import { render, screen } from '@testing-library/react';
import { Logo } from '@/components/app/logo';

describe('Logo', () => {
  it('renders the QuantPrep logo', () => {
    render(<Logo />);

    // Check if the text "Quant" is present
    const quantText = screen.getByText('Quant');
    expect(quantText).toBeInTheDocument();

    // Check if the text "Prep" is present
    const prepText = screen.getByText('Prep');
    expect(prepText).toBeInTheDocument();

    // Check that "Prep" is a tspan for color styling
    expect(prepText.tagName).toBe('tspan');
  });
});
