export function ErrorState({
  message = "Ocurrió un error",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="w-full rounded-md border border-red-200 bg-red-50 text-red-800 p-3 flex items-center justify-between gap-3"
      role="alert"
    >
      <span className="text-sm">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
