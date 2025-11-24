interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
