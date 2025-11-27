interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white shadow-xl border border-gray-100 ${className}`}
      style={{ borderRadius: '10px' }}
    >
      <div className="p-6">{children}</div>
    </div>
  );
}
