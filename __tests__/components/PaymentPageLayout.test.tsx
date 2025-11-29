import { render, screen } from '@testing-library/react';
import { PaymentPageLayout } from '../../app/components/PaymentPageLayout';

describe('PaymentPageLayout', () => {
  it('renders children correctly', () => {
    render(<PaymentPageLayout>Test Content</PaymentPageLayout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default styles to outer container', () => {
    const { container } = render(
      <PaymentPageLayout>Content</PaymentPageLayout>,
    );
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('min-h-screen');
    expect(outerDiv).toHaveClass('flex');
    expect(outerDiv).toHaveClass('items-center');
    expect(outerDiv).toHaveClass('justify-center');
  });

  it('applies default styles to inner content container', () => {
    const { container } = render(
      <PaymentPageLayout>Content</PaymentPageLayout>,
    );
    const innerDiv = container.firstChild?.firstChild;
    expect(innerDiv).toHaveClass('w-full');
    expect(innerDiv).toHaveClass('max-w-md');
    expect(innerDiv).toHaveClass('bg-white');
    expect(innerDiv).toHaveClass('p-[25px]');
    expect(innerDiv).toHaveClass('rounded-[10px]');
  });

  it('applies custom contentClassName', () => {
    const { container } = render(
      <PaymentPageLayout contentClassName="px-[22px]">
        Content
      </PaymentPageLayout>,
    );
    const innerDiv = container.firstChild?.firstChild;
    expect(innerDiv).toHaveClass('px-[22px]');
  });
});
