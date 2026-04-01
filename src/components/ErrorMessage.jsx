export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-400 text-red-600 px-4 py-3 rounded-xl backdrop-blur-md shadow-md flex justify-between items-center">
      <p className="text-sm font-medium">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}