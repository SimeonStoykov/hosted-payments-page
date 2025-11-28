import { ReactNode } from 'react';

interface PaymentPageLayoutProps {
  children: ReactNode;
  contentClassName?: string;
}

export function PaymentPageLayout({
  children,
  contentClassName = '',
}: PaymentPageLayoutProps) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div
        className={`w-full max-w-md bg-white p-[25px] rounded-[10px] ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
