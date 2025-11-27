interface ErrorMessageProps {
  backgroundColor?: string;
  title?: string;
  message: string;
}

export function ErrorMessage({
  backgroundColor = '#EBEDF3',
  title = 'Error',
  message,
}: ErrorMessageProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
