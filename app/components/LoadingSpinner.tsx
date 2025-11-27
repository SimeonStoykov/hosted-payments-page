interface LoadingSpinnerProps {
  backgroundColor?: string;
}

export function LoadingSpinner({
  backgroundColor = '#EBEDF3',
}: LoadingSpinnerProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
