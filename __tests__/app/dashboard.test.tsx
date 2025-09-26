import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(app)/dashboard/page';
import { quantJourney } from '@/lib/data';

// Mock the AnimatedTagline component to avoid dealing with its animation logic in this test
jest.mock('@/components/app/animated-tagline', () => ({
  AnimatedTagline: () => <div data-testid="animated-tagline">Mocked Tagline</div>,
}));

describe('DashboardPage', () => {
  it('renders the main heading, tagline, and all journey cards', () => {
    render(<DashboardPage />);

    // Check for the mocked tagline
    expect(screen.getByTestId('animated-tagline')).toBeInTheDocument();

    // Check for the introductory paragraph
    expect(
      screen.getByText(
        /Master the core pillars of quantitative finance and data science/i
      )
    ).toBeInTheDocument();

    // Check that all cards from the quantJourney data are rendered
    quantJourney.forEach((item) => {
      // Check for the card title
      expect(screen.getByText(item.title)).toBeInTheDocument();

      // Check for the card description
      expect(screen.getByText(item.description)).toBeInTheDocument();

      // Check that the card is a link pointing to the correct href
      const link = screen.getByText(item.title).closest('a');
      expect(link).toHaveAttribute('href', item.href);
    });
  });
});