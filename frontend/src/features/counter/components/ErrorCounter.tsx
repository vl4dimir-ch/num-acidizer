import { ApiError } from '../../../lib/api/client';
import { Button } from '../../../components/ui/Button';

interface ErrorCounterProps {
  error: Error | ApiError;
  onRetry: () => void;
}

export function ErrorCounter({ error, onRetry }: ErrorCounterProps) {
  const errorMessage = error instanceof ApiError 
    ? error.message 
    : 'An unexpected error occurred';

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter</h2>
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
        <Button
          onClick={onRetry}
          variant="outline"
          size="md"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
} 