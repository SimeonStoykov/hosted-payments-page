import { render, screen } from '@testing-library/react';
import { Card } from '../../app/components/ui/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className to outer div', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies default contentClassName', () => {
    const { container } = render(<Card>Content</Card>);
    // The inner div should have p-[25px] by default
    const innerDiv = container.firstChild?.firstChild;
    expect(innerDiv).toHaveClass('p-[25px]');
  });

  it('applies custom contentClassName', () => {
    const { container } = render(
      <Card contentClassName="custom-padding">Content</Card>,
    );
    const innerDiv = container.firstChild?.firstChild;
    expect(innerDiv).toHaveClass('custom-padding');
  });
});
