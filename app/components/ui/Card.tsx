interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}
    >
      <div className="p-6">{children}</div>
    </div>
  );
}
