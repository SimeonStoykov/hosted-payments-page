interface CardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Card({
  children,
  className = '',
  contentClassName = '',
}: CardProps) {
  return (
    <div
      className={`bg-white shadow-xl border border-gray-100 p-[25px] ${className}`}
      style={{ borderRadius: '10px' }}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
