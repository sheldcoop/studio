import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/components/app/page-header';

describe('PageHeader', () => {
  it('renders the title and description', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    render(<PageHeader title={title} description={description} />);

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('applies the centered variant by default', () => {
    const { container } = render(<PageHeader title="Centered Title" />);
    // The variant adds a class to the container div of the component
    // We check for the class associated with the 'centered' variant
    expect(container.firstChild).toHaveClass('items-center');
  });

  it('applies the aligned-left variant when specified', () => {
    const { container } = render(
      <PageHeader title="Left-Aligned Title" variant="aligned-left" />
    );
    // We check for the class associated with the 'aligned-left' variant
    expect(container.firstChild).toHaveClass('items-start');
  });

  it('renders children when provided', () => {
    render(
      <PageHeader title="Title with Children">
        <button>Click Me</button>
      </PageHeader>
    );
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('truncates long titles', () => {
     render(<PageHeader title="A very very long title that should be truncated" />);
     const heading = screen.getByRole('heading');
     // The 'truncate' class from Tailwind CSS is applied
     expect(heading).toHaveClass('truncate');
  });
});
