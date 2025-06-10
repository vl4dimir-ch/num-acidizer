export function LoadingCounter() {
  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter</h2>
        <div className="text-8xl font-bold text-gray-400 mb-8 animate-pulse">
          ...
        </div>
        <p className="text-gray-600">Loading counter...</p>
      </div>
    </div>
  );
} 