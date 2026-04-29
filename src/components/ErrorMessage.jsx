function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded-lg flex justify-between items-center">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      )}
    </div>
  );
}
export default ErrorMessage