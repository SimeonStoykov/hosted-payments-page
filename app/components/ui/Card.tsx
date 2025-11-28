interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white p-[25px] ${className}`}
      style={{ borderRadius: '10px' }}
    >
      {children}
    </div>
  );
}
