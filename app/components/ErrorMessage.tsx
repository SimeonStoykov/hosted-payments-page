interface ErrorMessageProps {
  backgroundColor?: string;
  title?: string;
  message: string;
}

export function ErrorMessage({
  backgroundColor,
  title = 'Error',
  message,
}: ErrorMessageProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-bvnk-gray">{message}</p>
      </div>
    </div>
  );
}
