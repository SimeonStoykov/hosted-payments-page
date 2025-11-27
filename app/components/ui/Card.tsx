interface CardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Card({
  children,
  className = '',
  contentClassName = 'p-[25px]',
}: CardProps) {
  return (
    <div
      className={`bg-white shadow-xl border border-gray-100 ${className}`}
      style={{ borderRadius: '10px' }}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
